import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Star,
  Clock,
  Award,
  CheckCircle2,
  Camera,
  Share2,
  ArrowLeft,
  Wrench,
  Calendar,
  Sparkles,
  X,
  FileCheck,
  UserCheck,
  Layers,
} from 'lucide-react';
import { Specialist, PortfolioProject } from '../types/oficiolink';

interface ProfileViewProps {
  specialist: Specialist;
  allSpecialists: Specialist[];
  onSelectSpecialist: (specialist: Specialist) => void;
  onRequestService: (specialist: Specialist) => void;
  onBackToExplorer: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  specialist,
  allSpecialists,
  onSelectSpecialist,
  onRequestService,
  onBackToExplorer,
}) => {
  const [selectedProjectModal, setSelectedProjectModal] = useState<PortfolioProject | null>(null);
  const [cardBeforeToggle, setCardBeforeToggle] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleProjectBefore = (projId: string) => {
    setCardBeforeToggle((prev) => ({ ...prev, [projId]: !prev[projId] }));
  };

  const handleCopyProfileLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
      {/* Top Switcher Bar: Back to Explorer + Quick Switch Specialist */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7FCFF] p-3.5 rounded-2xl border border-[#E2E8F0]">
        <button
          onClick={onBackToExplorer}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0F172A] hover:text-[#FF2E3A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF2E3A]" />
          <span>Volver al Explorador de Especialistas</span>
        </button>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#475569] shrink-0">Cambiar CV Visual:</span>
          {allSpecialists.map((sp) => (
            <button
              key={sp.id}
              onClick={() => onSelectSpecialist(sp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                sp.id === specialist.id
                  ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                  : 'bg-[#FFFFFF] text-[#0F172A] border border-[#E2E8F0] hover:bg-[#DBF6FF]'
              }`}
            >
              {sp.name.split(' ').slice(0, 3).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* PROFILE HEADER (EL "CV VISUAL") */}
      <div className="rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] overflow-hidden shadow-lg">
        {/* Cover Banner */}
        <div className="relative h-56 sm:h-72 bg-[#0F172A]">
          <img
            src={specialist.coverImage}
            alt={specialist.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />

          {/* Floating Verification Badge on Cover */}
          <div className="absolute top-4 right-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs shadow-lg">
              <ShieldCheck className="w-4 h-4" />
              <span>Especialista Verificado • {specialist.verificationDetails.badgeCode}</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2">
            <button
              onClick={handleCopyProfileLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFFFFF]/90 backdrop-blur-md text-[#0F172A] text-xs font-extrabold hover:bg-[#DBF6FF] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#FF2E3A]" />
              <span>{copiedLink ? '¡Enlace de CV Copiado!' : 'Compartir CV Digital'}</span>
            </button>
          </div>
        </div>

        {/* Profile Main Body */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <img
                src={specialist.avatar}
                alt={specialist.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-[#FF2E3A] bg-white shadow-xl"
              />
              <div className="space-y-2 pt-2 sm:pt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold">
                    {specialist.primaryTradeLabel}
                  </span>
                  {specialist.emergency247 && (
                    <span className="px-3 py-1 rounded-full bg-[#0F172A] text-[#DBF6FF] text-xs font-extrabold">
                      Disponible Urgencias 24/7
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#475569]">
                    Verificado desde {specialist.verificationDetails.verifiedSince}
                  </span>
                </div>

                <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0F172A]">
                  {specialist.name}
                </h1>

                <p className="text-sm sm:text-base text-[#475569] font-medium max-w-3xl">
                  {specialist.headline}
                </p>
              </div>
            </div>

            {/* Primary CTA Box */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0 bg-[#DBF6FF] p-4 rounded-2xl border border-[#FF2E3A]/20">
              <div className="text-left lg:text-right">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#475569] block">
                  Visita de Diagnóstico / Cotización
                </span>
                <span className="font-display font-extrabold text-2xl text-[#FF2E3A]">
                  ${specialist.baseDiagnosticFeeMXN} MXN
                </span>
                <span className="text-xs text-[#0F172A] font-semibold block">
                  Bonificable al contratar el servicio
                </span>
              </div>
              <button
                onClick={() => onRequestService(specialist)}
                className="px-6 py-3.5 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-sm hover:bg-[#E0212D] transition-all shadow-md shadow-[#FF2E3A]/25 cursor-pointer"
              >
                Solicitar Servicio / Cotizar
              </button>
            </div>
          </div>

          {/* Bento Stats & Trust Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#E2E8F0]">
            <div className="p-4 rounded-2xl bg-[#F7FCFF] border border-[#E2E8F0]">
              <p className="text-xs font-bold text-[#475569] uppercase">Calificación Global</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-5 h-5 fill-[#FF2E3A] text-[#FF2E3A]" />
                <span className="font-display font-extrabold text-2xl text-[#0F172A]">
                  {specialist.rating}
                </span>
                <span className="text-xs text-[#475569] font-semibold">
                  ({specialist.reviewsCount} reseñas)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FCFF] border border-[#E2E8F0]">
              <p className="text-xs font-bold text-[#475569] uppercase">Experiencia Comprobada</p>
              <p className="font-display font-extrabold text-2xl text-[#0F172A] mt-1">
                {specialist.yearsExperience} Años
              </p>
              <p className="text-xs text-[#FF2E3A] font-bold">
                {specialist.completedJobs} servicios en OficioLink
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FCFF] border border-[#E2E8F0]">
              <p className="text-xs font-bold text-[#475569] uppercase">Zona de Cobertura</p>
              <p className="font-display font-extrabold text-lg text-[#0F172A] mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#FF2E3A]" />
                {specialist.city}
              </p>
              <p className="text-xs text-[#475569] truncate">
                {specialist.coverageZones.join(' • ')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FF2E3A] text-[#DBF6FF]">
              <p className="text-xs font-extrabold uppercase text-[#DBF6FF]/90">
                Tiempo de Respuesta
              </p>
              <p className="font-display font-extrabold text-xl text-[#DBF6FF] mt-1 flex items-center gap-1.5">
                <Clock className="w-5 h-5" />
                {specialist.responseTime}
              </p>
              <p className="text-xs text-[#DBF6FF]/90 font-medium">
                Atención directa por plataforma
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BENTO ROW: IDENTITY VERIFICATION AUDIT + BIO & CERTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Digital Trust Audit Card in Glacier Blue (#DBF6FF) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#DBF6FF] p-6 sm:p-8 border border-[#0F172A]/10 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold uppercase">
              <ShieldCheck className="w-4 h-4" />
              Pilar 1: Confianza Digital
            </div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] mt-3">
              Expediente de Identidad Verificada
            </h2>
            <p className="text-xs text-[#475569] mt-1 font-medium">
              OficioLink validó manualmente los documentos oficiales y biometría de este especialista antes de activar su perfil público.
            </p>

            <div className="space-y-3 mt-5">
              {[
                {
                  label: 'Identificación Oficial INE / IFE Vigente (Frente y Vuelta)',
                  status: specialist.verificationDetails.ineVerified,
                },
                {
                  label: 'Validación Biométrica Facial en Vivo (Selfie Match)',
                  status: specialist.verificationDetails.biometricSelfie,
                },
                {
                  label: 'Comprobante de Domicilio y Taller / Base Operativa',
                  status: specialist.verificationDetails.addressVerified,
                },
                {
                  label: 'Carta Compromiso de Ética y Garantía OficioLink',
                  status: specialist.verificationDetails.backgroundCheck,
                },
              ].map((check) => (
                <div
                  key={check.label}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0]"
                >
                  <span className="text-xs font-bold text-[#0F172A] pr-2">{check.label}</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF2E3A] text-[#DBF6FF] text-[11px] font-extrabold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verificado
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#0F172A]/10 flex items-center justify-between text-xs font-extrabold text-[#0F172A]">
            <span>Folio de Certificación Digital:</span>
            <span className="font-mono text-[#FF2E3A]">{specialist.verificationDetails.badgeCode}</span>
          </div>
        </div>

        {/* Right: Technical Bio, Specialties, Certifications & Tools */}
        <div className="lg:col-span-7 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E3A]">
              Semblanza Técnica Profesional
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] mt-1">
              Acerca del Especialista y Metodología de Trabajo
            </h2>
            <p className="text-sm text-[#475569] mt-2 leading-relaxed">{specialist.bio}</p>
          </div>

          {/* Secondary Trades in Glacier Blue */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F172A] mb-2.5">
              Especialidades Dominadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {specialist.secondaryTrades.map((trade) => (
                <span
                  key={trade}
                  className="px-3.5 py-1.5 rounded-xl bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold"
                >
                  {trade}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications & Standards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#F7FCFF] border border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F172A] uppercase mb-3">
                <Award className="w-4 h-4 text-[#FF2E3A]" />
                <span>Certificaciones y Normas</span>
              </div>
              <ul className="space-y-2">
                {specialist.certifications.map((cert) => (
                  <li key={cert} className="flex items-start gap-2 text-xs text-[#475569] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#FF2E3A] shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FCFF] border border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F172A] uppercase mb-3">
                <Wrench className="w-4 h-4 text-[#FF2E3A]" />
                <span>Equipamiento y Garantías</span>
              </div>
              <ul className="space-y-2">
                {specialist.toolsAndWarranty.map((tool) => (
                  <li key={tool} className="flex items-start gap-2 text-xs text-[#475569] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#FF2E3A] shrink-0 mt-0.5" />
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* VISUAL PORTFOLIO GALLERY ("ANTES Y DESPUÉS") */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold uppercase">
              <Camera className="w-3.5 h-3.5" />
              Pilar 2: Portafolio Visual Verificado
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0F172A] mt-2">
              Galería de Proyectos Realizados (&ldquo;Antes y Después&rdquo;)
            </h2>
            <p className="text-sm text-[#475569]">
              Alterna entre el estado inicial del problema y el resultado técnico final, o haz clic en un proyecto para ver la ficha técnica completa.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialist.portfolio.map((proj) => {
            const isShowingBefore = !!cardBeforeToggle[proj.id];

            return (
              <div
                key={proj.id}
                className="rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] hover:border-[#FF2E3A] transition-all overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl"
              >
                <div>
                  {/* Interactive Before/After Image Container */}
                  <div className="relative h-60 bg-[#0F172A]">
                    <img
                      src={isShowingBefore ? proj.beforeImage : proj.afterImage}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-all duration-300"
                    />

                    {/* Before / After Pill Switcher */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#0F172A]/85 backdrop-blur-md p-1 rounded-xl border border-white/15">
                      <button
                        type="button"
                        onClick={() => setCardBeforeToggle((p) => ({ ...p, [proj.id]: true }))}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer ${
                          isShowingBefore
                            ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        ANTES
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardBeforeToggle((p) => ({ ...p, [proj.id]: false }))}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer ${
                          !isShowingBefore
                            ? 'bg-[#DBF6FF] text-[#FF2E3A]'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        DESPUÉS
                      </button>
                    </div>

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold shadow-md">
                      ${proj.approxCostMXN.toLocaleString('es-MX')} MXN aprox.
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-[#475569]">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#DBF6FF] text-[#FF2E3A] font-extrabold">
                        {proj.category}
                      </span>
                      <span>{proj.completedDate}</span>
                    </div>

                    <h3 className="font-display font-extrabold text-lg text-[#0F172A] leading-snug">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-[#475569] line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.materialsUsed.slice(0, 3).map((mat) => (
                        <span
                          key={mat}
                          className="px-2 py-0.5 rounded bg-[#F7FCFF] border border-[#E2E8F0] text-[11px] font-semibold text-[#0F172A]"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProjectModal(proj)}
                    className="w-full py-3 rounded-xl bg-[#DBF6FF] text-[#FF2E3A] hover:bg-[#FF2E3A] hover:text-[#DBF6FF] font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Ver Ficha Técnica y Comparativa</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VERIFIED REVIEWS SECTION (PILAR 3: REPUTACIÓN REAL) */}
      <section className="rounded-3xl bg-[#F7FCFF] border-2 border-[#E2E8F0] p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quantitative Breakdown */}
          <div className="lg:col-span-4 rounded-3xl bg-[#FFFFFF] p-6 border border-[#E2E8F0] space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold uppercase">
              <FileCheck className="w-3.5 h-3.5" />
              Pilar 3: Reputación Real
            </span>

            <div className="flex items-end gap-3">
              <span className="font-display font-extrabold text-5xl text-[#0F172A]">
                {specialist.rating}
              </span>
              <div className="pb-1">
                <div className="flex items-center gap-0.5 text-[#FF2E3A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF2E3A]" />
                  ))}
                </div>
                <p className="text-xs font-bold text-[#475569] mt-0.5">
                  Basado en {specialist.reviewsCount} servicios concluidos
                </p>
              </div>
            </div>

            {/* 4 Key Trade Metrics Progress Bars */}
            <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
              {[
                { label: 'Puntualidad y Compromiso', score: specialist.ratingBreakdown.punctuality },
                { label: 'Calidad Técnica del Oficio', score: specialist.ratingBreakdown.quality },
                { label: 'Limpieza y Orden en Casa', score: specialist.ratingBreakdown.cleanliness },
                { label: 'Precio Justo vs. Cotización', score: specialist.ratingBreakdown.fairPrice },
              ].map((metric) => (
                <div key={metric.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#0F172A]">{metric.label}</span>
                    <span className="text-[#FF2E3A] font-extrabold">{metric.score.toFixed(2)} / 5.0</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#DBF6FF] overflow-hidden">
                    <div
                      className="h-full bg-[#FF2E3A] rounded-full"
                      style={{ width: `${(metric.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#DBF6FF] text-xs text-[#0F172A] font-semibold">
              <strong className="text-[#FF2E3A] block mb-0.5">Política Cero Reseñas Falsas:</strong>
              Solo los clientes con una orden de trabajo cerrada y pagada en OficioLink pueden calificar a este especialista.
            </div>
          </div>

          {/* Client Reviews List */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A]">
              Evaluaciones de Clientes Verificados ({specialist.reviews.length} destacadas)
            </h3>

            {specialist.reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-3xl bg-[#FFFFFF] p-6 border border-[#E2E8F0] space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.clientAvatar}
                      alt={rev.clientName}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#E2E8F0]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-extrabold text-sm text-[#0F172A]">
                          {rev.clientName}
                        </h4>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#DBF6FF] text-[#FF2E3A] text-[10px] font-extrabold">
                          <CheckCircle2 className="w-3 h-3" />
                          Servicio Concluido #{rev.verifiedServiceId}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569]">
                        {rev.clientZone} • {rev.date}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold self-start sm:self-auto">
                    <Star className="w-3.5 h-3.5 fill-[#DBF6FF]" />
                    <span>{rev.overallRating.toFixed(1)} Excelente</span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] inline-block text-xs font-bold text-[#0F172A]">
                  Trabajo realizado: <span className="text-[#FF2E3A]">{rev.serviceTitle}</span>
                </div>

                <p className="text-sm text-[#0F172A] leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E2E8F0] text-[11px] font-bold text-[#475569]">
                  <span>Puntualidad: {rev.metrics.punctuality}★</span>
                  <span>Calidad: {rev.metrics.quality}★</span>
                  <span>Limpieza: {rev.metrics.cleanliness}★</span>
                  <span>Precio Justo: {rev.metrics.fairPrice}★</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT DETAIL MODAL (ANTES Y DESPUÉS LADO A LADO) */}
      {selectedProjectModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-4xl w-full border-2 border-[#E2E8F0] overflow-hidden shadow-2xl my-8">
            {/* Modal Header */}
            <div className="bg-[#DBF6FF] px-6 py-5 flex items-center justify-between border-b border-[#0F172A]/10">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-[11px] font-extrabold uppercase">
                  {selectedProjectModal.category}
                </span>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#0F172A] mt-1">
                  {selectedProjectModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProjectModal(null)}
                className="p-2 rounded-xl bg-[#FFFFFF] text-[#0F172A] hover:bg-[#FF2E3A] hover:text-[#DBF6FF] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Side-by-Side Before & After Photos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold uppercase">
                    1. ANTES (Diagnóstico / Problema)
                  </span>
                  <img
                    src={selectedProjectModal.beforeImage}
                    alt="Antes del trabajo"
                    className="w-full h-56 object-cover rounded-2xl border-2 border-[#E2E8F0]"
                  />
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#0F172A] text-[#DBF6FF] text-xs font-extrabold uppercase">
                    2. DESPUÉS (Solución Certificada)
                  </span>
                  <img
                    src={selectedProjectModal.afterImage}
                    alt="Después del trabajo"
                    className="w-full h-56 object-cover rounded-2xl border-2 border-[#FF2E3A]"
                  />
                </div>
              </div>

              {/* Project Metadata Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7FCFF] p-4 rounded-2xl border border-[#E2E8F0]">
                <div>
                  <p className="text-[11px] font-bold text-[#475569] uppercase">Costo Aproximado</p>
                  <p className="font-display font-extrabold text-base text-[#FF2E3A]">
                    ${selectedProjectModal.approxCostMXN.toLocaleString('es-MX')} MXN
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#475569] uppercase">Tiempo Ejecución</p>
                  <p className="font-display font-extrabold text-sm text-[#0F172A]">
                    {selectedProjectModal.duration}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#475569] uppercase">Ubicación</p>
                  <p className="font-display font-extrabold text-xs text-[#0F172A]">
                    {selectedProjectModal.location}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#475569] uppercase">Fecha Concluida</p>
                  <p className="font-display font-extrabold text-sm text-[#0F172A]">
                    {selectedProjectModal.completedDate}
                  </p>
                </div>
              </div>

              {/* Technical Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F7FCFF] border border-[#E2E8F0]">
                  <h4 className="font-display font-extrabold text-sm text-[#FF2E3A]">
                    Reto Técnico Detectado
                  </h4>
                  <p className="text-xs text-[#0F172A] mt-1.5 leading-relaxed">
                    {selectedProjectModal.technicalChallenge}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#DBF6FF]/60 border border-[#FF2E3A]/20">
                  <h4 className="font-display font-extrabold text-sm text-[#0F172A]">
                    Solución e Ingeniería Aplicada
                  </h4>
                  <p className="text-xs text-[#0F172A] mt-1.5 leading-relaxed">
                    {selectedProjectModal.solutionApplied}
                  </p>
                </div>
              </div>

              {/* Materials Used */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#475569] mb-2">
                  Materiales e Insumos Empleados
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProjectModal.materialsUsed.map((mat) => (
                    <span
                      key={mat}
                      className="px-3 py-1 rounded-xl bg-[#DBF6FF] text-[#0F172A] text-xs font-extrabold"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer CTA inside modal */}
              <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs font-bold text-[#475569]">
                  ¿Tienes un requerimiento similar en casa o negocio?
                </p>
                <button
                  onClick={() => {
                    const current = specialist;
                    setSelectedProjectModal(null);
                    onRequestService(current);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] transition-colors cursor-pointer"
                >
                  Cotizar un Proyecto Similar con {specialist.name.split(' ')[2] || specialist.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
