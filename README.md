# 🛠️ OficioLink — El LinkedIn de los Especialistas Técnicos y de Oficios

[![CI Build & Typecheck](https://img.shields.io/badge/CI_Build-Passing-10B981?style=for-the-badge&logo=githubactions&logoColor=white)](./.github/workflows/ci.yml)
[![Version](https://img.shields.io/badge/Versi%C3%B3n-1.0.0-FF2E3A?style=for-the-badge)](./package.json)
[![React 19](https://img.shields.io/badge/React-19.0-DBF6FF?style=for-the-badge&logo=react&logoColor=0F172A)](https://react.dev/)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-0F172A?style=for-the-badge&logo=typescript&logoColor=DBF6FF)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite 6](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/Licencia-MIT-475569?style=for-the-badge)](./LICENSE)

> **OficioLink** es una plataforma digital diseñada para **dignificar y profesionalizar el sector técnico en México** (electricistas, plomeros, carpinteros, herreros, técnicos en climatización HVAC, pintores, albañiles y cerrajeros) mediante perfiles de alto impacto con portafolios visuales de trabajos reales (**"Antes y Después"**), validación de identidad (**INE + Biometría**) y un vínculo directo y seguro con clientes que necesitan contratar un servicio.

---

## 🎯 Propuesta de Valor y los 3 Pilares Funcionales

El mercado de servicios técnicos y oficios suele operar de forma fragmentada e informal. **OficioLink** digitaliza la confianza a través de dos ejes (**Oficio** + **Link**) y tres pilares tecnológicos:

1. 🛡️ **Confianza Digital (Verificación de Identidad):**
   Los especialistas pasan por un flujo de validación documental y biométrica (Identificación Oficial INE/IFE frente y vuelta + Selfie facial en vivo + Comprobante de domicilio) para obtener su insignia auditada de **"Especialista Verificado"** con folio único (`OL-MX-...`).
2. 📸 **Profesionalización (El "CV Visual" / Portafolio Antes y Después):**
   En lugar de un currículum de texto tradicional, el especialista demuestra su maestría mediante galerías fotográficas comparativas (**Antes vs. Después**), fichas técnicas del reto resuelto, materiales empleados, certificaciones (`CONOCER EC0118`, `NOM-001-SEDE`, etc.) y costos de referencia en MXN.
3. ⭐ **Reputación Real (Reseñas 100% Verificadas):**
   Sistema de evaluación auditado donde únicamente los clientes con una orden de servicio concluida en la plataforma pueden calificar al especialista en 4 métricas clave: **Puntualidad**, **Calidad Técnica**, **Limpieza y Orden** y **Precio Justo**.

---

## 🎨 Sistema de Diseño y Paleta de Colores Protagonista

La interfaz sigue una estética moderna estilo **Bento Grid**, bordes redondeados generosos, micro-interacciones fluidas y tipografía geométrica (**Plus Jakarta Sans** para encabezados e **Inter** para cuerpo y datos).

| Rol en el Sistema | Nombre del Color | Código HEX | Aplicación en la Interfaz |
| :--- | :--- | :---: | :--- |
| **Primario de Marca y Acción** | **Machine Red** | `#FF2E3A` | Botones principales (CTAs), insignias de verificación destacadas, estados activos de navegación, barras de progreso y bloques de alto impacto. |
| **Secundario de Superficie y Contraste** | **Glacier Blue** | `#DBF6FF` | Fondos de secciones Hero, tarjetas destacadas (*feature cards*), etiquetas (*pills/badges*) de categorías de oficios, fondos de iconos y texto sobre bloques `#FF2E3A`. |
| **Fondo Principal** | **Pure White** | `#FFFFFF` | Superficie base de la aplicación y tarjetas principales. |
| **Fondo Secundario Sutil** | **Ice White** | `#F7FCFF` | Fondos de secciones alternas, contenedores de filtros e inputs. |
| **Texto Principal y Titulares** | **Deep Charcoal** | `#0F172A` | Encabezados de alto contraste, nombres de especialistas y bloques oscuros. |
| **Texto Secundario y Bordes** | **Slate Gray** | `#475569` / `#E2E8F0` | Descripciones técnicas, metadatos y líneas divisorias sutiles. |

> **Regla de Oro Visual:** El diseño aprovecha el alto contraste entre bloques **Machine Red (`#FF2E3A`)** con tipografía/iconos en **Glacier Blue (`#DBF6FF`)**, y superficies en **Glacier Blue (`#DBF6FF`)** con acentos, insignias e iconos en **Machine Red (`#FF2E3A`)**.

---

## 🖥️ Módulos y Pantallas Implementadas

1. **Landing Page de Alto Impacto (`src/views/LandingView.tsx`):**
   * **Navbar Dinámico:** Navegación entre todos los módulos, indicador en vivo de solicitudes activas y CTAs rápidos.
   * **Hero Section en Bento Grid:** Buscador inteligente por falla/oficio y ciudad en México, métricas de confianza y vista previa interactiva del portafolio *Antes / Después*.
   * **Cuadrícula Interactiva de Categorías de Oficios:** 8 especialidades con tarifas de referencia en MXN y conteo de especialistas verificados.
   * **Showcase de Especialistas Mejor Valorados** y sección comparativa interactiva **¿Cómo funciona OficioLink?** (Modo Clientes vs. Modo Especialistas).
2. **Buscador y Explorador Avanzado (`src/views/ExplorerView.tsx`):**
   * Filtros dinámicos en tiempo real por categoría de oficio, ciudad (CDMX, Monterrey, Guadalajara, Querétaro, Puebla), calificación mínima (`4.8+`, `4.9+`, `4.95+`), tarifa máxima de visita/diagnóstico, switch **"Solo Identidad Verificada"** y switch **"Atención Urgencias 24/7"**.
3. **Perfil Profesional del Especialista — El "CV Visual" (`src/views/ProfileView.tsx`):**
   * Cabecera con insignia verificada, expediente de validación documental/biométrico, certificaciones oficiales y botón de solicitud de servicio.
   * Galería de Portafolio Visual con conmutador interactivo **Antes / Después** y **Modal de Ficha Técnica** (comparativa lado a lado, reto técnico, solución aplicada y materiales).
   * Desglose cuantitativo de reseñas verificadas en 4 barras de progreso.
4. **Onboarding y Verificación de Identidad (`src/views/OnboardingView.tsx`):**
   * Wizard interactivo de 4 pasos con barra de progreso en `#FF2E3A` y credencial en vivo: Selección de rol y datos básicos → Perfil técnico y cobertura → Carga de INE (frente/reverso) y simulador de escaneo biométrico facial → Carga del primer proyecto *Antes y Después* con publicación inmediata en el catálogo.
5. **Panel de Solicitudes y Dashboard Dual (`src/views/DashboardView.tsx` & `src/components/ServiceRequestModal.tsx`):**
   * Modal para enviar solicitudes de trabajo con nivel de urgencia, fecha sugerida, presupuesto estimado y evidencia fotográfica del desperfecto.
   * **Dashboard Modo Especialista:** Gestión del pipeline de solicitudes (*Nueva → Cotizada → En Progreso → Finalizada*), emisión de cotizaciones formales y carga rápida de nuevos proyectos al portafolio.
   * **Dashboard Modo Cliente:** Aprobación de presupuestos y emisión de **Reseñas Verificadas** al concluir un servicio.

---

## 📂 Arquitectura y Estructura del Proyecto

```text
OficioLink/
├── .github/
│   └── workflows/
│       └── ci.yml                  # Pipeline de Integración Continua (GitHub Actions)
├── src/
│   ├── components/
│   │   ├── Footer.tsx              # Pie de página con accesos rápidos e identidad visual
│   │   ├── Navbar.tsx              # Barra de navegación superior responsiva con badges
│   │   ├── ServiceRequestModal.tsx # Modal interactivo para solicitar servicio y cotizar
│   │   └── TradeIcon.tsx           # Renderizador dinámico de iconos por categoría de oficio
│   ├── data/
│   │   └── mockData.ts             # Catálogo realista de especialistas, proyectos y solicitudes (MX)
│   ├── types/
│   │   └── oficiolink.ts           # Definiciones e interfaces estrictas de TypeScript
│   ├── views/
│   │   ├── DashboardView.tsx       # Panel de control dual (Especialista y Cliente)
│   │   ├── ExplorerView.tsx        # Buscador avanzado con filtros dinámicos
│   │   ├── LandingView.tsx         # Página de inicio de alto impacto (Bento Grid)
│   │   ├── OnboardingView.tsx      # Wizard de 4 pasos de registro y verificación INE/Biométrico
│   │   └── ProfileView.tsx         # El "CV Visual" del especialista y modal de proyectos
│   ├── App.tsx                     # Orquestador de estado global, vistas y notificaciones
│   ├── index.css                   # Configuración de Tailwind CSS v4 y tokens de color
│   └── main.tsx                    # Punto de entrada de React 19
├── .env.example                    # Plantilla de variables de entorno
├── .gitignore                      # Archivos y directorios excluidos de Git
├── CONTRIBUTING.md                 # Guía de contribución, ramas y Conventional Commits
├── index.html                      # Documento raíz con tipografías Plus Jakarta Sans e Inter
├── LICENSE                         # Licencia MIT
├── package.json                    # Scripts y dependencias del proyecto
├── tsconfig.json                   # Configuración de TypeScript
└── vite.config.ts                  # Configuración de Vite + React + Tailwind CSS
```

---

## 🚀 Requisitos Previos e Instalación Paso a Paso

### Requisitos Previos
* **Node.js** `>= 20.0.0` (recomendado `v20 LTS` o `v24`)
* **npm** `>= 10.0.0`
* **Git** instalado en tu sistema

### 1. Clonar el repositorio
```bash
git clone https://github.com/GuapoHF/oficiolink-v2.git
cd oficiolink-v2
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Ejecutar el servidor de desarrollo
```bash
npm run dev
```
Abre tu navegador en **`http://localhost:5173/`** para interactuar con todas las pantallas en tiempo real.

### 5. Compilar y verificar para producción
```bash
npm run build
```
Los artefactos optimizados se generarán en la carpeta `dist/`. Puedes previsualizar el build de producción ejecutando:
```bash
npm run Preview
```

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT** (consulta el archivo [LICENSE](./LICENSE) para más detalles). Desarrollado con fines de innovación tecnológica y dignificación del sector de oficios técnicos.
