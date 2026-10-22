import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Wrench,
  Camera,
  CheckCircle2,
  Upload,
  ScanFace,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileBadge,
  Eye,
  MapPin,
} from 'lucide-react';
import {
  Specialist,
  TradeCategory,
  TradeCategoryId,
} from '../types/oficiolink';

interface OnboardingViewProps {
  categories: TradeCategory[];
  onCompleteOnboarding: (newSpecialist: Specialist) => void;
  onExploreAsClient: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  categories,
  onCompleteOnboarding,
  onExploreAsClient,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [role, setRole] = useState<'especialista' | 'cliente'>('especialista');

  // Step 1 fields
  const [fullName, setFullName] = useState('Mtro. Alejandro Morales Vega');
  const [phone, setPhone] = useState('55 6129 8430');
  const [city, setCity] = useState('CDMX');
  const [yearsExp, setYearsExp] = useState(10);

  // Step 2 fields
  const [primaryTrade, setPrimaryTrade] = useState<TradeCategoryId>('electricidad');
  const [headline, setHeadline] = useState(
    'Especialista en Instalaciones Eléctricas Residenciales, Tierra Física e Iluminación Arquitectónica'
  );
  const [bio, setBio] = useState(
    'Técnico comprometido con instalaciones limpias, seguras y normadas. Presupuestos desglosados por escrito y garantía de 12 meses en mano de obra.'
  );
  const [diagnosticFee, setDiagnosticFee] = useState(450);
  const [zonesInput, setZonesInput] = useState('Benito Juárez, Coyoacán, Miguel Hidalgo');
  const [emergency247, setEmergency247] = useState(true);

