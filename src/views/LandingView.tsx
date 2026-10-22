import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle2,
  Camera,
  Award,
  Clock,
  Sparkles,
  FileCheck2,
  Eye,
  Wrench,
  Users,
  TrendingUp,
} from 'lucide-react';
import {
  Specialist,
  TradeCategory,
  TradeCategoryId,
  AppView,
} from '../types/oficiolink';
import { TradeIcon } from '../components/TradeIcon';

interface LandingViewProps {
  categories: TradeCategory[];
  specialists: Specialist[];
  onExploreWithFilters: (trade: TradeCategoryId, city: string, query: string) => void;
  onSelectSpecialist: (specialist: Specialist) => void;
  onRequestService: (specialist: Specialist) => void;
  onNavigate: (view: AppView) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  categories,
  specialists,
  onExploreWithFilters,
  onSelectSpecialist,
  onRequestService,
  onNavigate,
}) => {
  const [selectedTrade, setSelectedTrade] = useState<TradeCategoryId>('todos');
  const [selectedCity, setSelectedCity] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [heroShowAfter, setHeroShowAfter] = useState<boolean>(true);
  const [howItWorksTab, setHowItWorksTab] = useState<'clientes' | 'especialistas'>('clientes');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExploreWithFilters(selectedTrade, selectedCity, searchQuery);
  };

  const featuredSpecialist = specialists[0];

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION - BENTO GRID WITH GLACIER BLUE (#DBF6FF) & MACHINE RED (#FF2E3A) */}
      <section className="pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Main Hero Block in Glacier Blue (#DBF6FF) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#DBF6FF] p-6 sm:p-10 lg:p-12 border border-[#0F172A]/10 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              {/* Top Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold tracking-wide uppercase shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>El LinkedIn de los Oficios y Especialistas Técnicos</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[52px] text-[#0F172A] leading-[1.08] tracking-tight">
                Dignificamos el{' '}
                <span className="text-[#FF2E3A] underline decoration-[#FF2E3A]/30 decoration-4 underline-offset-4">
                  oficio técnico
                </span>{' '}
                con confianza digital verificada.
              </h1>

              <p className="text-[#475569] text-base sm:text-lg max-w-2xl leading-relaxed font-medium">
                Olvídate de recomendaciones a ciegas. Explora portafolios visuales de proyectos reales{' '}
                <strong className="text-[#0F172A]">(&ldquo;Antes y Después&rdquo;)</strong>, valida su insignia de{' '}
                <strong className="text-[#0F172A]">Identidad Verificada (INE + Biométrico)</strong> y contrata especialistas calificados por clientes reales.
              </p>

              {/* Smart Integrated Search Box */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-[#FFFFFF] p-3 rounded-2xl shadow-xl shadow-[#0F172A]/5 border border-[#E2E8F0] space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  {/* Search Query */}
                  <div className="sm:col-span-5 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] focus-within:border-[#FF2E3A]">
                    <Search className="w-4 h-4 text-[#FF2E3A] shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ej. Centro de carga, fuga, cocina..."
                      className="w-full bg-transparent text-sm text-[#0F172A] placeholder-[#475569] focus:outline-none font-medium"
                    />
                  </div>

                  {/* Trade Selector */}
                  <div className="sm:col-span-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0]">
                    <Wrench className="w-4 h-4 text-[#FF2E3A] shrink-0" />
                    <select
                      value={selectedTrade}
                      onChange={(e) => setSelectedTrade(e.target.value as TradeCategoryId)}
                      className="w-full bg-transparent text-sm text-[#0F172A] font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="todos">Todos los oficios</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.shortName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Selector */}
                  <div className="sm:col-span-3 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0]">
                    <MapPin className="w-4 h-4 text-[#FF2E3A] shrink-0" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#0F172A] font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Todas">Todo México</option>
                      <option value="CDMX">CDMX</option>
                      <option value="Monterrey">Monterrey</option>
                      <option value="Guadalajara">Guadalajara</option>
                      <option value="Querétaro">Querétaro</option>
                      <option value="Puebla">Puebla</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-bold text-[#475569]">Búsquedas frecuentes:</span>
                    {[
                      { label: 'Corto circuito 24/7', trade: 'electricidad' as TradeCategoryId },
                      { label: 'Presurizador', trade: 'plomeria' as TradeCategoryId },
                      { label: 'Cocina Integral', trade: 'carpinteria' as TradeCategoryId },
                      { label: 'Minisplit Inverter', trade: 'climatizacion' as TradeCategoryId },
                    ].map((tag) => (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => onExploreWithFilters(tag.trade, 'Todas', tag.label.split(' ')[0])}
                        className="px-2.5 py-1 rounded-lg bg-[#DBF6FF] text-[#FF2E3A] font-bold hover:bg-[#FF2E3A] hover:text-[#DBF6FF] transition-colors cursor-pointer"
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-sm hover:bg-[#E0212D] transition-all shadow-md shadow-[#FF2E3A]/25 shrink-0 cursor-pointer"
                  >
                    <span>Buscar Especialistas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Quick Metrics inside Hero */}
            <div className="grid grid-cols-3 gap-3 pt-8 mt-8 border-t border-[#0F172A]/10">
              <div className="bg-[#FFFFFF]/80 backdrop-blur-sm p-3.5 rounded-2xl border border-[#FFFFFF]">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-[#FF2E3A]">
                  +4,850
                </p>
                <p className="text-xs font-semibold text-[#0F172A]">
                  Especialistas con INE y Biométrico
                </p>
              </div>
              <div className="bg-[#FFFFFF]/80 backdrop-blur-sm p-3.5 rounded-2xl border border-[#FFFFFF]">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A]">
                  +18,400
                </p>
                <p className="text-xs font-semibold text-[#475569]">
                  Proyectos Antes/Después documentados
                </p>
              </div>
              <div className="bg-[#FF2E3A] p-3.5 rounded-2xl text-[#DBF6FF]">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-[#DBF6FF]">
                  4.96 ★
                </p>
                <p className="text-xs font-semibold text-[#DBF6FF]/90">
                  Calificación real verificada
                </p>
              </div>
            </div>
          </div>

          {/* Right Bento Column: Interactive "CV Visual" Preview & High-Contrast Machine Red Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Interactive CV Visual / Before-After Bento Card */}
            <div className="rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] p-5 sm:p-6 shadow-lg flex-1 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredSpecialist.avatar}
                    alt={featuredSpecialist.name}
                    className="w-13 h-13 rounded-2xl object-cover border-2 border-[#FF2E3A]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#FF2E3A] text-[#DBF6FF] inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Identidad Verificada
                      </span>
                      <span className="text-xs font-bold text-[#0F172A] flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-[#FF2E3A] text-[#FF2E3A]" />
                        {featuredSpecialist.rating}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-[#0F172A] mt-1">
                      {featuredSpecialist.name}
                    </h3>
                    <p className="text-xs text-[#475569] font-medium">
                      {featuredSpecialist.primaryTradeLabel} • {featuredSpecialist.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Before / After Switcher */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] group">
                <img
                  src={
                    heroShowAfter
                      ? featuredSpecialist.portfolio[0].afterImage
                      : featuredSpecialist.portfolio[0].beforeImage
                  }
                  alt="Evidencia de Portafolio Visual"
                  className="w-full h-52 object-cover transition-all duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#0F172A]/85 backdrop-blur-md p-1 rounded-xl border border-white/15">
                  <button
                    type="button"
                    onClick={() => setHeroShowAfter(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      !heroShowAfter
                        ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    ANTES (Falla)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroShowAfter(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      heroShowAfter
                        ? 'bg-[#DBF6FF] text-[#FF2E3A]'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    DESPUÉS (Solucionado)
                  </button>
                </div>

                <div className="absolute bottom-3 inset-x-3 bg-[#0F172A]/90 backdrop-blur-md p-3 rounded-xl text-white flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-extrabold text-[#DBF6FF]">
                      Evidencia de Portafolio Visual
                    </p>
                    <p className="text-xs font-bold line-clamp-1">
                      {featuredSpecialist.portfolio[0].title}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold shrink-0">
                    ${featuredSpecialist.portfolio[0].approxCostMXN.toLocaleString('es-MX')} MXN
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  onClick={() => onSelectSpecialist(featuredSpecialist)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#DBF6FF] text-[#FF2E3A] font-extrabold text-xs hover:bg-[#FF2E3A] hover:text-[#DBF6FF] transition-colors text-center cursor-pointer"
                >
                  Ver CV Visual Completo
                </button>
                <button
                  onClick={() => onRequestService(featuredSpecialist)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] transition-colors text-center cursor-pointer"
                >
                  Solicitar Servicio
                </button>
              </div>
            </div>

            {/* High-Contrast Machine Red (#FF2E3A) with Glacier Blue (#DBF6FF) Bento Card */}
            <div className="rounded-3xl bg-[#FF2E3A] text-[#DBF6FF] p-6 shadow-xl shadow-[#FF2E3A]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DBF6FF] text-[#FF2E3A] text-[11px] font-extrabold uppercase">
                  <Sparkles className="w-3 h-3" />
                  ¿Eres especialista técnico?
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#DBF6FF]">
                  Transforma tus fotos de trabajo en tu mejor CV profesional
                </h3>
                <p className="text-xs text-[#DBF6FF]/90 font-medium">
                  Obtén tu insignia verificada en 3 minutos y recibe clientes directos sin intermediarios abusivos.
                </p>
              </div>
              <button
                onClick={() => onNavigate('onboarding')}
                className="px-5 py-3 rounded-2xl bg-[#DBF6FF] text-[#FF2E3A] font-extrabold text-xs hover:bg-white transition-all shrink-0 shadow-md cursor-pointer"
              >
                Crear mi CV Visual →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* THE 3 FUNCTIONAL PILLARS OF OFICIOLINK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold uppercase tracking-wider">
            Arquitectura de Confianza
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0F172A] mt-3">
            Los 3 Pilares que profesionalizan el sector técnico
          </h2>
          <p className="text-[#475569] text-sm sm:text-base mt-2">
            Diseñamos OficioLink para erradicar la informalidad y la incertidumbre tanto para quien contrata como para el maestro especialista.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="rounded-3xl bg-[#DBF6FF] p-7 border border-[#0F172A]/10 flex flex-col justify-between">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-[#FF2E3A] text-[#DBF6FF] flex items-center justify-center shadow-md shadow-[#FF2E3A]/20 mb-5">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E3A]">
                Pilar 01 • Seguridad Primero
              </span>
              <h3 className="font-display font-extrabold text-xl text-[#0F172A] mt-1">
                Confianza Digital (Verificación de Identidad)
              </h3>
              <p className="text-sm text-[#475569] mt-3 leading-relaxed">
                Cada especialista pasa por validación de <strong className="text-[#0F172A]">Identificación Oficial (INE frente y vuelta)</strong>, reconocimiento facial biométrico y comprobante de domicilio antes de recibir la insignia <strong className="text-[#FF2E3A]">Especialista Verificado</strong>.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#0F172A]/10 flex items-center justify-between text-xs font-extrabold text-[#0F172A]">
              <span>Folio único trazable por técnico</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#FF2E3A] text-[#DBF6FF]">100% Validado</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-3xl bg-[#FFFFFF] p-7 border-2 border-[#E2E8F0] hover:border-[#FF2E3A] transition-colors flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-[#DBF6FF] text-[#FF2E3A] flex items-center justify-center mb-5">
                <Camera className="w-7 h-7" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E3A]">
                Pilar 02 • El Nuevo CV Técnico
              </span>
              <h3 className="font-display font-extrabold text-xl text-[#0F172A] mt-1">
                Profesionalización (Portafolio Visual)
              </h3>
              <p className="text-sm text-[#475569] mt-3 leading-relaxed">
                Un buen técnico no se mide con un currículum en Word, sino por la calidad de sus acabados. Mostramos galerías reales <strong className="text-[#0F172A]">&ldquo;Antes y Después&rdquo;</strong>, materiales utilizados, costos de referencia y certificaciones.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-extrabold text-[#0F172A]">
              <span>Evidencia fotográfica real</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#DBF6FF] text-[#FF2E3A]">Antes vs. Después</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-3xl bg-[#FF2E3A] text-[#DBF6FF] p-7 flex flex-col justify-between shadow-xl shadow-[#FF2E3A]/20">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-[#DBF6FF] text-[#FF2E3A] flex items-center justify-center mb-5">
                <Award className="w-7 h-7" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#DBF6FF]/90">
                Pilar 03 • Cero Reseñas Falsas
              </span>
              <h3 className="font-display font-extrabold text-xl text-[#DBF6FF] mt-1">
                Reputación Real (Reseñas Verificadas)
              </h3>
              <p className="text-sm text-[#DBF6FF]/90 mt-3 leading-relaxed">
                Solo los clientes que contrataron y concluyeron un servicio en OficioLink pueden emitir una evaluación auditada en 4 ejes: <strong className="text-white">Puntualidad, Calidad Técnica, Limpieza y Precio Justo</strong>.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#DBF6FF]/20 flex items-center justify-between text-xs font-extrabold text-[#DBF6FF]">
              <span>Vinculado a orden de servicio</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#DBF6FF] text-[#FF2E3A]">Sello Auditado</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TRADE CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold uppercase tracking-wider">
              Especialidades Técnicas
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0F172A] mt-2">
              Categorías de Oficios Verificados
            </h2>
          </div>
          <button
            onClick={() => onExploreWithFilters('todos', 'Todas', '')}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#FF2E3A] hover:underline cursor-pointer"
          >
            <span>Ver directorio completo de oficios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onExploreWithFilters(cat.id, 'Todas', '')}
              className="group text-left rounded-3xl p-6 bg-[#FFFFFF] border-2 border-[#E2E8F0] hover:border-[#FF2E3A] hover:bg-[#F7FCFF] transition-all flex flex-col justify-between shadow-sm hover:shadow-lg cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#DBF6FF] text-[#FF2E3A] group-hover:bg-[#FF2E3A] group-hover:text-[#DBF6FF] transition-colors flex items-center justify-center">
                    <TradeIcon name={cat.iconName} className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#DBF6FF] text-[#0F172A]">
                    {cat.specialistsCount} verificados
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-lg text-[#0F172A] group-hover:text-[#FF2E3A] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#475569] mt-1.5 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {cat.popularTags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-[#DBF6FF]/70 text-[#0F172A] text-[11px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="text-[#475569] font-medium">
                  Tarifa ref: <strong className="text-[#0F172A]">{cat.avgRateMXN}</strong>
                </span>
                <span className="font-extrabold text-[#FF2E3A] group-hover:translate-x-1 transition-transform">
                  Explorar →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* TOP RATED SPECIALISTS SHOWCASE */}
      <section className="bg-[#F7FCFF] py-16 border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-[#DBF6FF]" />
                Especialistas Mejor Valorados
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0F172A] mt-2">
                Perfiles de Alto Impacto con Portafolio Real
              </h2>
              <p className="text-sm text-[#475569] mt-1">
                Haz clic en cualquier especialista para inspeccionar su CV Visual, certificaciones y trabajos terminados.
              </p>
            </div>
            <button
              onClick={() => onExploreWithFilters('todos', 'Todas', '')}
              className="px-5 py-3 rounded-2xl bg-[#0F172A] text-[#FFFFFF] hover:bg-[#FF2E3A] hover:text-[#DBF6FF] font-extrabold text-xs transition-colors self-start sm:self-auto cursor-pointer"
            >
              Explorar Todos los Especialistas ({specialists.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.slice(0, 6).map((sp) => {
              const firstProject = sp.portfolio[0];
              return (
                <div
                  key={sp.id}
                  className="rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] hover:border-[#FF2E3A] transition-all overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl"
                >
                  <div>
                    {/* Portfolio Preview Header */}
                    <div className="relative h-44 bg-[#0F172A] overflow-hidden">
                      <img
                        src={firstProject ? firstProject.afterImage : sp.coverImage}
                        alt={sp.name}
                        className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/25 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold shadow-sm">
                          {sp.primaryTradeLabel}
                        </span>
                        {sp.verified && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-[11px] font-extrabold shadow-sm">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            INE + Biométrico
                          </span>
                        )}
                      </div>

                      {/* Portfolio caption */}
                      {firstProject && (
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                          <span className="font-semibold truncate pr-2 text-[#DBF6FF]">
                            Portafolio: {firstProject.title}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-[10px] font-bold shrink-0">
                            {sp.portfolio.length} proyectos
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Specialist Info */}
                    <div className="p-6">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={sp.avatar}
                          alt={sp.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FF2E3A] shrink-0 -mt-10 relative z-10 bg-white shadow-md"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-[#475569] flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#FF2E3A]" />
                              {sp.city}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#DBF6FF] text-[#0F172A] text-xs font-extrabold">
                              <Star className="w-3.5 h-3.5 fill-[#FF2E3A] text-[#FF2E3A]" />
                              {sp.rating} ({sp.reviewsCount})
                            </span>
                          </div>
                          <h3 className="font-display font-extrabold text-base text-[#0F172A] mt-1 truncate">
                            {sp.name}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-[#475569] font-medium mt-3 line-clamp-2">
                        {sp.headline}
                      </p>

                      {/* Specialty Pills in Glacier Blue */}
                      <div className="flex flex-wrap gap-1.5 mt-3.5">
                        {sp.secondaryTrades.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg bg-[#DBF6FF] text-[#0F172A] text-[11px] font-bold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Metrics row */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#E2E8F0] text-center">
                        <div className="bg-[#F7FCFF] p-2 rounded-xl">
                          <p className="text-xs font-extrabold text-[#0F172A]">{sp.yearsExperience} años</p>
                          <p className="text-[10px] text-[#475569]">Experiencia</p>
                        </div>
                        <div className="bg-[#F7FCFF] p-2 rounded-xl">
                          <p className="text-xs font-extrabold text-[#0F172A]">{sp.completedJobs}</p>
                          <p className="text-[10px] text-[#475569]">Servicios OL</p>
                        </div>
                        <div className="bg-[#DBF6FF]/60 p-2 rounded-xl">
                          <p className="text-xs font-extrabold text-[#FF2E3A]">
                            ${sp.baseDiagnosticFeeMXN}
                          </p>
                          <p className="text-[10px] text-[#0F172A] font-semibold">Visita / Diag.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer CTAs */}
                  <div className="px-6 pb-6 pt-1 flex items-center gap-2.5">
                    <button
                      onClick={() => onSelectSpecialist(sp)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#DBF6FF] text-[#FF2E3A] hover:bg-[#0F172A] hover:text-[#FFFFFF] font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver CV Visual</span>
                    </button>
                    <button
                      onClick={() => onRequestService(sp)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] hover:bg-[#E0212D] font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Cotizar Ahora
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW OFICIOLINK WORKS: COMPARATIVE SECTION FOR CLIENTS & WORKERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#DBF6FF] p-6 sm:p-10 lg:p-12 border border-[#0F172A]/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold uppercase tracking-wider">
                ¿Cómo funciona OficioLink?
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0F172A] mt-2">
                Un puente directo, transparente y seguro para ambos lados
              </h2>
            </div>

            {/* Interactive Role Switcher */}
            <div className="inline-flex p-1.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] self-start">
              <button
                type="button"
                onClick={() => setHowItWorksTab('clientes')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  howItWorksTab === 'clientes'
                    ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-md'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Para Clientes que Contratan</span>
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('especialistas')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  howItWorksTab === 'especialistas'
                    ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-md'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Para Especialistas de Oficio</span>
              </button>
            </div>
          </div>

          {howItWorksTab === 'clientes' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {[
                {
                  step: '01',
                  title: 'Explora Portafolios Reales',
                  desc: 'Filtra por oficio, alcaldía/zona y revisa fotos del "Antes y Después" de problemas idénticos al tuyo.',
                  badge: 'Sin citas a ciegas',
                },
                {
                  step: '02',
                  title: 'Verifica su Insignia Digital',
                  desc: 'Confirma que el especialista cuenta con INE validado, selfie biométrica y certificaciones técnicas.',
                  badge: 'Seguridad en casa',
                },
                {
                  step: '03',
                  title: 'Solicita Cotización con Fotos',
                  desc: 'Envía descripción, nivel de urgencia y fotos del desperfecto para recibir un presupuesto claro y garantía.',
                  badge: 'Precio transparente',
                },
                {
                  step: '04',
                  title: 'Califica el Trabajo Concluido',
                  desc: 'Al finalizar el servicio, evalúa puntualidad, calidad, limpieza y precio justo para fortalecer a la comunidad.',
                  badge: 'Reseña Verificada',
                },
              ].map((item, idx) => (
                <div
                  key={item.step}
                  className={`rounded-2xl p-6 flex flex-col justify-between ${
                    idx === 3
                      ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                      : 'bg-[#FFFFFF] text-[#0F172A] border border-[#E2E8F0]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`font-display font-extrabold text-2xl ${
                          idx === 3 ? 'text-[#DBF6FF]' : 'text-[#FF2E3A]'
                        }`}
                      >
                        Paso {item.step}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          idx === 3
                            ? 'bg-[#DBF6FF] text-[#FF2E3A]'
                            : 'bg-[#DBF6FF] text-[#FF2E3A]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-display font-extrabold text-lg">{item.title}</h3>
                    <p
                      className={`text-xs mt-2 leading-relaxed ${
                        idx === 3 ? 'text-[#DBF6FF]/90' : 'text-[#475569]'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {[
                {
                  step: '01',
                  title: 'Crea tu Perfil Técnico',
                  desc: 'Registra tu oficio principal, especialidades, años de experiencia y zonas de cobertura en tu ciudad.',
                  badge: 'Gratis en 3 min',
                },
                {
                  step: '02',
                  title: 'Valida tu Identidad (INE + Selfie)',
                  desc: 'Sube tu identificación oficial y selfie de validación para desbloquear la insignia Especialista Verificado.',
                  badge: '+300% más confianza',
                },
                {
                  step: '03',
                  title: 'Arma tu Portafolio Visual',
                  desc: 'Sube fotos del Antes y Después de tus mejores trabajos. Tu talento visual habla más que mil palabras.',
                  badge: 'Tu CV Visual',
                },
                {
                  step: '04',
                  title: 'Gestiona Solicitudes y Crece',
                  desc: 'Recibe solicitudes con fotos del problema, envía cotizaciones formales y acumula reseñas de 5 estrellas.',
                  badge: 'Clientes Directos',
                },
              ].map((item, idx) => (
                <div
                  key={item.step}
                  className={`rounded-2xl p-6 flex flex-col justify-between ${
                    idx === 3
                      ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                      : 'bg-[#FFFFFF] text-[#0F172A] border border-[#E2E8F0]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`font-display font-extrabold text-2xl ${
                          idx === 3 ? 'text-[#DBF6FF]' : 'text-[#FF2E3A]'
                        }`}
                      >
                        Paso {item.step}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#DBF6FF] text-[#FF2E3A]">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-display font-extrabold text-lg">{item.title}</h3>
                    <p
                      className={`text-xs mt-2 leading-relaxed ${
                        idx === 3 ? 'text-[#DBF6FF]/90' : 'text-[#475569]'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#0F172A]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF2E3A] shrink-0" />
              <p className="text-sm font-bold text-[#0F172A]">
                Sin comisiones ocultas para el cliente • Trato directo respaldado por reputación verificada
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onExploreWithFilters('todos', 'Todas', '')}
                className="px-5 py-3 rounded-xl bg-[#FFFFFF] text-[#0F172A] font-extrabold text-xs border border-[#0F172A]/15 hover:bg-[#0F172A] hover:text-white transition-colors cursor-pointer"
              >
                Buscar un Especialista
              </button>
              <button
                onClick={() => onNavigate('onboarding')}
                className="px-5 py-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] transition-colors shadow-md shadow-[#FF2E3A]/20 cursor-pointer"
              >
                Registrarme como Especialista
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
