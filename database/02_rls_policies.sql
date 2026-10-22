-- =============================================================================
-- OFICIOLINK — 02_rls_policies.sql
-- Control #4: Activación de Row Level Security (RLS) en TODAS las tablas
-- Control #7: Políticas Anti-IDOR estrictas basadas en auth.uid()
-- Control #16: Políticas de Storage para Buckets Privado (identity-docs) y Público (portfolios)
-- =============================================================================

-- 1. ACTIVACIÓN ESTRICTA DE RLS EN LAS 8 TABLAS DEL ESQUEMA
ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_profiles FORCE ROW LEVEL SECURITY;

ALTER TABLE public.trade_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_categories FORCE ROW LEVEL SECURITY;

ALTER TABLE public.specialist_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialist_trades FORCE ROW LEVEL SECURITY;

ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_verifications FORCE ROW LEVEL SECURITY;

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects FORCE ROW LEVEL SECURITY;

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests FORCE ROW LEVEL SECURITY;

ALTER TABLE public.verified_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_reviews FORCE ROW LEVEL SECURITY;

ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs FORCE ROW LEVEL SECURITY;

-- =============================================================================
-- FUNCIÓN AUXILIAR: Verificar si el usuario autenticado es Administrador
-- =============================================================================
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- =============================================================================
-- POLÍTICAS TABLA 1: users_profiles (Anti-IDOR + Vista Pública Segura)
-- =============================================================================
-- SELECT: Perfiles públicos de especialistas verificados o el propio usuario autenticado
CREATE POLICY "users_profiles_select_public_or_own"
  ON public.users_profiles
  FOR SELECT
  USING (
    role = 'specialist'
    OR auth.uid() = id
    OR public.is_admin_user()
  );

-- INSERT: Un usuario solo puede insertar su propio perfil con su auth.uid()
CREATE POLICY "users_profiles_insert_own_anti_idor"
  ON public.users_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: Un usuario solo puede actualizar su propio registro (Campos sensibles protegidos en 03_security_triggers.sql)
CREATE POLICY "users_profiles_update_own_anti_idor"
  ON public.users_profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin_user())
  WITH CHECK (auth.uid() = id OR public.is_admin_user());

-- DELETE: Solo el titular o un administrador puede eliminar su perfil
CREATE POLICY "users_profiles_delete_own_or_admin"
  ON public.users_profiles
  FOR DELETE
  USING (auth.uid() = id OR public.is_admin_user());

-- =============================================================================
-- POLÍTICAS TABLA 2: trade_categories (Lectura Pública, Escritura Admin)
-- =============================================================================
CREATE POLICY "trade_categories_select_all"
  ON public.trade_categories
  FOR SELECT
  USING (is_active = TRUE OR public.is_admin_user());

CREATE POLICY "trade_categories_admin_write"
  ON public.trade_categories
  FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- =============================================================================
-- POLÍTICAS TABLA 3: specialist_trades
-- =============================================================================
CREATE POLICY "specialist_trades_select_public"
  ON public.specialist_trades
  FOR SELECT
  USING (TRUE);

CREATE POLICY "specialist_trades_insert_own"
  ON public.specialist_trades
  FOR INSERT
  WITH CHECK (auth.uid() = specialist_id);

CREATE POLICY "specialist_trades_update_own"
  ON public.specialist_trades
  FOR UPDATE
  USING (auth.uid() = specialist_id)
  WITH CHECK (auth.uid() = specialist_id);

CREATE POLICY "specialist_trades_delete_own"
  ON public.specialist_trades
  FOR DELETE
  USING (auth.uid() = specialist_id OR public.is_admin_user());

-- =============================================================================
-- POLÍTICAS TABLA 4: identity_verifications (ESTRICTO ANTI-IDOR — PII Sensible)
-- =============================================================================
-- Jamás accesible al público: solo el propio especialista o un validador admin
CREATE POLICY "identity_verifications_select_owner_or_admin"
  ON public.identity_verifications
  FOR SELECT
  USING (auth.uid() = specialist_id OR public.is_admin_user());

CREATE POLICY "identity_verifications_insert_owner_only"
  ON public.identity_verifications
  FOR INSERT
  WITH CHECK (auth.uid() = specialist_id AND status = 'pending');

