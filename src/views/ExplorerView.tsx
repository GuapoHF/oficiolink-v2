import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  SlidersHorizontal,
  Clock,
  CheckCircle2,
  Eye,
  RotateCcw,
  Zap,
  Award,
  Camera,
} from 'lucide-react';
import {
  Specialist,
  TradeCategory,
  TradeCategoryId,
} from '../types/oficiolink';
import { TradeIcon } from '../components/TradeIcon';

interface ExplorerViewProps {
  categories: TradeCategory[];
  specialists: Specialist[];
  initialTrade: TradeCategoryId;
  initialCity: string;
  initialQuery: string;
  onSelectSpecialist: (specialist: Specialist) => void;
  onRequestService: (specialist: Specialist) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  categories,
  specialists,
  initialTrade,
  initialCity,
  initialQuery,
  onSelectSpecialist,
  onRequestService,
}) => {
  const [selectedTrade, setSelectedTrade] = useState<TradeCategoryId>(initialTrade);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDiagnosticFee, setMaxDiagnosticFee] = useState<number>(800);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(true);
  const [onlyEmergency247, setOnlyEmergency247] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'jobs' | 'price'>('rating');
  const [previewBeforeMap, setPreviewBeforeMap] = useState<Record<string, boolean>>({});

  const toggleBeforeAfter = (id: string) => {
    setPreviewBeforeMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetFilters = () => {
    setSelectedTrade('todos');
    setSelectedCity('Todas');
    setSearchQuery('');
    setMinRating(0);
    setMaxDiagnosticFee(800);
    setOnlyVerified(true);
    setOnlyEmergency247(false);
    setSortBy('rating');
  };

  const filteredSpecialists = useMemo(() => {
    return specialists
      .filter((sp) => {
        if (selectedTrade !== 'todos' && sp.primaryTrade !== selectedTrade) {
          return false;
        }
        if (selectedCity !== 'Todas' && sp.city !== selectedCity) {
          return false;
        }
        if (onlyVerified && !sp.verified) {
          return false;
        }
        if (onlyEmergency247 && !sp.emergency247) {
          return false;
        }
        if (sp.rating < minRating) {
          return false;
        }
        if (sp.baseDiagnosticFeeMXN > maxDiagnosticFee) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const inName = sp.name.toLowerCase().includes(q);
          const inHeadline = sp.headline.toLowerCase().includes(q);
          const inTrades = sp.secondaryTrades.some((t) => t.toLowerCase().includes(q));
          const inZones = sp.coverageZones.some((z) => z.toLowerCase().includes(q));
          const inPortfolio = sp.portfolio.some((p) => p.title.toLowerCase().includes(q));
          if (!inName && !inHeadline && !inTrades && !inZones && !inPortfolio) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'jobs') return b.completedJobs - a.completedJobs;
        return a.baseDiagnosticFeeMXN - b.baseDiagnosticFeeMXN;
      });
  }, [
    specialists,
    selectedTrade,
    selectedCity,
    onlyVerified,
    onlyEmergency247,
    minRating,
    maxDiagnosticFee,
    searchQuery,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      {/* Top Banner in Glacier Blue (#DBF6FF) */}
      <div className="rounded-3xl bg-[#DBF6FF] p-6 sm:p-8 border border-[#0F172A]/10 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Directorio Auditado OficioLink
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0F172A] mt-2">
              Buscador Avanzado de Especialistas Técnicos
            </h1>
            <p className="text-sm text-[#475569] mt-1 font-medium">
              Compara portafolios reales Antes/Después, certificaciones y reseñas verificadas en tu zona.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="w-full lg:w-96 bg-[#FFFFFF] p-2 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-2">
            <Search className="w-5 h-5 text-[#FF2E3A] ml-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por falla, oficio, colonia o nombre..."
              className="w-full text-sm text-[#0F172A] placeholder-[#475569] focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-[#475569] hover:text-[#FF2E3A] px-2 cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Trade Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedTrade('todos')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedTrade === 'todos'
                ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-md shadow-[#FF2E3A]/20'
                : 'bg-[#FFFFFF] text-[#0F172A] hover:bg-[#0F172A] hover:text-white'
            }`}
          >
            Todos los Oficios ({specialists.length})
          </button>
          {categories.map((cat) => {
            const active = selectedTrade === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedTrade(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-md shadow-[#FF2E3A]/20'
                    : 'bg-[#FFFFFF] text-[#0F172A] hover:bg-[#0F172A] hover:text-white'
                }`}
              >
                <TradeIcon name={cat.iconName} className="w-3.5 h-3.5" />
                <span>{cat.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR: DYNAMIC FILTERS */}
        <aside className="lg:col-span-3 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] p-6 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#FF2E3A]" />
              <h2 className="font-display font-extrabold text-base text-[#0F172A]">
                Filtros de Confianza
              </h2>
            </div>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#FF2E3A] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer
            </button>
          </div>

          {/* Switch 1: Solo Identidad Verificada */}
          <div className="p-4 rounded-2xl bg-[#DBF6FF] border border-[#FF2E3A]/20">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FF2E3A] shrink-0" />
                <span className="text-xs font-extrabold text-[#0F172A]">
                  Solo Identidad Verificada
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={onlyVerified}
                onClick={() => setOnlyVerified(!onlyVerified)}
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  onlyVerified ? 'bg-[#FF2E3A]' : 'bg-[#CBD5E1]'
                }`}
              >
                <span
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    onlyVerified ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-[#475569] mt-1.5 font-medium">
              Exige INE vigente, validación biométrica facial y domicilio comprobado.
            </p>
          </div>

          {/* Switch 2: Emergencias 24/7 */}
          <div className="p-3.5 rounded-2xl bg-[#F7FCFF] border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF2E3A]" />
              <span className="text-xs font-bold text-[#0F172A]">Atención Urgencias 24/7</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={onlyEmergency247}
              onClick={() => setOnlyEmergency247(!onlyEmergency247)}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                onlyEmergency247 ? 'bg-[#FF2E3A]' : 'bg-[#CBD5E1]'
              }`}
            >
              <span
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  onlyEmergency247 ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* City / Zone Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#475569]">
              Ciudad / Zona Metropolitana
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#FF2E3A]"
            >
              <option value="Todas">Todas las ciudades</option>
              <option value="CDMX">Ciudad de México (CDMX)</option>
              <option value="Monterrey">Monterrey, N.L.</option>
              <option value="Guadalajara">Guadalajara, Jal.</option>
              <option value="Querétaro">Querétaro, Qro.</option>
              <option value="Puebla">Puebla, Pue.</option>
            </select>
          </div>

          {/* Minimum Rating Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#475569]">
              Calificación Mínima
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Todas', val: 0 },
                { label: '4.8+ ★', val: 4.8 },
                { label: '4.9+ ★', val: 4.9 },
                { label: '4.95+ ★', val: 4.95 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setMinRating(opt.val)}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    minRating === opt.val
                      ? 'bg-[#FF2E3A] text-[#DBF6FF] border-[#FF2E3A]'
                      : 'bg-[#F7FCFF] text-[#0F172A] border-[#E2E8F0] hover:bg-[#DBF6FF]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostic Fee Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#475569]">
                Tarifa Visita / Diagnóstico
              </label>
              <span className="px-2 py-0.5 rounded-md bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold">
                Máx ${maxDiagnosticFee} MXN
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={800}
              step={50}
              value={maxDiagnosticFee}
              onChange={(e) => setMaxDiagnosticFee(Number(e.target.value))}
              className="w-full accent-[#FF2E3A] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#475569] font-medium">
              <span>$300 MXN</span>
              <span>$550 MXN</span>
              <span>$800 MXN</span>
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#475569]">
              Ordenar Resultados Por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'jobs' | 'price')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#0F172A] focus:outline-none"
            >
              <option value="rating">Mejor Calificación Verificada</option>
              <option value="jobs">Más Trabajos Concluidos en OL</option>
              <option value="price">Menor Costo de Diagnóstico</option>
            </select>
          </div>
        </aside>

        {/* RIGHT RESULTS LIST */}
        <div className="lg:col-span-9 space-y-5">
          {/* Results Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F7FCFF] px-5 py-3.5 rounded-2xl border border-[#E2E8F0]">
            <p className="text-sm font-bold text-[#0F172A]">
              Mostrando <span className="text-[#FF2E3A]">{filteredSpecialists.length}</span> especialistas técnicos disponibles
            </p>
            <div className="flex items-center gap-2 text-xs text-[#475569] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#FF2E3A]" />
              <span>Garantía de satisfacción y portafolio verificado</span>
            </div>
          </div>

          {filteredSpecialists.length === 0 ? (
            <div className="rounded-3xl bg-[#DBF6FF]/50 border-2 border-dashed border-[#FF2E3A]/40 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FF2E3A] text-[#DBF6FF] flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#0F172A]">
                No encontramos especialistas con esos filtros exactos
              </h3>
              <p className="text-sm text-[#475569] max-w-md mx-auto">
                Intenta ampliar el rango de tarifa de diagnóstico o seleccionar &ldquo;Todas las ciudades&rdquo; para ver más perfiles verificados.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] transition-colors cursor-pointer"
              >
                Restablecer Todos los Filtros
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSpecialists.map((sp) => {
                const featuredProj = sp.portfolio[0];
                const showBefore = !!previewBeforeMap[sp.id];

                return (
                  <div
                    key={sp.id}
                    className="rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] hover:border-[#FF2E3A] transition-all p-5 sm:p-6 shadow-sm hover:shadow-xl"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Left & Center Info (7 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={sp.avatar}
                            alt={sp.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#FF2E3A] shrink-0"
                          />
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-3 py-0.5 rounded-full bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold">
                                {sp.primaryTradeLabel}
                              </span>
                              {sp.verified && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-[11px] font-extrabold">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Identidad Verificada ({sp.verificationDetails.badgeCode})
                                </span>
                              )}
                              {sp.emergency247 && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#0F172A] text-[#DBF6FF] text-[10px] font-extrabold">
                                  Urgencias 24/7
                                </span>
                              )}
                            </div>

                            <h3
                              onClick={() => onSelectSpecialist(sp)}
                              className="font-display font-extrabold text-lg sm:text-xl text-[#0F172A] hover:text-[#FF2E3A] transition-colors cursor-pointer"
                            >
                              {sp.name}
                            </h3>

                            <p className="text-xs text-[#475569] font-medium leading-relaxed">
                              {sp.headline}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-[#475569] pt-1">
                              <span className="inline-flex items-center gap-1 font-bold text-[#0F172A]">
                                <MapPin className="w-3.5 h-3.5 text-[#FF2E3A]" />
                                {sp.city} ({sp.coverageZones.slice(0, 2).join(', ')})
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-[#FF2E3A]" />
                                Respuesta: <strong className="text-[#0F172A]">{sp.responseTime}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Glacier Blue Specialty Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {sp.secondaryTrades.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-lg bg-[#DBF6FF] text-[#0F172A] text-xs font-bold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Trust & Reputation Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                          <div className="p-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0]">
                            <div className="flex items-center gap-1 text-sm font-extrabold text-[#0F172A]">
                              <Star className="w-4 h-4 fill-[#FF2E3A] text-[#FF2E3A]" />
                              <span>{sp.rating}</span>
                              <span className="text-xs text-[#475569] font-normal">
                                ({sp.reviewsCount})
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-[#475569] uppercase">
                              Reputación Real
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0]">
                            <p className="text-sm font-extrabold text-[#0F172A]">
                              {sp.completedJobs} trabajos
                            </p>
                            <p className="text-[10px] font-bold text-[#475569] uppercase">
                              Concluidos en OL
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0]">
                            <p className="text-sm font-extrabold text-[#0F172A]">
                              {sp.yearsExperience} años
                            </p>
                            <p className="text-[10px] font-bold text-[#475569] uppercase">
                              Trayectoria
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#DBF6FF] border border-[#FF2E3A]/20">
                            <p className="text-sm font-extrabold text-[#FF2E3A]">
                              ${sp.baseDiagnosticFeeMXN} MXN
                            </p>
                            <p className="text-[10px] font-bold text-[#0F172A] uppercase">
                              Visita y Diagnóstico
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Visual Portfolio Mini-Showcase & Actions (5 cols) */}
                      <div className="lg:col-span-5 flex flex-col justify-between bg-[#F7FCFF] p-4 rounded-2xl border border-[#E2E8F0]">
                        {featuredProj ? (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase text-[#FF2E3A]">
                                <Camera className="w-3.5 h-3.5" />
                                Portafolio: Antes vs Después
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleBeforeAfter(sp.id)}
                                className="px-2.5 py-0.5 rounded-md bg-[#DBF6FF] text-[#FF2E3A] text-[11px] font-extrabold hover:bg-[#FF2E3A] hover:text-[#DBF6FF] transition-colors cursor-pointer"
                              >
                                {showBefore ? 'Ver DESPUÉS →' : 'Ver ANTES ←'}
                              </button>
                            </div>
                            <div className="relative h-36 rounded-xl overflow-hidden border border-[#E2E8F0]">
                              <img
                                src={showBefore ? featuredProj.beforeImage : featuredProj.afterImage}
                                alt={featuredProj.title}
                                className="w-full h-full object-cover"
                              />
                              <span
                                className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                  showBefore
                                    ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                                    : 'bg-[#0F172A]/90 text-[#DBF6FF]'
                                }`}
                              >
                                {showBefore ? 'ANTES (Problema)' : 'DESPUÉS (Trabajo Terminado)'}
                              </span>
                              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#0F172A]/85 text-white text-[11px] font-bold">
                                Ref: ${featuredProj.approxCostMXN.toLocaleString('es-MX')} MXN
                              </span>
                            </div>
                            <p className="text-xs font-bold text-[#0F172A] mt-2 line-clamp-1">
                              {featuredProj.title}
                            </p>
                          </div>
                        ) : null}

                        <div className="grid grid-cols-2 gap-2.5 mt-4">
                          <button
                            onClick={() => onSelectSpecialist(sp)}
                            className="py-2.5 px-3 rounded-xl bg-[#DBF6FF] text-[#FF2E3A] hover:bg-[#0F172A] hover:text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Ver CV Visual</span>
                          </button>
                          <button
                            onClick={() => onRequestService(sp)}
                            className="py-2.5 px-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] hover:bg-[#E0212D] font-extrabold text-xs transition-colors shadow-sm shadow-[#FF2E3A]/20 cursor-pointer"
                          >
                            Solicitar Servicio
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
