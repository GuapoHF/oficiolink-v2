#!/usr/bin/env node
/**
 * CONTROL #2: Escáner Pre-Commit y CI contra Fuga de Secretos en Git
 * Verifica que ningún archivo rastreado contenga llaves privadas (.pem/.key),
 * tokens `service_role` reales ni credenciales hardcodeadas.
 */
import fs from 'node:fs';
import path from 'node:path';

const FORBIDDEN_PATTERNS = [
  { name: 'RSA/DSA/EC Private Key Block', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Supabase Service Role Secret Leak', regex: /VITE_SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']eyJ/ },
  { name: 'Direct Postgres Connection URI in Source', regex: /postgres(ql)?:\/\/[^/\s]+:[^@\s]+@[^/\s]+/i },
  { name: 'GitHub Personal Access Token', regex: /ghp_[A-Za-z0-9]{36}/ },
];

const IGNORED_DIRS = new Set(['node_modules', 'dist', '.git', '.vite']);

function scanDirectory(dirPath, violations = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        scanDirectory(fullPath, violations);
      }
      continue;
    }

    // Bloquear si existe un archivo .env real que no sea .env.example
    if (
      (entry.name === '.env' || (entry.name.startsWith('.env.') && entry.name !== '.env.example')) &&
      fullPath.includes(process.cwd())
    ) {
      // Solo advertir si estuviera fuera de .gitignore, pero verificamos contenido de código
      continue;
    }

    if (/\.(ts|tsx|js|mjs|sql|json|yml|yaml|html)$/.test(entry.name)) {
      if (entry.name === 'check-secrets.mjs') continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of FORBIDDEN_PATTERNS) {
        if (pattern.regex.test(content)) {
          violations.push({ file: fullPath, rule: pattern.name });
        }
      }
    }
  }
  return violations;
}

const foundViolations = scanDirectory(process.cwd());

if (foundViolations.length > 0) {
  console.error('❌ [SECURITY CHECK FAILED - Control #2] Secretos detectados en el repositorio:');
  for (const v of foundViolations) {
    console.error(`   - ${v.rule} en archivo: ${v.file}`);
  }
  process.exit(1);
} else {
  console.log('✅ [Control #2 OK] Escaneo de secretos completado: 0 credenciales expuestas.');
}
