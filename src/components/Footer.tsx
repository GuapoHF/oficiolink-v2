import React from 'react';
import { Wrench, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { AppView } from '../types/oficiolink';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const go = (view: AppView) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F172A] text-white border-t border-[#E2E8F0]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FF2E3A] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#DBF6FF] -rotate-12" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                Oficio<span className="text-[#FF2E3A]">Link</span>
              </span>
            </div>
            <p className="text-xs text-[#DBF6FF]/80 max-w-sm leading-relaxed">
              La plataforma que dignifica y profesionaliza el sector técnico en México mediante perfiles de alto impacto, portafolios visuales (&ldquo;Antes y Después&rdquo;), validación de identidad (INE + Biométrico) y reseñas 100% verificadas.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#DBF6FF] text-[#FF2E3A] text-xs font-extrabold">
              <ShieldCheck className="w-4 h-4" />
              <span>Confianza Digital para Oficios Técnicos</span>
            </div>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display font-extrabold text-sm text-[#DBF6FF] uppercase tracking-wider">
              Módulos de la Plataforma
            </h4>
            <ul className="space-y-2 text-xs text-white/80 font-semibold">
              <li>
                <button onClick={() => go('landing')} className="hover:text-[#DBF6FF] cursor-pointer">
                  1. Inicio & Propuesta de Valor
                </button>
              </li>
              <li>
                <button onClick={() => go('explorer')} className="hover:text-[#DBF6FF] cursor-pointer">
                  2. Buscador y Explorador Avanzado
                </button>
              </li>
              <li>
                <button onClick={() => go('profile')} className="hover:text-[#DBF6FF] cursor-pointer">
                  3. Perfil Profesional (El &ldquo;CV Visual&rdquo;)
                </button>
              </li>
              <li>
                <button onClick={() => go('onboarding')} className="hover:text-[#DBF6FF] cursor-pointer">
                  4. Flujo de Registro y Verificación INE + Selfie
                </button>
              </li>
              <li>
                <button onClick={() => go('dashboard')} className="hover:text-[#DBF6FF] cursor-pointer">
                  5. Panel de Solicitudes y Dashboard Dual
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-extrabold text-sm text-[#DBF6FF] uppercase tracking-wider">
              ¿Eres Maestro o Técnico?
            </h4>
            <p className="text-xs text-white/75 leading-relaxed">
              Digitaliza tu reputación hoy mismo y convierte cada trabajo terminado en tu mejor carta de presentación.
            </p>
            <button
              onClick={() => go('onboarding')}
              className="w-full py-3 px-4 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] font-extrabold text-xs hover:bg-[#E0212D] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Obtener Insignia Verificada</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© 2026 OficioLink México. Dignificando el talento técnico con confianza digital.</p>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[#FF2E3A] text-[#DBF6FF] font-bold text-[11px]">
              #FF2E3A Machine Red
            </span>
            <span className="px-2.5 py-1 rounded bg-[#DBF6FF] text-[#0F172A] font-bold text-[11px]">
              #DBF6FF Glacier Blue
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
