-- =============================================================================
-- OFICIOLINK — 01_schema.sql
-- Esquema Relacional Completo Normalizado (PostgreSQL 15+ / Supabase)
-- Incluye extensiones criptográficas (pgcrypto) y monitoreo (pg_stat_statements)
-- =============================================================================

-- 1. Extensiones Obligatorias (Controles #5 y #13)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- 2. Tipos Enumerados (Dominios Estrictos)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('client', 'specialist', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE service_request_status AS ENUM ('requested', 'quoted', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE urgency_level AS ENUM ('emergencia_hoy', 'proximos_dias', 'programado');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- TABLA 1: users_profiles (Perfiles vinculados a auth.users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.users_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(120) NOT NULL CHECK (char_length(trim(full_name)) >= 3),
  role user_role NOT NULL DEFAULT 'client',
  -- Control #5: Teléfono cifrado con AES-256 mediante pgcrypto (nunca en texto plano)
  phone_encrypted BYTEA,
  phone_masked VARCHAR(24),
  avatar_url TEXT,
  cover_url TEXT,
  headline VARCHAR(220),
  city VARCHAR(80) NOT NULL DEFAULT 'CDMX',
  coverage_zones TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  -- Control #8: Campos protegidos contra Mass Assignment (solo modificables por triggers/servidor)
  is_identity_verified BOOLEAN NOT NULL DEFAULT FALSE,
  rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating_avg >= 0.00 AND rating_avg <= 5.00),
  total_reviews INTEGER NOT NULL DEFAULT 0 CHECK (total_reviews >= 0),
  completed_jobs INTEGER NOT NULL DEFAULT 0 CHECK (completed_jobs >= 0),
  -- Control #10 y #11: Soporte de hash Argon2id/bcrypt y protección Brute-Force
  password_hash TEXT,
  failed_login_attempts SMALLINT NOT NULL DEFAULT 0 CHECK (failed_login_attempts >= 0),
  locked_until TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_profiles_role_city
  ON public.users_profiles (role, city, is_identity_verified, rating_avg DESC);

-- =============================================================================
-- TABLA 2: trade_categories (Catálogo Oficial de Oficios)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.trade_categories (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  short_name VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(40) NOT NULL DEFAULT 'Wrench',
  avg_rate_mxn VARCHAR(60) NOT NULL,
  popular_tags TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLA 3: specialist_trades (Relación Muchos a Muchos Especialista <-> Oficios)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.specialist_trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialist_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
  trade_category_id VARCHAR(40) NOT NULL REFERENCES public.trade_categories(id) ON DELETE RESTRICT,
  is_primary BOOLEAN NOT NULL DEFAULT TRUE,
  years_experience SMALLINT NOT NULL DEFAULT 1 CHECK (years_experience >= 0 AND years_experience <= 70),
  base_diagnostic_fee_mxn NUMERIC(10, 2) NOT NULL DEFAULT 400.00 CHECK (base_diagnostic_fee_mxn >= 100.00 AND base_diagnostic_fee_mxn <= 50000.00),
  hourly_or_project_range_mxn VARCHAR(80) NOT NULL DEFAULT '$400 - $3,500 MXN',
  response_time_label VARCHAR(40) NOT NULL DEFAULT '10 min promedio',
  emergency_247 BOOLEAN NOT NULL DEFAULT FALSE,
  secondary_specialties TEXT[] NOT NULL DEFAULT '{}',
  certifications TEXT[] NOT NULL DEFAULT '{}',
  tools_and_warranty TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (specialist_id, trade_category_id)
);

CREATE INDEX IF NOT EXISTS idx_specialist_trades_lookup
  ON public.specialist_trades (trade_category_id, base_diagnostic_fee_mxn, emergency_247);

-- =============================================================================
-- TABLA 4: identity_verifications (Pilar 1: Confianza Digital INE + Biométrico)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.identity_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialist_id UUID NOT NULL UNIQUE REFERENCES public.users_profiles(id) ON DELETE CASCADE,
  -- Control #16: Rutas con UUID aleatorio dentro del bucket privado `identity-docs`
  ine_front_private_path TEXT NOT NULL,
  ine_back_private_path TEXT NOT NULL,
  selfie_private_path TEXT NOT NULL,
  -- Control #5: Metadatos de INE/Pasaporte (CURP, clave elector, OCR) cifrados con AES-256
  document_metadata_encrypted BYTEA NOT NULL,
  validation_hash CHAR(64) NOT NULL,
  biometric_match_score NUMERIC(5, 2) NOT NULL DEFAULT 99.40 CHECK (biometric_match_score >= 0 AND biometric_match_score <= 100),
  badge_code VARCHAR(40) NOT NULL UNIQUE,
  status verification_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.users_profiles(id),
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLA 5: portfolio_projects (Pilar 2: Portafolio Visual "Antes y Después")
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialist_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
  trade_category_id VARCHAR(40) REFERENCES public.trade_categories(id),
  title VARCHAR(160) NOT NULL CHECK (char_length(trim(title)) >= 5),
  category_label VARCHAR(80) NOT NULL,
  location VARCHAR(120) NOT NULL,
  completed_date VARCHAR(50) NOT NULL,
  duration VARCHAR(60) NOT NULL,
  approx_cost_mxn NUMERIC(12, 2) NOT NULL CHECK (approx_cost_mxn >= 100.00 AND approx_cost_mxn <= 2000000.00),
  description TEXT NOT NULL,
  technical_challenge TEXT,
  solution_applied TEXT,
  materials_used TEXT[] NOT NULL DEFAULT '{}',
  -- Control #16: Imágenes validadas por Magic Bytes almacenadas en bucket público `portfolios`
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  gallery_images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_specialist
  ON public.portfolio_projects (specialist_id, created_at DESC);

