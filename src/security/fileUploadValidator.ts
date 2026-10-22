/**
 * CONTROL #16: Restricción y validación profunda de subida de archivos
 * - Verifica firma binaria real (Magic Bytes) para JPEG, PNG y WebP
 * - Limita tamaño máximo a 5 MB (5,242,880 bytes)
 * - Renombra con UUID criptográfico aleatorio para prevenir Path Traversal
 * - Separa almacenamiento entre bucket privado (`identity-docs`) y público (`portfolios`)
 */

export type StorageTargetBucket = 'identity-docs' | 'portfolios';

export interface SecureFileValidationResult {
  valid: boolean;
  error?: string;
  detectedMimeType?: 'image/jpeg' | 'image/png' | 'image/webp';
  magicBytesHex?: string;
  sanitizedStoragePath?: string;
  bucket?: StorageTargetBucket;
  isPrivateBucket?: boolean;
  fileSizeBytes?: number;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Inspecciona los primeros 12 bytes del archivo (Magic Bytes) para confirmar tipo MIME real
 */
function detectMimeByMagicBytes(
  headerBytes: Uint8Array
): { mime: 'image/jpeg' | 'image/png' | 'image/webp' | null; hex: string } {
  const hex = Array.from(headerBytes.slice(0, 12))
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');

  // JPEG: FF D8 FF
  if (
    headerBytes.length >= 3 &&
    headerBytes[0] === 0xff &&
    headerBytes[1] === 0xd8 &&
    headerBytes[2] === 0xff
  ) {
    return { mime: 'image/jpeg', hex };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    headerBytes.length >= 8 &&
    headerBytes[0] === 0x89 &&
    headerBytes[1] === 0x50 &&
    headerBytes[2] === 0x4e &&
    headerBytes[3] === 0x47
  ) {
    return { mime: 'image/png', hex };
  }

  // WebP: RIFF (52 49 46 46) .... WEBP (57 45 42 50)
  if (
    headerBytes.length >= 12 &&
    headerBytes[0] === 0x52 &&
    headerBytes[1] === 0x49 &&
    headerBytes[2] === 0x46 &&
    headerBytes[3] === 0x46 &&
    headerBytes[8] === 0x57 &&
    headerBytes[9] === 0x45 &&
    headerBytes[10] === 0x42 &&
    headerBytes[11] === 0x50
  ) {
    return { mime: 'image/webp', hex };
  }

  return { mime: null, hex };
}

export async function validateAndPrepareSecureUpload(
  file: File,
  targetBucket: StorageTargetBucket,
  ownerUserId: string
): Promise<SecureFileValidationResult> {
  // 1. Validar tamaño máximo (5 MB)
  if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Archivo rechazado: el peso (${(file.size / (1024 * 1024)).toFixed(2)} MB) excede el límite de seguridad de 5.00 MB.`,
      fileSizeBytes: file.size,
    };
  }

  // 2. Leer los primeros 12 bytes reales para verificar Magic Bytes
  const slice = file.slice(0, 12);
  const arrayBuffer = await slice.arrayBuffer();
  const headerBytes = new Uint8Array(arrayBuffer);
  const { mime, hex } = detectMimeByMagicBytes(headerBytes);

  if (!mime) {
    return {
      valid: false,
      error: `Firma binaria (Magic Bytes: ${hex}) no autorizada. Solo se aceptan imágenes reales JPEG, PNG o WebP.`,
      magicBytesHex: hex,
    };
  }

  // 3. Generar nombre único con UUID criptográfico (previene Path Traversal `../` o colisiones)
  const extensionMap: Record<'image/jpeg' | 'image/png' | 'image/webp', string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };

  const safeOwnerId = ownerUserId.replace(/[^a-zA-Z0-9_-]/g, '');
  const randomUuid = crypto.randomUUID();
  const ext = extensionMap[mime];
  const sanitizedStoragePath = `${targetBucket}/${safeOwnerId}/${randomUuid}.${ext}`;

  return {
    valid: true,
    detectedMimeType: mime,
    magicBytesHex: hex,
    sanitizedStoragePath,
    bucket: targetBucket,
    isPrivateBucket: targetBucket === 'identity-docs',
    fileSizeBytes: file.size,
  };
}
