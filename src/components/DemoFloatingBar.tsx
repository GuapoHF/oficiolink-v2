import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Wrench,
  UserCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { AppView } from '../types/oficiolink';

export type QuickDemoModeId =
  | 'public_visitor'
  | 'client_session'
  | 'specialist_session'
  | 'onboarding_wizard'
  | 'security_lab';

interface DemoFloatingBarProps {
  activeDemoMode: QuickDemoModeId;
  currentView: AppView;
  specialistsCount: number;
  requestsCount: number;
  onSelectDemoMode: (mode: QuickDemoModeId) => void;
  onResetSeed: () => void;
}

export const DemoFloatingBar: React.FC<DemoFloatingBarProps> = ({
  activeDemoMode,
  specialistsCount,
  requestsCount,
  onSelectDemoMode,
  onResetSeed,
}) => {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0F172A] text-[#DBF6FF] border-2 border-[#FF2E3A] shadow-xl text-xs font-extrabold hover:bg-[#FF2E3A] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#FF2E3A] group-hover:text-[#DBF6FF]" />
          <span>Selector Modo Demo</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 inset-x-4 z-40 pointer-events-none flex justify-center">
      <div className="pointer-events-auto max-w-5xl w-full rounded-2xl bg-[#0F172A]/95 backdrop-blur-md text-white border-2 border-[#FF2E3A] shadow-2xl px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left Badge & DB Status */}
          <div className="flex items-center justify-between lg:justify-start gap-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#FF2E3A] text-[#DBF6FF] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Modo Demo Interactivo
              </span>
              <span className="text-[11px] font-semibold text-[#DBF6FF] hidden sm:inline">
                DB Híbrida Activa ({specialistsCount} Especialistas • {requestsCount} Solicitudes • 20/20 Controles)
              </span>
            </div>

            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                type="button"
                onClick={onResetSeed}
                className="p-1.5 rounded-lg bg-white/10 text-[#DBF6FF] hover:bg-[#FF2E3A] text-[10px] font-bold cursor-pointer"
                title="Restablecer datos semilla"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setMinimized(true)}
                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                title="Minimizar barra demo"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Main Demo Mode Buttons + Security Lab */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelectDemoMode('public_visitor')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                activeDemoMode === 'public_visitor'
                  ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-md'
                  : 'bg-white/10 text-[#DBF6FF] hover:bg-white/20'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>1. Vista Pública (Visitante)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDemoMode('client_session')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                activeDemoMode === 'client_session'
                  ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-md'
                  : 'bg-white/10 text-[#DBF6FF] hover:bg-white/20'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2. Sesión de Cliente (Solicitudes)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDemoMode('specialist_session')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                activeDemoMode === 'specialist_session'
                  ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-md'
                  : 'bg-white/10 text-[#DBF6FF] hover:bg-white/20'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>3. Sesión Especialista Verificado</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDemoMode('onboarding_wizard')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                activeDemoMode === 'onboarding_wizard'
                  ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-md'
                  : 'bg-white/10 text-[#DBF6FF] hover:bg-white/20'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>4. Onboarding & Verificación INE</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDemoMode('security_lab')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                activeDemoMode === 'security_lab'
                  ? 'bg-[#DBF6FF] text-[#FF2E3A] shadow-md'
                  : 'bg-[#DBF6FF]/15 text-[#DBF6FF] hover:bg-[#DBF6FF] hover:text-[#0F172A]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>20 Controles AppSec</span>
            </button>
          </div>

          {/* Right Controls (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              type="button"
              onClick={onResetSeed}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 text-[#DBF6FF] hover:bg-[#FF2E3A] text-[10px] font-bold transition-colors cursor-pointer"
              title="Restaurar los 8 especialistas y solicitudes iniciales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset DB</span>
            </button>
            <button
              type="button"
              onClick={() => setMinimized(true)}
              className="p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Minimizar barra demo"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
