import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * CONTROLES #18 y #19: Cabeceras HTTP de Seguridad Estrictas + Fuerza HTTPS (HSTS Preload)
 */
const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' https://images.unsplash.com data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'; object-src 'none'; base-uri 'self';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(self), geolocation=(), microphone=(), payment=()',
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'oficiolink-security-headers-middleware',
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
            res.setHeader(header, value);
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((_req, res, next) => {
          for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
            res.setHeader(header, value);
          }
          next();
        });
      },
    },
  ],
});
