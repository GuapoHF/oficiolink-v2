import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Calendar,
  Send,
  Lock,
  AlertCircle,
} from 'lucide-react';
import {
  Specialist,
  ServiceRequest,
  UrgencyLevel,
} from '../types/oficiolink';
import { ServiceRequestInputSchema } from '../security/validationSchemas';
import { encryptPIIAes256, maskPhonePII } from '../security/cryptoVault';
import { verifyAntiBotProtection } from '../security/securityEngine';
import { BotProtectionWidget } from './BotProtectionWidget';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSpecialist: Specialist | null;
  allSpecialists: Specialist[];
  onSubmitRequest: (newRequest: ServiceRequest) => void;
}

const SAMPLE_ISSUE_PHOTOS = [
  {
    label: 'Tablero / Corto Eléctrico',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Fuga / Tubería Hidráulica',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Carpintería / Remodelación',
    url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=600&q=80',
  },
];

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  selectedSpecialist,
  allSpecialists,
  onSubmitRequest,
}) => {
  const [specialistId, setSpecialistId] = useState<string>(
    selectedSpecialist?.id || allSpecialists[0]?.id || 'esp-1'
  );
  const [clientName, setClientName] = useState('Ing. Carlos Alberto Méndez');
  const [clientPhone, setClientPhone] = useState('55 4190 8273');
  const [clientZone, setClientZone] = useState('Col. Del Valle Centro, Benito Juárez, CDMX');
  const [problemTitle, setProblemTitle] = useState(
    'Revisión de variación de voltaje y cambio de centro de carga'
  );
  const [problemDescription, setProblemDescription] = useState(
    'Notamos que baja la intensidad de las luces cuando arranca el refrigerador y una pastilla zumba ligeramente.'
  );
  const [urgency, setUrgency] = useState<UrgencyLevel>('proximos_dias');
  const [suggestedDate, setSuggestedDate] = useState('Mañana a las 11:00 AM');
  const [estimatedBudget, setEstimatedBudget] = useState<number>(2800);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(SAMPLE_ISSUE_PHOTOS[0].url);

  // Control #12: Bot Protection State
  const [honeypotValue, setHoneypotValue] = useState<string>('');
  const [isTurnstileVerified, setIsTurnstileVerified] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetSpec =
    allSpecialists.find((s) => s.id === (selectedSpecialist?.id || specialistId)) ||
    allSpecialists[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Control #12: Verificar Protección Anti-Bots (Turnstile + Honeypot)
    const botCheck = verifyAntiBotProtection(honeypotValue, isTurnstileVerified);
    if (!botCheck.passed) {
      setValidationError(botCheck.error || 'Fallo en validación anti-bots.');
      return;
    }

    // 2. Control #14 y #15: Validar esquema estricto con Zod + Sanitizar XSS con DOMPurify
    const parsed = ServiceRequestInputSchema.safeParse({
      specialistId: targetSpec.id,
      clientName,
      clientPhone,
      clientZone,
      problemTitle,
      problemDescription,
      urgency,
      suggestedDate,
      estimatedBudgetMXN: Number(estimatedBudget),
      issuePhotos: [selectedPhotoUrl],
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setValidationError(`Validación Zod (Control #14): ${firstIssue.message}`);
      return;
    }

    const clean = parsed.data;

    // 3. Control #5: Cifrar PII sensible (teléfono directo y dirección) con AES-256-GCM
    const encryptedPhone = await encryptPIIAes256(clean.clientPhone);
    const encryptedAddress = await encryptPIIAes256(clean.clientZone);

    const newReq: ServiceRequest = {
      id: `req-${Date.now()}`,
      folio: `OL-2026-${Math.floor(9100 + Math.random() * 899)}`,
      clientId: 'client-auth-uid-01',
      specialistId: targetSpec.id,
      specialistName: targetSpec.name,
      specialistTrade: targetSpec.primaryTradeLabel,
      specialistAvatar: targetSpec.avatar,
      clientName: clean.clientName,
      clientPhone: maskPhonePII(clean.clientPhone),
      clientPhoneEncrypted: encryptedPhone,
      clientZone: clean.clientZone,
      addressEncrypted: encryptedAddress,
      problemTitle: clean.problemTitle,
      problemDescription: clean.problemDescription,
      urgency: clean.urgency,
      suggestedDate: clean.suggestedDate,
      estimatedBudgetMXN: clean.estimatedBudgetMXN,
      status: 'nueva',
      createdAt: 'Hace unos segundos',
      issuePhotos: clean.issuePhotos,
    };

    onSubmitRequest(newReq);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-2xl w-full border-2 border-[#E2E8F0] overflow-hidden shadow-2xl my-8">
        {/* Header in Glacier Blue (#DBF6FF) */}
        <div className="bg-[#DBF6FF] px-6 py-5 flex items-center justify-between border-b border-[#0F172A]/10">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-[11px] font-extrabold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Solicitud Protegida (AES-256 PII + Zod + Anti-XSS)
            </span>
            <h2 className="font-display font-extrabold text-xl text-[#0F172A] mt-1">
              Solicitar Servicio / Cotización Formal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FFFFFF] text-[#0F172A] hover:bg-[#FF2E3A] hover:text-[#DBF6FF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[82vh] overflow-y-auto">
          {validationError && (
            <div className="p-3.5 rounded-2xl bg-[#FF2E3A] text-[#DBF6FF] text-xs font-extrabold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Selected Specialist Card */}
          <div className="p-4 rounded-2xl bg-[#F7FCFF] border border-[#E2E8F0] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={targetSpec.avatar}
                alt={targetSpec.name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-[#FF2E3A]"
              />
              <div>
                <span className="px-2 py-0.5 rounded-md bg-[#DBF6FF] text-[#FF2E3A] text-[10px] font-extrabold uppercase">
                  {targetSpec.primaryTradeLabel}
                </span>
                <h3 className="font-display font-extrabold text-sm text-[#0F172A] mt-0.5">
                  {targetSpec.name}
                </h3>
                <p className="text-xs text-[#475569]">
                  Visita diagnóstico:{' '}
                  <strong className="text-[#FF2E3A]">${targetSpec.baseDiagnosticFeeMXN} MXN</strong>
                </p>
              </div>
            </div>

            {!selectedSpecialist && (
              <select
                value={specialistId}
                onChange={(e) => setSpecialistId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A]"
              >
                {allSpecialists.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name.split(' ').slice(0, 3).join(' ')} ({sp.primaryTradeLabel})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Problem Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1">
                ¿Qué problema o proyecto necesitas resolver?
              </label>
              <input
                type="text"
                required
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#FF2E3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1">
                Descripción detallada (Sanitizada automáticamente con DOMPurify Control #15)
              </label>
              <textarea
                rows={3}
                required
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2E3A]"
              />
            </div>
          </div>

          {/* Urgency Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-[#475569] mb-2">
              Nivel de Urgencia del Servicio
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'emergencia_hoy' as UrgencyLevel,
                  label: 'Emergencia Hoy',
                  sub: 'Atención inmediata',
                },
                {
                  id: 'proximos_dias' as UrgencyLevel,
                  label: 'Próximos 2-3 Días',
                  sub: 'Revisión prioritaria',
                },
                {
                  id: 'programado' as UrgencyLevel,
                  label: 'Proyecto Programado',
                  sub: 'Fecha flexible',
                },
              ].map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUrgency(u.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    urgency === u.id
                      ? 'bg-[#FF2E3A] text-[#DBF6FF] border-[#FF2E3A]'
                      : 'bg-[#F7FCFF] text-[#0F172A] border-[#E2E8F0] hover:bg-[#DBF6FF]'
                  }`}
                >
                  <p className="text-xs font-extrabold">{u.label}</p>
                  <p
                    className={`text-[10px] ${
                      urgency === u.id ? 'text-[#DBF6FF]/90' : 'text-[#475569]'
                    }`}
                  >
                    {u.sub}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Date, Budget & Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1">
                Fecha y Horario Sugerido
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0]">
                <Calendar className="w-4 h-4 text-[#FF2E3A]" />
                <input
                  type="text"
                  value={suggestedDate}
                  onChange={(e) => setSuggestedDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-[#0F172A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1">
                Presupuesto Estimado (MXN)
              </label>
              <input
                type="number"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-xs font-extrabold text-[#FF2E3A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1">
                Tu Nombre
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-xs font-bold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1">
                Teléfono (Cifrado AES-256 Control #5)
              </label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-xs font-bold text-[#0F172A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold uppercase text-[#475569] mb-1 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#FF2E3A]" />
                <span>Dirección / Colonia (Se cifra con AES-256 en `service_requests`)</span>
              </label>
              <input
                type="text"
                value={clientZone}
                onChange={(e) => setClientZone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFF] border border-[#E2E8F0] text-xs font-bold text-[#0F172A]"
              />
            </div>
          </div>

          {/* Issue Photo Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-[#475569] mb-2">
              Evidencia Fotográfica del Desperfecto
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SAMPLE_ISSUE_PHOTOS.map((photo) => {
                const active = selectedPhotoUrl === photo.url;
                return (
                  <button
                    key={photo.label}
                    type="button"
                    onClick={() => setSelectedPhotoUrl(photo.url)}
                    className={`rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                      active ? 'border-[#FF2E3A] ring-2 ring-[#FF2E3A]/30' : 'border-[#E2E8F0]'
                    }`}
                  >
                    <img src={photo.url} alt={photo.label} className="w-full h-20 object-cover" />
                    <p className="p-1.5 text-[10px] font-bold text-[#0F172A] truncate bg-[#F7FCFF]">
                      {photo.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Control #12: Bot Protection Widget */}
          <BotProtectionWidget
            honeypotValue={honeypotValue}
            onHoneypotChange={setHoneypotValue}
            isVerified={isTurnstileVerified}
            onVerifyChange={setIsTurnstileVerified}
          />

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-[#F7FCFF] text-[#475569] font-bold text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] transition-all shadow-lg shadow-[#FF2E3A]/25 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Cifrar PII y Enviar Solicitud</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
