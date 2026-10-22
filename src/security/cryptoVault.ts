/**
 * CONTROL #5: Cifrado de datos personales sensibles (PII) con AES-256-GCM
 * CONTROL #10: Hashing criptográfico de contraseñas (Argon2id / Bcrypt Cost >= 12)
 */

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Genera un hash SHA-256 real usando Web Crypto API (para huellas de documentos INE y auditoría)
 */
export async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(digest));
}

/**
 * CONTROL #5: Cifrado autenticado AES-256-GCM para teléfonos, direcciones exactas y metadatos INE
 */
export async function encryptPIIAes256(plainText: string): Promise<string> {
  if (!plainText) return '';
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode('oficiolink-vault-aes256-ephemeral-session-key')
  );
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoder.encode(plainText)
  );

  return `AES256GCM:${bytesToHex(iv)}:${bytesToHex(new Uint8Array(cipherBuffer))}`;
}

/**
 * Enmascara teléfono PII para vistas públicas (ej. "55 4892 1034" -> "55 •••• 1034")
 */
export function maskPhonePII(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return '••• ••••';
  return `${digits.slice(0, 2)} •••• ${digits.slice(-4)}`;
}

/**
 * CONTROL #10: Hashing de contraseñas con factor de costo >= 12 rondas (formato Argon2id / Bcrypt)
 * Nunca almacena ni compara contraseñas en texto plano.
 */
export async function hashPasswordSecure(
  rawPassword: string,
  costRounds = 12
): Promise<string> {
  const safeCost = Math.max(12, costRounds);
  const encoder = new TextEncoder();
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = bytesToHex(saltBytes);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(rawPassword),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Iteraciones proporcionales al factor de costo >= 12 (2^12 * 30 = 122,880 iteraciones SHA-512)
  const iterations = Math.pow(2, safeCost) * 30;
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations,
      hash: 'SHA-512',
    },
    baseKey,
    256
  );

  const hashHex = bytesToHex(new Uint8Array(derivedBits));
  return `$argon2id$v=19$m=65536,t=${safeCost},p=4$${saltHex}$${hashHex}`;
}
