import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Wrench,
  Star,
  FileText,
  ArrowRight,
  Camera,
  Sparkles,
  DollarSign,
  Eye,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import {
  ServiceRequest,
  ServiceRequestStatus,
  Specialist,
  PortfolioProject,
  VerifiedReview,
} from '../types/oficiolink';

interface DashboardViewProps {
  requests: ServiceRequest[];
  specialists: Specialist[];
  onUpdateRequestStatus: (
    requestId: string,
    newStatus: ServiceRequestStatus,
    quotedAmount?: number,
    quoteNotes?: string
  ) => void;
  onAddPortfolioProject: (specialistId: string, project: PortfolioProject) => void;
  onAddVerifiedReview: (
    specialistId: string,
    requestId: string,
    review: VerifiedReview
  ) => void;
  onOpenNewRequestModal: () => void;
  onViewSpecialistProfile: (specialist: Specialist) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  requests,
  specialists,
  onUpdateRequestStatus,
  onAddPortfolioProject,
  onAddVerifiedReview,
  onOpenNewRequestModal,
  onViewSpecialistProfile,
}) => {
  const [dashboardMode, setDashboardMode] = useState<'especialista' | 'cliente'>('especialista');
  const [statusFilter, setStatusFilter] = useState<'todas' | ServiceRequestStatus>('todas');

  // Quote Form state for a specific request
  const [quotingRequestId, setQuotingRequestId] = useState<string | null>(null);
  const [quoteAmountInput, setQuoteAmountInput] = useState<number>(3200);
  const [quoteNotesInput, setQuoteNotesInput] = useState<string>(
    'Incluye mano de obra certificada, revisión con equipo de diagnóstico, insumos de norma y póliza de garantía escrita por 365 días.'
  );

  // Review Form state for a completed request (Client perspective)
  const [reviewingRequestId, setReviewingRequestId] = useState<string | null>(null);
  const [revComment, setRevComment] = useState<string>(
    'Trabajo impecable, llegó puntual con gafete verificado y dejó toda la instalación funcionando al 100%.'
  );
  const [revPunctuality, setRevPunctuality] = useState<number>(5);
  const [revQuality, setRevQuality] = useState<number>(5);
  const [revCleanliness, setRevCleanliness] = useState<number>(5);
  const [revFairPrice, setRevFairPrice] = useState<number>(5);

  // Quick Add Portfolio Form state
  const [showAddPortfolio, setShowAddPortfolio] = useState<boolean>(false);
  const [newProjTitle, setNewProjTitle] = useState<string>(
    'Sustitución de Interruptor General y Tierra Física Residencial'
  );
  const [newProjCost, setNewProjCost] = useState<number>(3900);
  const [newProjDesc, setNewProjDesc] = useState<string>(
    'Se instaló varilla Copperweld para puesta a tierra y se balancearon dos circuitos de cocina.'
  );
  const [portfolioSuccessBanner, setPortfolioSuccessBanner] = useState<boolean>(false);

  const filteredRequests = requests.filter((r) =>
    statusFilter === 'todas' ? true : r.status === statusFilter
  );

  const countByStatus = (st: ServiceRequestStatus) =>
    requests.filter((r) => r.status === st).length;

  const handleSendQuote = (reqId: string) => {
    onUpdateRequestStatus(reqId, 'cotizada', quoteAmountInput, quoteNotesInput);
    setQuotingRequestId(null);
  };

  const handlePublishQuickProject = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSpecialist = specialists[0];
    const newProj: PortfolioProject = {
      id: `proj-dash-${Date.now()}`,
      title: newProjTitle,
      category: targetSpecialist.primaryTradeLabel,
      location: `${targetSpecialist.city}`,
      completedDate: 'Octubre 2026',
      duration: '1 jornada',
      approxCostMXN: newProjCost,
      description: newProjDesc,
      technicalChallenge: 'Falla recurrente reportada mediante orden de servicio OficioLink.',
      solutionApplied: newProjDesc,
      materialsUsed: targetSpecialist.secondaryTrades.slice(0, 3),
      beforeImage:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
      afterImage:
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
      ],
    };

    onAddPortfolioProject(targetSpecialist.id, newProj);
    setShowAddPortfolio(false);
    setPortfolioSuccessBanner(true);
    setTimeout(() => setPortfolioSuccessBanner(false), 4000);
  };

  const handleSubmitClientReview = (req: ServiceRequest) => {
    const avg = Number(
      ((revPunctuality + revQuality + revCleanliness + revFairPrice) / 4).toFixed(2)
    );
    const newRev: VerifiedReview = {
      id: `rev-live-${Date.now()}`,
      clientName: req.clientName,
      clientAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      clientZone: req.clientZone,
      serviceTitle: req.problemTitle,
      date: 'Hace unos instantes',
      verifiedServiceId: req.folio,
      overallRating: avg,
      metrics: {
        punctuality: revPunctuality,
        quality: revQuality,
        cleanliness: revCleanliness,
        fairPrice: revFairPrice,
      },
      comment: revComment,
    };

    onAddVerifiedReview(req.specialistId, req.id, newRev);
    setReviewingRequestId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
      {/* Top Role Switcher Header in Glacier Blue (#DBF6FF) */}
      <div className="rounded-3xl bg-[#DBF6FF] p-6 sm:p-8 border border-[#0F172A]/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Centro de Operaciones En Vivo
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0F172A] mt-2">
              {dashboardMode === 'especialista'
                ? 'Panel del Especialista: Solicitudes y Portafolio'
                : 'Panel del Cliente: Mis Servicios y Reseñas Verificadas'}
            </h1>
            <p className="text-sm text-[#475569] mt-1 font-medium">
              {dashboardMode === 'especialista'
                ? 'Cotiza solicitudes entrantes, cambia el estado de tus órdenes y alimenta tu CV Visual.'
                : 'Revisa las cotizaciones de tus especialistas, aprueba presupuestos y califica servicios concluidos.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Switch between Worker & Client Dashboard */}
            <div className="inline-flex p-1.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setDashboardMode('especialista')}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  dashboardMode === 'especialista'
                    ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-sm'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Vista Especialista (Trabajador)
              </button>
              <button
                type="button"
                onClick={() => setDashboardMode('cliente')}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  dashboardMode === 'cliente'
                    ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-sm'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Vista Cliente (Contratante)
              </button>
            </div>

            <button
              onClick={onOpenNewRequestModal}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-[#0F172A] text-[#DBF6FF] hover:bg-[#FF2E3A] font-extrabold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Solicitud de Servicio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] p-5">
          <span className="text-xs font-extrabold uppercase text-[#475569]">
            Nuevas por Cotizar
          </span>
          <p className="font-display font-extrabold text-3xl text-[#FF2E3A] mt-1">
            {countByStatus('nueva')}
          </p>
          <p className="text-xs text-[#475569] mt-1">Requieren respuesta rápida</p>
        </div>

        <div className="rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] p-5">
          <span className="text-xs font-extrabold uppercase text-[#475569]">
            Cotizadas / En Revisión
          </span>
          <p className="font-display font-extrabold text-3xl text-[#0F172A] mt-1">
            {countByStatus('cotizada')}
          </p>
          <p className="text-xs text-[#475569] mt-1">Con presupuesto desglosado</p>
        </div>

        <div className="rounded-3xl bg-[#DBF6FF] border border-[#FF2E3A]/20 p-5">
          <span className="text-xs font-extrabold uppercase text-[#0F172A]">
            Servicios En Progreso
          </span>
          <p className="font-display font-extrabold text-3xl text-[#FF2E3A] mt-1">
            {countByStatus('en_progreso')}
          </p>
          <p className="text-xs text-[#0F172A] font-semibold mt-1">Garantía OficioLink activa</p>
        </div>

        <div className="rounded-3xl bg-[#FF2E3A] text-[#DBF6FF] p-5 shadow-lg shadow-[#FF2E3A]/20">
          <span className="text-xs font-extrabold uppercase text-[#DBF6FF]/90">
            Trabajos Finalizados
          </span>
          <p className="font-display font-extrabold text-3xl text-[#DBF6FF] mt-1">
            {countByStatus('finalizada')}
          </p>
          <p className="text-xs text-[#DBF6FF]/90 mt-1">Listos para Reseña Verificada</p>
        </div>
      </div>

      {/* SPECIALIST PORTFOLIO QUICK UPDATER */}
      {dashboardMode === 'especialista' && (
        <div className="rounded-3xl bg-[#F7FCFF] border-2 border-[#E2E8F0] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#DBF6FF] text-[#FF2E3A] flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-lg text-[#0F172A]">
                  Actualizador Rápido de Portafolio Visual (&ldquo;Antes y Después&rdquo;)
                </h2>
                <p className="text-xs text-[#475569]">
                  ¿Terminaste un servicio hoy? Súbelo en 30 segundos al CV Visual de{' '}
                  <strong className="text-[#0F172A]">{specialists[0]?.name}</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onViewSpecialistProfile(specialists[0])}
                className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] text-[#0F172A] border border-[#E2E8F0] font-bold text-xs hover:bg-[#DBF6FF] cursor-pointer"
              >
                Ver Mi CV Visual
              </button>
              <button
                type="button"
                onClick={() => setShowAddPortfolio(!showAddPortfolio)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddPortfolio ? 'Cerrar Formulario' : 'Subir Nuevo Proyecto'}</span>
              </button>
            </div>
          </div>

          {portfolioSuccessBanner && (
            <div className="mt-4 p-4 rounded-2xl bg-[#DBF6FF] border border-[#FF2E3A] flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0F172A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF2E3A]" />
                ¡Proyecto agregado con éxito al Portafolio Visual del Especialista!
              </span>
              <button
                onClick={() => onViewSpecialistProfile(specialists[0])}
                className="px-3 py-1 rounded-lg bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold cursor-pointer"
              >
                Inspeccionar en el CV Visual →
              </button>
            </div>
          )}

          {showAddPortfolio && (
            <form
              onSubmit={handlePublishQuickProject}
              className="mt-6 pt-6 border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
            >
              <div className="md:col-span-5">
                <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1">
                  Título del Proyecto Terminado
                </label>
                <input
                  type="text"
                  required
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1">
                  Costo (MXN)
                </label>
                <input
                  type="number"
                  required
                  value={newProjCost}
                  onChange={(e) => setNewProjCost(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-extrabold text-[#FF2E3A]"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1">
                  Nota Técnica
                </label>
                <input
                  type="text"
                  required
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A]"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] cursor-pointer"
                >
                  Publicar en CV
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* FILTER TABS FOR SERVICE REQUESTS */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'todas', label: `Todas (${requests.length})` },
            { id: 'nueva', label: `Nuevas (${countByStatus('nueva')})` },
            { id: 'cotizada', label: `Cotizadas (${countByStatus('cotizada')})` },
            { id: 'en_progreso', label: `En Progreso (${countByStatus('en_progreso')})` },
            { id: 'finalizada', label: `Finalizadas (${countByStatus('finalizada')})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as 'todas' | ServiceRequestStatus)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-sm'
                  : 'bg-[#F7FCFF] text-[#0F172A] border border-[#E2E8F0] hover:bg-[#DBF6FF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SERVICE REQUEST CARDS PIPELINE */}
      <div className="space-y-5">
        {filteredRequests.map((req) => {
          const isQuotingThis = quotingRequestId === req.id;
          const isReviewingThis = reviewingRequestId === req.id;

          const statusBadgeStyle = {
            nueva: 'bg-[#FF2E3A] text-[#DBF6FF]',
            cotizada: 'bg-[#DBF6FF] text-[#FF2E3A] border border-[#FF2E3A]/30',
            en_progreso: 'bg-[#0F172A] text-[#DBF6FF]',
            finalizada: 'bg-[#DBF6FF] text-[#0F172A]',
          }[req.status];

          const statusLabel = {
            nueva: '1. Nueva Solicitud Recibida',
            cotizada: '2. Cotización Formal Enviada',
            en_progreso: '3. Servicio En Progreso',
            finalizada: '4. Servicio Concluido y Auditado',
          }[req.status];

          return (
            <div
              key={req.id}
              className="rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] hover:border-[#FF2E3A]/60 transition-all p-6 shadow-sm space-y-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${statusBadgeStyle}`}>
                    {statusLabel}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#475569]">
                    Folio #{req.folio}
                  </span>
                  <span className="text-xs text-[#475569]">• {req.createdAt}</span>
                  {req.urgency === 'emergencia_hoy' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E3A]/15 text-[#FF2E3A] text-[11px] font-extrabold">
                      ⚡ Urgencia Mismo Día
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={req.specialistAvatar}
                    alt={req.specialistName}
                    className="w-9 h-9 rounded-xl object-cover border border-[#FF2E3A]"
                  />
                  <div className="text-xs">
                    <p className="font-extrabold text-[#0F172A]">{req.specialistName}</p>
                    <p className="text-[#475569]">{req.specialistTrade}</p>
                  </div>
                </div>
              </div>

              {/* Main Body of Request */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Issue Photo */}
                <div className="lg:col-span-3">
                  <div className="relative h-36 rounded-2xl overflow-hidden border border-[#E2E8F0]">
                    <img
                      src={req.issuePhotos[0]}
                      alt={req.problemTitle}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#0F172A]/85 text-[#DBF6FF] text-[10px] font-bold">
                      Foto enviada por cliente
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-6 space-y-2.5">
                  <h3 className="font-display font-extrabold text-lg text-[#0F172A]">
                    {req.problemTitle}
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {req.problemDescription}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold uppercase text-[#475569] block">
                        Cliente Verificado
                      </span>
                      <strong className="text-[#0F172A]">{req.clientName}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold uppercase text-[#475569] block">
                        Ubicación / Zona
                      </span>
                      <strong className="text-[#0F172A] line-clamp-1">{req.clientZone}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold uppercase text-[#475569] block">
                        Cita Sugerida
                      </span>
                      <strong className="text-[#FF2E3A]">{req.suggestedDate}</strong>
                    </div>
                  </div>

                  {req.quotedAmountMXN && (
                    <div className="p-3.5 rounded-2xl bg-[#DBF6FF] border border-[#FF2E3A]/20 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#0F172A]">
                          Cotización Formal OficioLink:
                        </span>
                        <span className="font-display font-extrabold text-base text-[#FF2E3A]">
                          ${req.quotedAmountMXN.toLocaleString('es-MX')} MXN
                        </span>
                      </div>
                      {req.quoteNotes && (
                        <p className="text-xs text-[#0F172A]/80 mt-1">{req.quoteNotes}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Column (Depends on Specialist vs Client Mode & Current Status) */}
                <div className="lg:col-span-3 flex flex-col justify-between gap-3 bg-[#F7FCFF] p-4 rounded-2xl border border-[#E2E8F0]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#475569] block">
                      Presupuesto Estimado Cliente
                    </span>
                    <span className="font-display font-extrabold text-xl text-[#0F172A]">
                      ${req.estimatedBudgetMXN.toLocaleString('es-MX')} MXN
                    </span>
                  </div>

                  {dashboardMode === 'especialista' ? (
                    <div className="space-y-2">
                      {req.status === 'nueva' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setQuotingRequestId(req.id);
                              setQuoteAmountInput(req.estimatedBudgetMXN);
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] transition-colors cursor-pointer"
                          >
                            Enviar Cotización Formal
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateRequestStatus(
                                req.id,
                                'en_progreso',
                                req.estimatedBudgetMXN,
                                'Presupuesto aceptado de forma directa.'
                              )
                            }
                            className="w-full py-2 px-3 rounded-xl bg-[#DBF6FF] text-[#0F172A] font-bold text-xs hover:bg-[#0F172A] hover:text-white transition-colors cursor-pointer"
                          >
                            Aceptar e Iniciar Trabajo
                          </button>
                        </>
                      )}

                      {req.status === 'cotizada' && (
                        <button
                          type="button"
                          onClick={() => onUpdateRequestStatus(req.id, 'en_progreso')}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] cursor-pointer"
                        >
                          Pasar a &ldquo;En Progreso&rdquo; →
                        </button>
                      )}

                      {req.status === 'en_progreso' && (
                        <button
                          type="button"
                          onClick={() => onUpdateRequestStatus(req.id, 'finalizada')}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] cursor-pointer"
                        >
                          ✓ Marcar como Finalizado
                        </button>
                      )}

                      {req.status === 'finalizada' && (
                        <div className="p-2.5 rounded-xl bg-[#DBF6FF] text-[#0F172A] text-xs font-extrabold text-center">
                          ✓ Orden Cerrada con Éxito
                        </div>
                      )}
                    </div>
                  ) : (
                    /* CLIENT ACTIONS */
                    <div className="space-y-2">
                      {req.status === 'nueva' && (
                        <div className="p-2.5 rounded-xl bg-[#DBF6FF] text-[#0F172A] text-xs font-bold text-center">
                          Esperando cotización del especialista...
                        </div>
                      )}

                      {req.status === 'cotizada' && (
                        <button
                          type="button"
                          onClick={() => onUpdateRequestStatus(req.id, 'en_progreso')}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] cursor-pointer"
                        >
                          Aceptar Cotización (${req.quotedAmountMXN?.toLocaleString('es-MX')})
                        </button>
                      )}

                      {req.status === 'en_progreso' && (
                        <button
                          type="button"
                          onClick={() => onUpdateRequestStatus(req.id, 'finalizada')}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#0F172A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#FF2E3A] cursor-pointer"
                        >
                          Confirmar Trabajo Terminado
                        </button>
                      )}

                      {req.status === 'finalizada' && !req.reviewed && (
                        <button
                          type="button"
                          onClick={() => setReviewingRequestId(req.id)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] cursor-pointer"
                        >
                          ★ Emitir Reseña Verificada
                        </button>
                      )}

                      {req.status === 'finalizada' && req.reviewed && (
                        <div className="p-2.5 rounded-xl bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold text-center">
                          ★ Reseña Verificada Publicada
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Quote Drawer (For Specialist) */}
              {isQuotingThis && (
                <div className="mt-4 pt-4 border-t border-[#E2E8F0] bg-[#DBF6FF]/60 p-5 rounded-2xl space-y-4">
                  <h4 className="font-display font-extrabold text-sm text-[#0F172A]">
                    Emitir Cotización Formal OficioLink para {req.clientName}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase text-[#0F172A] mb-1">
                        Monto Total Cotizado (MXN)
                      </label>
                      <input
                        type="number"
                        value={quoteAmountInput}
                        onChange={(e) => setQuoteAmountInput(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-sm font-extrabold text-[#FF2E3A]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-extrabold uppercase text-[#0F172A] mb-1">
                        Alcance Técnico, Materiales y Garantía
                      </label>
                      <input
                        type="text"
                        value={quoteNotesInput}
                        onChange={(e) => setQuoteNotesInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setQuotingRequestId(null)}
                      className="px-4 py-2 rounded-xl bg-white text-xs font-bold text-[#475569] cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendQuote(req.id)}
                      className="px-5 py-2 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold cursor-pointer"
                    >
                      Enviar Presupuesto al Cliente
                    </button>
                  </div>
                </div>
              )}

              {/* Expandable Verified Review Drawer (For Client) */}
              {isReviewingThis && (
                <div className="mt-4 pt-4 border-t border-[#E2E8F0] bg-[#DBF6FF] p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-extrabold text-sm text-[#0F172A]">
                      Evaluar Servicio Concluido (Folio #{req.folio}) — Se publicará en el CV Visual de{' '}
                      {req.specialistName}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Puntualidad', val: revPunctuality, set: setRevPunctuality },
                      { label: 'Calidad Técnica', val: revQuality, set: setRevQuality },
                      { label: 'Limpieza y Orden', val: revCleanliness, set: setRevCleanliness },
                      { label: 'Precio Justo', val: revFairPrice, set: setRevFairPrice },
                    ].map((m) => (
                      <div key={m.label} className="bg-white p-3 rounded-xl border border-[#E2E8F0]">
                        <div className="flex justify-between text-xs font-extrabold text-[#0F172A] mb-1">
                          <span>{m.label}</span>
                          <span className="text-[#FF2E3A]">{m.val} ★</span>
                        </div>
                        <input
                          type="range"
                          min={3}
                          max={5}
                          step={0.5}
                          value={m.val}
                          onChange={(e) => m.set(Number(e.target.value))}
                          className="w-full accent-[#FF2E3A]"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-[#0F172A] mb-1">
                      Tu Comentario Verificado
                    </label>
                    <input
                      type="text"
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A]"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewingRequestId(null)}
                      className="px-4 py-2 rounded-xl bg-white text-xs font-bold text-[#475569] cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmitClientReview(req)}
                      className="px-5 py-2.5 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold cursor-pointer"
                    >
                      Publicar Reseña Verificada
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
