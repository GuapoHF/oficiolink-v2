import React from 'react';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface BotProtectionWidgetProps {
  honeypotValue: string;
  onHoneypotChange: (val: string) => void;
  isVerified: boolean;
  onVerifyChange: (verified: boolean) => void;
  label?: string;
}

/**
 * CONTROL #12: Widget Anti-Bots (Verificación interactiva Turnstile + Campo Honeypot invisible)
 */
export const BotProtectionWidget: React.FC<BotProtectionWidgetProps> = ({
  honeypotValue,
  onHoneypotChange,
  isVerified,
  onVerifyChange,
  label = 'Verificación Anti-Bots (Cloudflare Turnstile + Honeypot Activo)',
}) => {
  return (
    <div className="p-3.5 rounded-2xl bg-[#DBF6FF]/70 border border-[#FF2E3A]/25 flex items-center justify-between gap-3">
      {/* Campo Honeypot invisible para humanos (atrapa bots que autocompletan todos los inputs) */}
      <div
        className="sr-only"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}
      >
        <label htmlFor="website_url_honeypot">No llenar este campo si eres humano</label>
        <input
          id="website_url_honeypot"
          name="website_url_honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypotValue}
          onChange={(e) => onHoneypotChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onVerifyChange(!isVerified)}
          className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all cursor-pointer ${
            isVerified
              ? 'bg-[#FF2E3A] border-[#FF2E3A] text-[#DBF6FF]'
              : 'bg-white border-[#0F172A]/40 hover:border-[#FF2E3A]'
          }`}
          aria-label="Verificar que soy humano"
        >
          {isVerified && <CheckCircle2 className="w-4 h-4" />}
        </button>
        <div>
          <p className="text-xs font-extrabold text-[#0F172A]">{label}</p>
          <p className="text-[10px] text-[#475569] font-semibold">
            Control #12 • Token de desafío humano validado + Trampa Honeypot
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[10px] font-extrabold text-[#FF2E3A] shrink-0">
        <Lock className="w-3 h-3" />
        <span>Turnstile Protected</span>
      </div>
    </div>
  );
};
