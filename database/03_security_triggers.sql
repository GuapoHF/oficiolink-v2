-- =============================================================================
-- OFICIOLINK — 03_security_triggers.sql
-- Controles #5 (AES-256), #8 (Anti-Mass Assignment), #10 (Bcrypt Cost 12),
-- #11 (Brute-Force Lockout), #13 (Auditoría y pg_stat_statements) y #17 (Vista Segura)
-- =============================================================================

-- =============================================================================
-- 1. CONTROL #5: CIFRADO SIMÉTRICO AES-256 PARA DATOS SENSIBLES (PII)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.encrypt_pii_aes256(
  p_plain_text TEXT,
  p_encryption_key TEXT
)
RETURNS BYTEA
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_plain_text IS NULL OR trim(p_plain_text) = '' THEN
    RETURN NULL;
  END IF;
  RETURN pgp_sym_encrypt(
    p_plain_text,
    p_encryption_key,
    'cipher-algo=aes256, compress-algo=1'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_pii_aes256(
  p_cipher_bytes BYTEA,
  p_encryption_key TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_cipher_bytes IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN pgp_sym_decrypt(p_cipher_bytes, p_encryption_key);
END;
$$;

-- =============================================================================
-- 2. CONTROL #10: HASHING DE CONTRASEÑAS CON FACTOR DE COSTO >= 12 RONDAS
-- =============================================================================
CREATE OR REPLACE FUNCTION public.hash_password_bcrypt_12(p_raw_password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF char_length(p_raw_password) < 10 THEN
    RAISE EXCEPTION 'SECURITY_POLICY_VIOLATION: La contraseña debe tener al menos 10 caracteres.';
  END IF;
  -- Factor de costo mínimo 12 rondas (Blowfish / bcrypt)
  RETURN crypt(p_raw_password, gen_salt('bf', 12));
END;
$$;

-- =============================================================================
-- 3. CONTROL #8: TRIGGER ANTI-MASS ASSIGNMENT EN `users_profiles`
-- Bloquea cualquier intento de un usuario normal de alterar `role`,
-- `is_identity_verified`, `rating_avg`, `total_reviews` o `completed_jobs`.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.fn_prevent_profile_mass_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_jwt_role TEXT := current_setting('request.jwt.claim.role', true);
BEGIN
  -- Solo `service_role`, triggers internos o un usuario con rol `admin` pueden modificar campos protegidos
  IF v_jwt_role IS DISTINCT FROM 'service_role' AND NOT public.is_admin_user() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'MASS_ASSIGNMENT_BLOCKED: No tienes permiso para modificar el campo protegido [role].';
    END IF;

    IF NEW.is_identity_verified IS DISTINCT FROM OLD.is_identity_verified THEN
      RAISE EXCEPTION 'MASS_ASSIGNMENT_BLOCKED: El estado [is_identity_verified] solo puede ser modificado por el proceso de verificación oficial.';
    END IF;

    IF NEW.rating_avg IS DISTINCT FROM OLD.rating_avg
       OR NEW.total_reviews IS DISTINCT FROM OLD.total_reviews
       OR NEW.completed_jobs IS DISTINCT FROM OLD.completed_jobs THEN
      RAISE EXCEPTION 'MASS_ASSIGNMENT_BLOCKED: Las métricas de reputación son calculadas automáticamente por el motor de reseñas verificadas.';
    END IF;
  END IF;

  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_privilege_escalation ON public.users_profiles;
CREATE TRIGGER trg_prevent_profile_privilege_escalation
  BEFORE UPDATE ON public.users_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_prevent_profile_mass_assignment();

-- =============================================================================
-- 4. RECÁLCULO AUTOMÁTICO DE REPUTACIÓN AL INSERTAR RESEÑA VERIFICADA
-- =============================================================================
CREATE OR REPLACE FUNCTION public.fn_recalculate_specialist_reputation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_avg NUMERIC(3, 2);
  v_new_total INTEGER;
BEGIN
  SELECT
    COALESCE(ROUND(AVG(overall_rating), 2), 5.00),
    COUNT(*)
  INTO v_new_avg, v_new_total
  FROM public.verified_reviews
  WHERE specialist_id = NEW.specialist_id;

  -- Ejecución privilegiada controlada para actualizar métricas del especialista
  PERFORM set_config('request.jwt.claim.role', 'service_role', true);

  UPDATE public.users_profiles
  SET
    rating_avg = v_new_avg,
    total_reviews = v_new_total,
    completed_jobs = completed_jobs + 1,
    updated_at = NOW()
  WHERE id = NEW.specialist_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_recalculate_specialist_reputation ON public.verified_reviews;
CREATE TRIGGER trg_recalculate_specialist_reputation
  AFTER INSERT ON public.verified_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_recalculate_specialist_reputation();

-- =============================================================================
-- 5. CONTROL #11: PROTECCIÓN BRUTE-FORCE (MÁX 5 INTENTOS CADA 15 MINUTOS)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.record_login_attempt(
  p_user_id UUID,
  p_is_success BOOLEAN,
  p_ip_hash VARCHAR(64),
  p_user_agent VARCHAR(255)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempts SMALLINT;
  v_locked_until TIMESTAMPTZ;
BEGIN
  SELECT failed_login_attempts, locked_until
  INTO v_attempts, v_locked_until
  FROM public.users_profiles
  WHERE id = p_user_id;

  -- Verificar si la cuenta está actualmente bloqueada
  IF v_locked_until IS NOT NULL AND v_locked_until > NOW() THEN
    INSERT INTO public.security_audit_logs (
      actor_user_id, event_type, severity, target_table, target_record_id, ip_hash, user_agent, metadata
    ) VALUES (
      p_user_id, 'AUTH_BRUTE_FORCE_LOCKED', 'CRITICAL', 'users_profiles', p_user_id::TEXT, p_ip_hash, p_user_agent,
      jsonb_build_object('locked_until', v_locked_until, 'failed_attempts', v_attempts)
    );

    RETURN jsonb_build_object(
      'allowed', FALSE,
      'locked', TRUE,
      'locked_until', v_locked_until,
      'message', 'Cuenta bloqueada temporalmente por exceso de intentos fallidos (15 minutos).'
    );
  END IF;

  IF p_is_success THEN
    UPDATE public.users_profiles
    SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW()
    WHERE id = p_user_id;

    INSERT INTO public.security_audit_logs (
      actor_user_id, event_type, severity, target_table, target_record_id, ip_hash, user_agent
    ) VALUES (
      p_user_id, 'AUTH_LOGIN_SUCCESS', 'INFO', 'users_profiles', p_user_id::TEXT, p_ip_hash, p_user_agent
    );

    RETURN jsonb_build_object('allowed', TRUE, 'locked', FALSE);
  ELSE
    v_attempts := COALESCE(v_attempts, 0) + 1;
    IF v_attempts >= 5 THEN
      v_locked_until := NOW() + INTERVAL '15 minutes';
    END IF;

    UPDATE public.users_profiles
    SET failed_login_attempts = v_attempts, locked_until = v_locked_until
    WHERE id = p_user_id;

    INSERT INTO public.security_audit_logs (
      actor_user_id, event_type, severity, target_table, target_record_id, ip_hash, user_agent, metadata
    ) VALUES (
      p_user_id,
      CASE WHEN v_attempts >= 5 THEN 'AUTH_ACCOUNT_LOCKOUT_TRIGGERED' ELSE 'AUTH_LOGIN_FAILED' END,
      CASE WHEN v_attempts >= 5 THEN 'CRITICAL' ELSE 'WARN' END,
      'users_profiles',
      p_user_id::TEXT,
      p_ip_hash,
      p_user_agent,
      jsonb_build_object('attempt_number', v_attempts, 'max_allowed', 5)
    );

    RETURN jsonb_build_object(
      'allowed', FALSE,
      'locked', v_attempts >= 5,
      'remaining_attempts', GREATEST(0, 5 - v_attempts),
      'locked_until', v_locked_until
    );
  END IF;
END;
$$;

-- =============================================================================
-- 6. CONTROL #13: TRIGGER DE AUDITORÍA AUTOMÁTICA PARA OPERACIONES CRÍTICAS
-- =============================================================================
CREATE OR REPLACE FUNCTION public.fn_audit_critical_table_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    actor_user_id,
    event_type,
    severity,
    target_table,
    target_record_id,
    metadata
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME || '_' || TG_OP,
    CASE WHEN TG_TABLE_NAME = 'identity_verifications' THEN 'CRITICAL' ELSE 'INFO' END,
    TG_TABLE_NAME,
    COALESCE(NEW.id::TEXT, OLD.id::TEXT),
    jsonb_build_object('operation', TG_OP, 'timestamp', NOW())
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_identity_verifications ON public.identity_verifications;
CREATE TRIGGER trg_audit_identity_verifications
  AFTER INSERT OR UPDATE OR DELETE ON public.identity_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_audit_critical_table_changes();

DROP TRIGGER IF EXISTS trg_audit_service_requests ON public.service_requests;
CREATE TRIGGER trg_audit_service_requests
  AFTER INSERT OR UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_audit_critical_table_changes();

-- =============================================================================
-- 7. CONTROL #17: VISTA PÚBLICA SEGURA (PROHÍBE SELECT * Y OCULTA PII/HASHES)
-- =============================================================================
CREATE OR REPLACE VIEW public.v_public_specialists_directory AS
SELECT
  up.id,
  up.full_name,
  up.avatar_url,
  up.cover_url,
  up.headline,
  up.city,
  up.coverage_zones,
  up.bio,
  up.is_identity_verified,
  up.rating_avg,
  up.total_reviews,
  up.completed_jobs,
  st.trade_category_id AS primary_trade,
  tc.short_name AS primary_trade_label,
  st.years_experience,
  st.base_diagnostic_fee_mxn,
  st.hourly_or_project_range_mxn,
  st.response_time_label,
  st.emergency_247,
  st.secondary_specialties,
  st.certifications,
  st.tools_and_warranty
FROM public.users_profiles up
JOIN public.specialist_trades st
  ON st.specialist_id = up.id AND st.is_primary = TRUE
JOIN public.trade_categories tc
  ON tc.id = st.trade_category_id
WHERE up.role = 'specialist';
