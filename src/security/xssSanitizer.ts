import DOMPurify from 'dompurify';

/**
 * CONTROL #15: Escapa y sanitiza todo el contenido ingresado por el usuario (Anti-XSS)
 * Elimina etiquetas HTML, scripts (<script>), atributos de eventos (onerror, onload)
 * y esquemas peligrosos (javascript:, data:) antes de almacenar o renderizar.
 */
export function sanitizeUserText(rawInput: string): string {
  if (!rawInput || typeof rawInput !== 'string') {
    return '';
  }

  // 1. Sanitización estricta con DOMPurify prohibiendo cualquier etiqueta o atributo HTML
  const purified = DOMPurify.sanitize(rawInput, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  // 2. Eliminación adicional de vectores de inyección comunes
  return purified
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Sanitiza recursivamente un arreglo de textos (ej. tags, materiales, zonas)
 */
export function sanitizeStringArray(items: string[]): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => sanitizeUserText(item))
    .filter((item) => item.length > 0)
    .slice(0, 20);
}