CREATE POLICY "identity_verifications_update_admin_only"
  ON public.identity_verifications
  FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- =============================================================================
-- POLÍTICAS TABLA 5: portfolio_projects
-- =============================================================================
CREATE POLICY "portfolio_projects_select_public"
  ON public.portfolio_projects
  FOR SELECT
  USING (TRUE);

CREATE POLICY "portfolio_projects_insert_owner_only"
  ON public.portfolio_projects
  FOR INSERT
  WITH CHECK (auth.uid() = specialist_id);

CREATE POLICY "portfolio_projects_update_owner_only"
  ON public.portfolio_projects
  FOR UPDATE
  USING (auth.uid() = specialist_id)
  WITH CHECK (auth.uid() = specialist_id);

CREATE POLICY "portfolio_projects_delete_owner_only"
  ON public.portfolio_projects
  FOR DELETE
  USING (auth.uid() = specialist_id OR public.is_admin_user());

-- =============================================================================
-- POLÍTICAS TABLA 6: service_requests (ANTI-IDOR: Solo Cliente o Especialista involucrado)
-- =============================================================================
CREATE POLICY "service_requests_select_participants_only"
  ON public.service_requests
  FOR SELECT
  USING (
    auth.uid() = client_id
    OR auth.uid() = specialist_id
    OR public.is_admin_user()
  );

CREATE POLICY "service_requests_insert_authenticated_client"
  ON public.service_requests
  FOR INSERT
  WITH CHECK (auth.uid() = client_id AND client_id <> specialist_id);

CREATE POLICY "service_requests_update_participants_only"
  ON public.service_requests
  FOR UPDATE
  USING (
    auth.uid() = client_id
    OR auth.uid() = specialist_id
    OR public.is_admin_user()
  )
  WITH CHECK (
    auth.uid() = client_id
    OR auth.uid() = specialist_id
    OR public.is_admin_user()
  );

-- =============================================================================
-- POLÍTICAS TABLA 7: verified_reviews (Solo clientes con servicio 'completed')
-- =============================================================================
CREATE POLICY "verified_reviews_select_public"
  ON public.verified_reviews
  FOR SELECT
  USING (TRUE);

CREATE POLICY "verified_reviews_insert_completed_service_owner"
  ON public.verified_reviews
  FOR INSERT
  WITH CHECK (
    auth.uid() = client_id
    AND EXISTS (
      SELECT 1
      FROM public.service_requests sr
      WHERE sr.id = service_request_id
        AND sr.client_id = auth.uid()
        AND sr.specialist_id = verified_reviews.specialist_id
        AND sr.status = 'completed'
    )
  );

-- Prohibido editar o borrar reseñas verificadas salvo por auditoría administrativa
CREATE POLICY "verified_reviews_delete_admin_only"
  ON public.verified_reviews
  FOR DELETE
  USING (public.is_admin_user());

-- =============================================================================
-- POLÍTICAS TABLA 8: security_audit_logs (Inmutable: Solo Inserción / Lectura Admin)
-- =============================================================================
CREATE POLICY "security_audit_logs_insert_authenticated"
  ON public.security_audit_logs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "security_audit_logs_select_admin_only"
  ON public.security_audit_logs
  FOR SELECT
  USING (public.is_admin_user());

-- =============================================================================
-- POLÍTICAS DE STORAGE BUCKETS (Control #16: Restricción de Subida de Archivos)
-- =============================================================================
-- Bucket privado `identity-docs`: el especialista solo puede subir y leer en su propia carpeta `<auth.uid()>/<uuid>.jpg`
CREATE POLICY "storage_identity_docs_owner_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'identity-docs'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "storage_identity_docs_owner_or_admin_select"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'identity-docs'
    AND (
      (storage.foldername(name))[1] = auth.uid()::TEXT
      OR public.is_admin_user()
    )
  );

-- Bucket público `portfolios`: lectura pública, escritura restringida a la carpeta del especialista autenticado
CREATE POLICY "storage_portfolios_public_select"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'portfolios');

CREATE POLICY "storage_portfolios_specialist_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolios'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );
