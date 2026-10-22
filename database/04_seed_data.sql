-- =============================================================================
-- OFICIOLINK — 04_seed_data.sql
-- Poblamiento inicial del catálogo oficial de oficios técnicos en México
-- =============================================================================

INSERT INTO public.trade_categories (id, name, short_name, description, icon_name, avg_rate_mxn, popular_tags)
VALUES
  (
    'electricidad',
    'Electricidad Residencial e Industrial',
    'Electricidad',
    'Centros de carga, balanceo de fases, tierras físicas, recableado y cortos circuitos.',
    'Zap',
    '$450 - $1,800 MXN',
    ARRAY['Centros de Carga QO', 'Corto Circuito 24/7', 'Acometidas CFE', 'Iluminación LED']
  ),
  (
    'plomeria',
    'Plomería e Hidrosanitarios',
    'Plomería',
    'Detección de fugas sin romper, presurizadores, boilers, termofusión PPR y cobre.',
    'Droplets',
    '$400 - $1,500 MXN',
    ARRAY['Termofusión Tuboplus', 'Bombas Presurizadoras', 'Fugas Ocultas', 'Boilers de Paso']
  ),
  (
    'carpinteria',
    'Carpintería y Ebanistería a Medida',
    'Carpintería',
    'Cocinas integrales, clósets vestidores, puertas de parota/encino y restauración.',
    'Hammer',
    '$800 - $4,500 MXN',
    ARRAY['Cocinas Integrales', 'Clósets a Medida', 'Madera de Parota', 'Puertas Principales']
  ),
  (
    'herreria',
    'Herrería, Soldadura y Estructuras',
    'Herrería',
    'Portones automatizados, pérgolas de acero, protecciones arquitectónicas y soldadura MIG/TIG.',
    'Flame',
    '$600 - $3,200 MXN',
    ARRAY['Portones Eléctricos', 'Pérgolas de Acero', 'Soldadura Microalambre', 'Barandales']
  ),
  (
    'climatizacion',
    'Climatización y Refrigeración (HVAC)',
    'Climatización',
    'Instalación de Minisplits Inverter, carga de gas R410A, mantenimiento preventivo y cámaras frías.',
    'Wind',
    '$550 - $2,200 MXN',
    ARRAY['Minisplit Inverter', 'Mantenimiento Químico', 'Carga Gas R410A', 'Ductería']
  ),
  (
    'pintura',
    'Pintura Arquitectónica e Impermeabilización',
    'Pintura e Imper.',
    'Impermeabilización fibratada y prefabricada, pasta texturizada, pintura Airless y fachadas.',
    'Paintbrush',
    '$350 - $1,600 MXN',
    ARRAY['Impermeabilizado Termofusionado', 'Resane de Humedad', 'Pintura Epóxica', 'Fachadas']
  ),
  (
    'albanileria',
    'Albañilería Fina y Remodelación',
    'Albañilería',
    'Colocación de porcelanato rectificado, remodelación de baños, muros de tablaroca y acabados.',
    'HardHat',
    '$500 - $2,500 MXN',
    ARRAY['Porcelanato Gran Formato', 'Baños Completos', 'Tablaroca / Durock', 'Aplanados']
  ),
  (
    'cerrajeria',
    'Cerrajería Digital y Seguridad',
    'Cerrajería',
    'Cerraduras inteligentes biométricas, chapas de alta seguridad, CCTV y controles de acceso.',
    'ShieldCheck',
    '$450 - $1,900 MXN',
    ARRAY['Cerraduras Smart Wi-Fi', 'Apertura Urgente', 'Videoporteros IP', 'Chapas Bancarias']
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  description = EXCLUDED.description,
  avg_rate_mxn = EXCLUDED.avg_rate_mxn,
  popular_tags = EXCLUDED.popular_tags;