  // Step 3 fields (Identity Verification)
  const [ineFrontUploaded, setIneFrontUploaded] = useState(true);
  const [ineBackUploaded, setIneBackUploaded] = useState(true);
  const [selfieValidated, setSelfieValidated] = useState(true);
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);

  // Step 4 fields (First Visual Portfolio Project)
  const [projectTitle, setProjectTitle] = useState(
    'Renovación de Tablero Eléctrico Residencial y Supresor de Picos'
  );
  const [projectCost, setProjectCost] = useState(4200);
  const [projectDuration, setProjectDuration] = useState('1 día (6 horas)');
  const [projectDesc, setProjectDesc] = useState(
    'Se reemplazó centro de carga antiguo con falso contacto por tablero Square D QO de 8 circuitos peinado y rotulado.'
  );
  const [beforeImgUrl, setBeforeImgUrl] = useState(
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80'
  );
  const [afterImgUrl, setAfterImgUrl] = useState(
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80'
  );

  const progressPercentage = (step / 4) * 100;
  const allIdentityVerified = ineFrontUploaded && ineBackUploaded && selfieValidated;

  const triggerBiometricSimulation = () => {
    setIsScanningBiometric(true);
    setTimeout(() => {
      setIsScanningBiometric(false);
      setSelfieValidated(true);
    }, 900);
  };

  const handleFinishWizard = () => {
    const selectedCategory =
      categories.find((c) => c.id === primaryTrade) || categories[0];

    const newSpec: Specialist = {
      id: `esp-custom-${Date.now()}`,
      name: fullName || 'Especialista Verificado OficioLink',
      headline: headline,
      primaryTrade: primaryTrade,
      primaryTradeLabel: selectedCategory.shortName,
      secondaryTrades: selectedCategory.popularTags,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      coverImage: afterImgUrl,
      verified: allIdentityVerified,
      verificationDetails: {
        ineVerified: ineFrontUploaded && ineBackUploaded,
        biometricSelfie: selfieValidated,
        addressVerified: true,
        backgroundCheck: true,
        verifiedSince: 'Octubre 2026',
        badgeCode: `OL-MX-${primaryTrade.slice(0, 4).toUpperCase()}-9901`,
      },
      city,
      coverageZones: zonesInput.split(',').map((s) => s.trim()),
      yearsExperience: yearsExp,
      completedJobs: 1,
      responseTime: '5 min promedio',
      emergency247,
      baseDiagnosticFeeMXN: diagnosticFee,
      hourlyOrProjectRangeMXN: `$${diagnosticFee} - $6,500 MXN`,
      rating: 5.0,
      reviewsCount: 1,
      ratingBreakdown: {
        punctuality: 5.0,
        quality: 5.0,
        cleanliness: 5.0,
        fairPrice: 5.0,
      },
      bio,
      certifications: [
        'Identidad y Biometría Verificada en OficioLink',
        `Especialista Certificado en ${selectedCategory.name}`,
      ],
      toolsAndWarranty: [
        'Garantía por escrito en todos los servicios',
        'Cotización transparente previa al trabajo',
      ],
      portfolio: [
        {
          id: `proj-custom-${Date.now()}`,
          title: projectTitle,
          category: selectedCategory.shortName,
          location: `${zonesInput.split(',')[0]}, ${city}`,
          completedDate: 'Octubre 2026',
          duration: projectDuration,
          approxCostMXN: projectCost,
          description: projectDesc,
          technicalChallenge:
            'Instalación previa deteriorada y fuera de norma que representaba riesgo para el inmueble.',
          solutionApplied: projectDesc,
          materialsUsed: selectedCategory.popularTags.slice(0, 3),
          beforeImage: beforeImgUrl,
          afterImage: afterImgUrl,
          galleryImages: [afterImgUrl],
        },
      ],
      reviews: [
        {
          id: `rev-custom-1`,
          clientName: 'Verificación Inicial OficioLink',
          clientAvatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          clientZone: city,
          serviceTitle: projectTitle,
          date: 'Recién verificado',
          verifiedServiceId: 'OL-ONB-2026',
          overallRating: 5.0,
          metrics: { punctuality: 5, quality: 5, cleanliness: 5, fairPrice: 5 },
          comment:
            'Portafolio técnico e identidad biométrica validados satisfactoriamente en el sistema OficioLink.',
        },
      ],
    };

    onCompleteOnboarding(newSpec);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#DBF6FF] p-6 sm:p-8 border border-[#0F172A]/10 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Onboarding & Confianza Digital
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0F172A] mt-2">
              Registro y Verificación de Identidad OficioLink
            </h1>
            <p className="text-sm text-[#475569] mt-1 font-medium">
              Completa los 4 pasos para obtener tu insignia de <strong className="text-[#FF2E3A]">Especialista Verificado</strong> y publicar tu CV Visual.
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2E8F0] min-w-[260px]">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#0F172A] mb-2">
              <span>Progreso de Verificación</span>
              <span className="text-[#FF2E3A]">Paso {step} de 4 ({progressPercentage}%)</span>
            </div>
            {/* Progress Bar in Machine Red (#FF2E3A) */}
            <div className="w-full h-3 rounded-full bg-[#DBF6FF] overflow-hidden">
              <div
                className="h-full bg-[#FF2E3A] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-1 mt-2.5 text-[10px] font-bold text-center">
              {[
                { s: 1, label: '1. Rol/Datos' },
                { s: 2, label: '2. Oficio' },
                { s: 3, label: '3. INE/Selfie' },
                { s: 4, label: '4. Portafolio' },
              ].map((item) => (
                <button
                  key={item.s}
                  type="button"
                  onClick={() => setStep(item.s as 1 | 2 | 3 | 4)}
                  className={`py-1 rounded-md transition-colors cursor-pointer ${
                    step === item.s
                      ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                      : step > item.s
                      ? 'bg-[#DBF6FF] text-[#0F172A]'
                      : 'text-[#475569]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Left Wizard Form (7 cols) + Right Live Badge & CV Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: WIZARD STEPS */}
        <div className="lg:col-span-7 rounded-3xl bg-[#FFFFFF] border-2 border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
          {/* STEP 1: ROLE & BASIC DATA */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#FF2E3A]">
                  Paso 1 de 4 • Identificación Inicial
                </span>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] mt-1">
                  Selecciona tu Rol y Datos Básicos
                </h2>
              </div>

              {/* Role Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('especialista')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    role === 'especialista'
                      ? 'bg-[#DBF6FF] border-[#FF2E3A] shadow-md'
                      : 'bg-[#F7FCFF] border-[#E2E8F0] hover:border-[#0F172A]/30'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] flex items-center justify-center mb-3">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-extrabold text-base text-[#0F172A]">
                    Soy Especialista de Oficio
                  </h3>
                  <p className="text-xs text-[#475569] mt-1">
                    Quiero crear mi CV Visual, verificar mi identidad y recibir clientes directos.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('cliente')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    role === 'cliente'
                      ? 'bg-[#DBF6FF] border-[#FF2E3A] shadow-md'
                      : 'bg-[#F7FCFF] border-[#E2E8F0] hover:border-[#0F172A]/30'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-[#DBF6FF] flex items-center justify-center mb-3">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-extrabold text-base text-[#0F172A]">
                    Soy Cliente / Busco Contratar
                  </h3>
                  <p className="text-xs text-[#475569] mt-1">
                    Necesito encontrar un especialista verificado y cotizar una reparación o proyecto.
                  </p>
                </button>
              </div>

              {role === 'cliente' ? (
                <div className="p-6 rounded-2xl bg-[#DBF6FF] border border-[#FF2E3A]/30 space-y-4">
                  <h4 className="font-display font-extrabold text-lg text-[#0F172A]">
                    ¡Como cliente puedes explorar y cotizar de inmediato!
                  </h4>
                  <p className="text-xs text-[#475569]">
                    No necesitas esperar: explora el directorio de especialistas con INE verificado o envía una solicitud de servicio ahora mismo.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={onExploreAsClient}
                      className="px-5 py-3 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs cursor-pointer"
                    >
                      Ir al Explorador de Especialistas →
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('especialista')}
                      className="px-4 py-3 rounded-xl bg-[#FFFFFF] text-[#0F172A] font-bold text-xs border border-[#E2E8F0] cursor-pointer"
                    >
                      Continuar viendo demo de Especialista
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                      Nombre Completo (Como aparece en tu INE)
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#FF2E3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                      Teléfono / WhatsApp de Contacto
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#FF2E3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                      Ciudad Principal de Operación
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#FF2E3A]"
                    >
                      <option value="CDMX">CDMX</option>
                      <option value="Monterrey">Monterrey</option>
                      <option value="Guadalajara">Guadalajara</option>
                      <option value="Querétaro">Querétaro</option>
                      <option value="Puebla">Puebla</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                      Años de Experiencia en el Oficio: <span className="text-[#FF2E3A]">{yearsExp} años</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={35}
                      value={yearsExp}
                      onChange={(e) => setYearsExp(Number(e.target.value))}
                      className="w-full accent-[#FF2E3A] cursor-pointer"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-sm hover:bg-[#E0212D] transition-all cursor-pointer"
                >
                  <span>Siguiente: Perfil Técnico</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TECHNICAL PROFILE */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#FF2E3A]">
                  Paso 2 de 4 • Especialización Técnica
                </span>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] mt-1">
                  Configura tu Oficio, Cobertura y Tarifas
                </h2>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-[#475569] mb-2">
                  Selecciona tu Oficio Principal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPrimaryTrade(cat.id)}
                      className={`p-3 rounded-xl border text-xs font-extrabold transition-all text-left cursor-pointer ${
                        primaryTrade === cat.id
                          ? 'bg-[#FF2E3A] text-[#DBF6FF] border-[#FF2E3A]'
                          : 'bg-[#F7FCFF] text-[#0F172A] border-[#E2E8F0] hover:bg-[#DBF6FF]'
                      }`}
                    >
                      {cat.shortName}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                  Titular Profesional de Alto Impacto
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#FF2E3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                  Descripción de tu Metodología y Garantía
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2E3A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                    Alcaldías / Colonias de Cobertura
                  </label>
                  <input
                    type="text"
                    value={zonesInput}
                    onChange={(e) => setZonesInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                    Tarifa Visita / Diagnóstico (MXN)
                  </label>
                  <input
                    type="number"
                    value={diagnosticFee}
                    onChange={(e) => setDiagnosticFee(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#FF2E3A]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#DBF6FF] flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-[#0F172A]">
                    ¿Atiendes Emergencias 24/7?
                  </p>
                  <p className="text-[11px] text-[#475569]">
                    Destaca tu perfil para clientes con urgencias el mismo día.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmergency247(!emergency247)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                    emergency247
                      ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                      : 'bg-white text-[#475569]'
                  }`}
                >
                  {emergency247 ? 'Sí, Activo 24/7' : 'Horario Normal'}
                </button>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F7FCFF] text-[#0F172A] font-bold text-xs border border-[#E2E8F0] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-sm hover:bg-[#E0212D] transition-all cursor-pointer"
                >
                  <span>Siguiente: Verificación INE + Selfie</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: IDENTITY VERIFICATION (PILAR 1: CONFIANZA DIGITAL) */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold uppercase">
                  Paso 3 de 4 • Pilar de Confianza Digital
                </span>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] mt-2">
                  Validación de Identidad Oficial y Biometría
                </h2>
                <p className="text-xs text-[#475569] mt-1">
                  Sube tu identificación oficial vigente (INE/IFE) por ambos lados y realiza la validación facial para activar tu insignia verificada.
                </p>
              </div>

              {/* Front & Back ID Upload Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setIneFrontUploaded(!ineFrontUploaded)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    ineFrontUploaded
                      ? 'bg-[#DBF6FF]/70 border-[#FF2E3A]'
                      : 'bg-[#F7FCFF] border-dashed border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase text-[#0F172A]">
                      1. INE / Identificación (Frente)
                    </span>
                    {ineFrontUploaded ? (
                      <span className="px-2 py-0.5 rounded bg-[#FF2E3A] text-[#DBF6FF] text-[10px] font-extrabold">
                        Validado OCR
                      </span>
                    ) : (
                      <Upload className="w-4 h-4 text-[#475569]" />
                    )}
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] text-xs space-y-1">
                    <p className="font-bold text-[#0F172A]">{fullName}</p>
                    <p className="text-[11px] text-[#475569]">Clave Elector: MRLV880412HDFR09</p>
                    <p className="text-[10px] font-extrabold text-[#FF2E3A]">
                      ✓ Fotografía y Holograma Legibles
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setIneBackUploaded(!ineBackUploaded)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    ineBackUploaded
                      ? 'bg-[#DBF6FF]/70 border-[#FF2E3A]'
                      : 'bg-[#F7FCFF] border-dashed border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase text-[#0F172A]">
                      2. INE / Identificación (Reverso)
                    </span>
                    {ineBackUploaded ? (
                      <span className="px-2 py-0.5 rounded bg-[#FF2E3A] text-[#DBF6FF] text-[10px] font-extrabold">
                        Código QR Leído
                      </span>
                    ) : (
                      <Upload className="w-4 h-4 text-[#475569]" />
                    )}
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] text-xs space-y-1">
                    <p className="font-bold text-[#0F172A]">CIC: 1948204192831</p>
                    <p className="text-[11px] text-[#475569]">Vigencia: 2024 - 2034 (Vigente)</p>
                    <p className="text-[10px] font-extrabold text-[#FF2E3A]">
                      ✓ Firma y Código MRZ Verificados
                    </p>
                  </div>
                </div>
              </div>

              {/* Biometric Selfie Validator */}
              <div className="rounded-2xl bg-[#0F172A] text-white p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF2E3A] text-[#DBF6FF] flex items-center justify-center shrink-0">
                      <ScanFace className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#DBF6FF] text-[#FF2E3A] text-[10px] font-extrabold uppercase">
                        Paso Biométrico Anti-Suplantación
                      </span>
                      <h3 className="font-display font-extrabold text-base text-white mt-1">
                        3. Selfie de Validación Facial en Vivo
                      </h3>
                      <p className="text-xs text-[#DBF6FF]/80">
                        Comparamos los rasgos biométricos de tu selfie con la fotografía de tu INE.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={triggerBiometricSimulation}
                    className="px-4 py-2.5 rounded-xl bg-[#DBF6FF] text-[#FF2E3A] font-extrabold text-xs hover:bg-white transition-colors shrink-0 cursor-pointer"
                  >
                    {isScanningBiometric
                      ? 'Escaneando Rostro...'
                      : selfieValidated
                      ? 'Re-escanear Biometría'
                      : 'Iniciar Escaneo Facial'}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#DBF6FF]">
                    Coincidencia Facial INE vs. Selfie en Vivo:
                  </span>
                  <span className="font-extrabold text-[#DBF6FF] bg-[#FF2E3A] px-3 py-1 rounded-lg">
                    {isScanningBiometric ? 'Procesando...' : '99.4% Match Confirmado ✓'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F7FCFF] text-[#0F172A] font-bold text-xs border border-[#E2E8F0] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-sm hover:bg-[#E0212D] transition-all cursor-pointer"
                >
                  <span>Siguiente: Subir Primer Proyecto</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: UPLOAD FIRST VISUAL PORTFOLIO PROJECT */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold uppercase">
                  Paso 4 de 4 • Tu CV Visual
                </span>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] mt-2">
                  Carga tu Primer Proyecto (&ldquo;Antes y Después&rdquo;)
                </h2>
                <p className="text-xs text-[#475569] mt-1">
                  Los especialistas con al menos un trabajo documentado reciben 4 veces más solicitudes de cotización.
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                  Título del Trabajo Realizado
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                    Costo Aproximado del Proyecto (MXN)
                  </label>
                  <input
                    type="number"
                    value={projectCost}
                    onChange={(e) => setProjectCost(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#FF2E3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                    Duración de Ejecución
                  </label>
                  <input
                    type="text"
                    value={projectDuration}
                    onChange={(e) => setProjectDuration(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1.5">
                  Descripción Técnica de la Solución
                </label>
                <textarea
                  rows={2}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-medium text-[#0F172A]"
                />
              </div>

              {/* Before / After Image Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold uppercase text-[#FF2E3A]">
                    Foto del ANTES (Problema)
                  </label>
                  <img
                    src={beforeImgUrl}
                    alt="Antes"
                    className="w-full h-36 object-cover rounded-2xl border border-[#E2E8F0]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold uppercase text-[#0F172A]">
                    Foto del DESPUÉS (Resultado Final)
                  </label>
                  <img
                    src={afterImgUrl}
                    alt="Después"
                    className="w-full h-36 object-cover rounded-2xl border-2 border-[#FF2E3A]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F7FCFF] text-[#0F172A] font-bold text-xs border border-[#E2E8F0] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinishWizard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-sm hover:bg-[#E0212D] transition-all shadow-lg shadow-[#FF2E3A]/30 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Activar Insignia y Publicar Mi CV Visual</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE VERIFICATION CREDENTIAL & CV PREVIEW */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="rounded-3xl bg-[#DBF6FF] p-6 border-2 border-[#FF2E3A]/30 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF2E3A]">
                Vista Previa en Tiempo Real
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {allIdentityVerified ? 'Identidad Verificada' : 'Verificación en Proceso'}
              </span>
            </div>

            {/* Credential Card */}
            <div className="rounded-2xl bg-[#FFFFFF] p-5 border border-[#E2E8F0] space-y-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                  alt={fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FF2E3A]"
                />
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DBF6FF] text-[#FF2E3A] text-[11px] font-extrabold">
                    {categories.find((c) => c.id === primaryTrade)?.shortName || 'Especialista'}
                  </span>
                  <h3 className="font-display font-extrabold text-base text-[#0F172A] mt-1">
                    {fullName}
                  </h3>
                  <p className="text-xs text-[#475569] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF2E3A]" />
                    {city} • {yearsExp} años exp.
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#475569] font-medium line-clamp-2">{headline}</p>

              {/* Verification Checklist Status */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0] text-center">
                <div
                  className={`p-2 rounded-xl text-[11px] font-extrabold ${
                    ineFrontUploaded
                      ? 'bg-[#DBF6FF] text-[#FF2E3A]'
                      : 'bg-[#F7FCFF] text-[#475569]'
                  }`}
                >
                  INE Frente ✓
                </div>
                <div
                  className={`p-2 rounded-xl text-[11px] font-extrabold ${
                    ineBackUploaded
                      ? 'bg-[#DBF6FF] text-[#FF2E3A]'
                      : 'bg-[#F7FCFF] text-[#475569]'
                  }`}
                >
                  INE Vuelta ✓
                </div>
                <div
                  className={`p-2 rounded-xl text-[11px] font-extrabold ${
                    selfieValidated
                      ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                      : 'bg-[#F7FCFF] text-[#475569]'
                  }`}
                >
                  Biometría ✓
                </div>
              </div>

              {/* First Portfolio Preview */}
              <div className="rounded-xl bg-[#F7FCFF] p-3 border border-[#E2E8F0]">
                <p className="text-[10px] font-extrabold uppercase text-[#FF2E3A] mb-1">
                  Proyecto Inicial en Portafolio:
                </p>
                <p className="text-xs font-bold text-[#0F172A] line-clamp-1">{projectTitle}</p>
                <p className="text-[11px] text-[#475569] mt-0.5">
                  Ref: ${projectCost.toLocaleString('es-MX')} MXN • {projectDuration}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
