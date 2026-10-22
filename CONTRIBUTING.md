# Guía de Contribución — OficioLink

¡Gracias por tu interés en contribuir a **OficioLink**, la plataforma que dignifica y profesionaliza a los trabajadores de oficios y especialistas técnicos en México!

Este documento establece los lineamientos técnicos, flujo de ramas (*Git Flow*), formato de commits y reglas del sistema de diseño que todo colaborador debe seguir.

---

## 1. Estrategia de Ramas (Branching Model)

Utilizamos una estructura de ramas limpia y predecible:

* **`main`**: Rama de producción estable. Todo el código en `main` debe compilar sin errores (`npm run build`) y haber pasado el flujo de GitHub Actions CI.
* **`develop`**: Rama de integración continua donde convergen las nuevas funcionalidades antes de un *release*.
* **`feature/<nombre-corto>`**: Ramas para nuevas características o pantallas (ej. `feature/portfolio-before-after`, `feature/ine-biometric-wizard`).
* **`fix/<nombre-corto>`**: Ramas para corrección de errores visuales o lógicos (ej. `fix/filter-price-slider`).
* **`docs/<nombre-corto>`**: Actualizaciones de documentación técnica o diseño (ej. `docs/update-readme-badges`).

---

## 2. Convención de Commits (*Conventional Commits*)

Seguimos el estándar de **Conventional Commits** para mantener un historial semántico y legible:

```text
<tipo>(<alcance opcional>): <descripción breve en imperativo>
```

### Tipos permitidos:
* `feat`: Nueva funcionalidad o pantalla (ej. `feat(profile): add interactive before/after portfolio modal`).
* `fix`: Corrección de un bug (ej. `fix(explorer): resolve city filter reset state`).
* `docs`: Cambios exclusivos en documentación (`README.md`, `CONTRIBUTING.md`).
* `style`: Ajustes de estilos UI/UX, Tailwind CSS o paleta de colores sin alterar lógica.
* `refactor`: Reestructuración de código o tipos TypeScript sin cambiar el comportamiento externo.
* `ci`: Configuración de pipelines de integración o despliegue (`.github/workflows/ci.yml`).
* `chore`: Actualización de dependencias o configuración de Vite/TypeScript.

---

## 3. Reglas del Sistema de Diseño Obligatorio

Cualquier componente o vista nueva debe respetar estrictamente la identidad visual de **OficioLink**:

1. **Machine Red (`#FF2E3A`)**: Uso exclusivo para CTAs principales, insignias de verificación, barras de progreso y acentos de alto impacto.
2. **Glacier Blue (`#DBF6FF`)**: Superficies de secciones Hero, tarjetas destacadas (*feature cards*), etiquetas (*badges/pills*) de categorías y color de texto de alto contraste sobre bloques `#FF2E3A`.
3. **Neutros de Soporte**: Fondos en `#FFFFFF` y `#F7FCFF`; tipografía principal en `#0F172A` y secundaria en `#475569` con bordes `#E2E8F0`.

---

## 4. Proceso de Pull Request (PR)

1. Crea tu rama desde `develop` (o `main`):
   ```bash
   git checkout -b feature/mi-mejora
   ```
2. Verifica que el proyecto compile sin errores de TypeScript ni Vite:
   ```bash
   npm run build
   ```
3. Realiza tus commits siguiendo *Conventional Commits*.
4. Abre un **Pull Request** describiendo los cambios realizados y adjuntando capturas de pantalla si modificaste la interfaz.