-- =============================================================================
-- TABLA 6: service_requests (Solicitudes de Trabajo Cliente -> Especialista)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folio VARCHAR(32) NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE RESTRICT,
  specialist_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE RESTRICT,
  problem_title VARCHAR(160) NOT NULL CHECK (char_length(trim(problem_title)) >= 5),
  problem_description TEXT NOT NULL CHECK (char_length(trim(problem_description)) >= 10),
  urgency urgency_level NOT NULL DEFAULT 'proximos_dias',
  -- Control #5: Dirección exacta del domicilio y teléfono directo cifrados con AES-256
  address_encrypted BYTEA NOT NULL,
  client_zone_public VARCHAR(120) NOT NULL,
  client_phone_encrypted BYTEA,
  suggested_date VARCHAR(100) NOT NULL,
  estimated_budget_mxn NUMERIC(12, 2) NOT NULL CHECK (estimated_budget_mxn >= 100.00),
  quoted_amount_mxn NUMERIC(12, 2) CHECK (quoted_amount_mxn IS NULL OR quoted_amount_mxn >= 100.00),
  quote_notes TEXT,
  warranty_days SMALLINT DEFAULT 365 CHECK (warranty_days >= 0 AND warranty_days <= 3650),
  issue_photos TEXT[] NOT NULL DEFAULT '{}',
  status service_request_status NOT NULL DEFAULT 'requested',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_requests_client
  ON public.service_requests (client_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_requests_specialist
  ON public.service_requests (specialist_id, status, created_at DESC);

-- =============================================================================
-- TABLA 7: verified_reviews (Pilar 3: Reputación Real Vinculada a Servicio Completed)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.verified_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- UNIQUE garantiza máximo 1 reseña verificada por orden de trabajo concluida
  service_request_id UUID NOT NULL UNIQUE REFERENCES public.service_requests(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE RESTRICT,
  specialist_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
  punctuality_score SMALLINT NOT NULL CHECK (punctuality_score BETWEEN 1 AND 5),
  quality_score SMALLINT NOT NULL CHECK (quality_score BETWEEN 1 AND 5),
  cleanliness_score SMALLINT NOT NULL CHECK (cleanliness_score BETWEEN 1 AND 5),
  fair_price_score SMALLINT NOT NULL CHECK (fair_price_score BETWEEN 1 AND 5),
  overall_rating NUMERIC(3, 2) GENERATED ALWAYS AS (
    ROUND((punctuality_score + quality_score + cleanliness_score + fair_price_score)::NUMERIC / 4.0, 2)
  ) STORED,
  -- Control #15: Comentario previamente sanitizado contra XSS
  comment_sanitized TEXT NOT NULL CHECK (char_length(trim(comment_sanitized)) BETWEEN 10 AND 1500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verified_reviews_specialist
  ON public.verified_reviews (specialist_id, created_at DESC);

-- =============================================================================
-- TABLA 8: security_audit_logs (Controles #11 y #13: Monitoreo y Auditoría AppSec)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES public.users_profiles(id) ON DELETE SET NULL,
  event_type VARCHAR(80) NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARN', 'CRITICAL')),
  target_table VARCHAR(60),
  target_record_id TEXT,
  ip_hash VARCHAR(64),
  user_agent VARCHAR(255),
  query_duration_ms NUMERIC(10, 2),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_audit_logs_event_time
  ON public.security_audit_logs (event_type, severity, created_at DESC);

-- =============================================================================
-- CONFIGURACIÓN DE STORAGE BUCKETS (Control #16: Separación Público / Privado)
-- =============================================================================
-- En Supabase Storage:
-- 1) `identity-docs`: Bucket PRIVADO (INE frente/vuelta, selfie biométrica), límite 5 MB
-- 2) `portfolios`: Bucket PÚBLICO (fotos Antes y Después de proyectos), límite 5 MB
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'identity-docs',
    'identity-docs',
    FALSE,
    5242880, -- 5 MB exactos
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'portfolios',
    'portfolios',
    TRUE,
    5242880, -- 5 MB exactos
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
