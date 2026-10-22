# 🛡️ Arquitectura de Ciberseguridad (AppSec & DB Hardening) — OficioLink

Este documento detalla la implementación técnica de los **20 Controles de Seguridad Obligatorios** en la arquitectura de **OficioLink**, abarcando el endurecimiento de la base de datos relacional (**PostgreSQL / Supabase**), la capa de servicios y validación del servidor, y las defensas en la interfaz de usuario.

---

## 📋 Matriz de los 20 Controles de Seguridad Implementados

| # | Control de Seguridad | Estado | Archivo(s) / Script(s) de Implementación | Descripción Técnica de la Implementación |
| :-: | :--- | :---: | :--- | :--- |
| **01** | **Oculta las claves API** | ✅ Activo | `.env.example`<br>`src/services/databaseService.ts` | Separación estricta entre variables públicas (`VITE_SUPABASE_ANON_PUBLIC_KEY`) y secretos exclusivos de servidor (`SUPABASE_SERVICE_ROLE_KEY`, `PII_AES256_MASTER_KEY`, `JWT_SIGNING_SECRET`) sin prefijo `VITE_` para que jamás se incluyan en el bundle cliente. |
| **02** | **Elimina secretos de Git** | ✅ Activo | `.gitignore`<br>`scripts/check-secrets.mjs` | `.gitignore` bloquea `.env*`, `*.pem`, `*.key`, `*.p12`, `*.pfx` y carpetas `secrets/`. Además, el script `scripts/check-secrets.mjs` escanea el árbol de código antes de cada build/commit para impedir fugas de tokens o llaves privadas. |
| **03** | **Usa una clave pública de DB** | ✅ Activo | `src/services/databaseService.ts`<br>`src/security/securityEngine.ts` | El cliente de base de datos se inicializa exclusivamente con `ANON_PUBLIC_KEY`. La función `verifySafeDatabaseClientConfig()` lanza una excepción inmediata si detecta una `service_role` o cadena `postgres://` en el cliente. |
| **04** | **Activa RLS (Row Level Security)** | ✅ Activo | `database/02_rls_policies.sql` | Se ejecuta `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` y `FORCE ROW LEVEL SECURITY;` en las **8 tablas** del esquema (`users_profiles`, `trade_categories`, `specialist_trades`, `identity_verifications`, `portfolio_projects`, `service_requests`, `verified_reviews`, `security_audit_logs`) con políticas granulares `SELECT`, `INSERT`, `UPDATE` y `DELETE`. |
| **05** | **Cifra datos sensibles (AES-256)** | ✅ Activo | `database/01_schema.sql`<br>`database/03_security_triggers.sql`<br>`src/security/cryptoVault.ts` | En PostgreSQL se habilita `pgcrypto` con las funciones `encrypt_pii_aes256()` y `decrypt_pii_aes256()` (`cipher-algo=aes256`). En la capa de aplicación (`cryptoVault.ts`), se cifra con **AES-256-GCM** (Web Crypto API) el teléfono directo, la dirección exacta del servicio y el hash `SHA-256` de documentos INE. |
| **06** | **Fuerza autenticación del servidor** | ✅ Activo | `src/security/securityEngine.ts`<br>`src/App.tsx` | El guard `assertServerAuthenticated()` verifica criptográficamente el estado de la sesión y la fecha de expiración del JWT antes de autorizar cualquier creación de solicitud, cambio de estado, subida de portafolio o emisión de reseña. |
| **07** | **Restringe acceso a registros (Anti-IDOR)** | ✅ Activo | `database/02_rls_policies.sql`<br>`src/security/securityEngine.ts` | Las políticas RLS fuerzan `auth.uid() = id` y `auth.uid() = client_id OR auth.uid() = specialist_id`. Adicionalmente, el guard `assertAntiIdorOwnership()` bloquea accesos horizontales no autorizados. |
| **08** | **Bloquea manipulación de campos (Anti-Mass Assignment)** | ✅ Activo | `database/03_security_triggers.sql`<br>`src/security/validationSchemas.ts` | El trigger SQL `trg_prevent_profile_privilege_escalation` impide que un usuario altere `role`, `is_identity_verified`, `rating_avg`, `total_reviews` o `completed_jobs`. En la app, `sanitizeMassAssignmentDTO()` y los esquemas `.strict()` de Zod descartan cualquier campo privilegiado inyectado. |
| **09** | **Protege cookies de sesión** | ✅ Activo | `src/security/securityEngine.ts`<br>`src/views/SecurityView.tsx` | Configuración de sesión bajo el prefijo `__Host-oficiolink_session` con los flags `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900` (15 minutos) y soporte de **Rotación de Refresh Tokens** con contador generacional. |
| **10** | **Hashea contraseñas** | ✅ Activo | `database/03_security_triggers.sql`<br>`src/security/cryptoVault.ts` | En SQL, `hash_password_bcrypt_12()` aplica `crypt(password, gen_salt('bf', 12))`. En la capa de seguridad (`hashPasswordSecure()`), se deriva con factor de costo mínimo de **12 rondas** en formato `$argon2id$v=19$m=65536,t=12,p=4$...` (jamás texto plano). |
| **11** | **Limita intentos de inicio (Brute-Force Protection)** | ✅ Activo | `database/03_security_triggers.sql`<br>`src/security/securityEngine.ts` | Tanto la función SQL `record_login_attempt()` como `evaluateLoginBruteForce()` permiten un máximo de **5 intentos fallidos cada 15 minutos**, bloqueando temporalmente la cuenta y registrando una alerta `CRITICAL` en `security_audit_logs`. |
| **12** | **Añade protección contra bots** | ✅ Activo | `src/components/BotProtectionWidget.tsx`<br>`src/security/securityEngine.ts` | Se integra el componente `BotProtectionWidget` (desafío humano tipo Cloudflare Turnstile + campo *Honeypot* invisible `website_url_honeypot`) en los flujos de Login, Registro/Verificación de Identidad y Solicitud de Servicio. |
| **13** | **Monitoriza consultas de DB** | ✅ Activo | `database/01_schema.sql`<br>`database/03_security_triggers.sql`<br>`src/services/databaseService.ts` | Se habilita la extensión `pg_stat_statements`, los triggers automáticos `trg_audit_identity_verifications` y `trg_audit_service_requests` hacia la tabla `security_audit_logs`, y la medición de latencia en milisegundos (`performance.now()`) en cada consulta. |
| **14** | **Valida todas las entradas (Zod)** | ✅ Activo | `src/security/validationSchemas.ts`<br>`src/components/ServiceRequestModal.tsx`<br>`src/views/OnboardingView.tsx` | Esquemas estrictos con **Zod** (`ServiceRequestInputSchema`, `OnboardingProfileInputSchema`, `VerifiedReviewInputSchema`, `LoginCredentialsSchema`) que validan tipos, longitudes, precios en MXN, teléfonos y URLs antes de procesar datos. |
| **15** | **Escapa contenido del usuario (Anti-XSS)** | ✅ Activo | `src/security/xssSanitizer.ts` | La función `sanitizeUserText()` utiliza **DOMPurify** (`ALLOWED_TAGS: [], ALLOWED_ATTR: []`) para neutralizar cualquier etiqueta `<script>`, evento inline (`onerror=`) o URI `javascript:` en biografías, descripciones de fallas, cotizaciones y reseñas. |
| **16** | **Restringe subida de archivos** | ✅ Activo | `src/security/fileUploadValidator.ts`<br>`database/01_schema.sql`<br>`database/02_rls_policies.sql` | `validateAndPrepareSecureUpload()` inspecciona los primeros 12 **Magic Bytes** reales del archivo (`FF D8 FF` JPEG, `89 50 4E 47` PNG, `52 49 46 46` WebP), impone el límite de **5 MB**, renombra con `crypto.randomUUID()` para prevenir *Path Traversal* y separa el almacenamiento entre el bucket privado `identity-docs` y el público `portfolios`. |
| **17** | **Limita respuestas de API** | ✅ Activo | `database/03_security_triggers.sql`<br>`src/services/databaseService.ts`<br>`src/security/securityEngine.ts` | Implementa Rate Limiting global (`checkGlobalApiRateLimit()`), paginación forzada (`enforcePaginationBounds()`, máx. 20 registros) y proyección explícita (`PUBLIC_SPECIALIST_COLUMNS` y vista SQL `v_public_specialists_directory`), prohibiendo `SELECT *`. |
| **18** | **Añade cabeceras de seguridad** | ✅ Activo | `vite.config.ts`<br>`vercel.json` | Configura las cabeceras HTTP `Content-Security-Policy` (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` y `Permissions-Policy`. |
| **19** | **Fuerza HTTPS** | ✅ Activo | `vite.config.ts`<br>`vercel.json` | Incluye la cabecera `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HSTS de 2 años con preload) y redirección `301` automática de HTTP a HTTPS. |
| **20** | **Escanea dependencias** | ✅ Activo | `.github/dependabot.yml`<br>`.github/workflows/ci.yml`<br>`package.json` | Escaneo semanal automatizado con **Dependabot** para `npm` y `github-actions`, auditoría en CI con `npm audit --audit-level=high` y script local `npm run security:check`. |

---

## 🧪 Cómo Verificar y Auditar los Controles Localmente

1. **Ejecutar el escaneo de secretos y auditoría de dependencias (Controles #2 y #20):**
   ```bash
   npm run security:check
   ```
2. **Verificar compilación estricta de TypeScript y bundle de producción:**
   ```bash
   npm run build
   ```
3. **Inspeccionar el Laboratorio Interactivo de Seguridad en la Aplicación:**
   Inicia `npm run dev` y haz clic en la pestaña **"Seguridad & DB (20/20)"** en la barra de navegación superior para probar en vivo el cifrado AES-256, el bloqueo Brute-Force, el sanitizador Anti-XSS, el detector de Magic Bytes y la bitácora `security_audit_logs`.
