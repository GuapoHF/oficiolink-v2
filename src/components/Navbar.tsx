import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  UserCheck,
  Briefcase,
  LayoutDashboard,
  Menu,
  X,
  Wrench,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { AppView } from '../types/oficiolink';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  pendingRequestsCount: number;
  onOpenQuickRequest: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  pendingRequestsCount,
  onOpenQuickRequest,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'landing', label: 'Inicio', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'explorer', label: 'Explorar Especialistas', icon: <Search className="w-4 h-4" /> },
    { id: 'profile', label: 'CV Visual', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'onboarding', label: 'Verificación / Registro', icon: <UserCheck className="w-4 h-4" /> },
    {
      id: 'dashboard',
      label: 'Dashboard & Solicitudes',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: pendingRequestsCount,
    },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FF2E3A] flex items-center justify-center shadow-md shadow-[#FF2E3A]/25 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 text-[#DBF6FF] -rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-2xl tracking-tight text-[#0F172A]">
                  Oficio<span className="text-[#FF2E3A]">Link</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DBF6FF] text-[#FF2E3A] border border-[#FF2E3A]/20">
                  <ShieldCheck className="w-3 h-3" />
                  MX
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#475569] hidden sm:block">
                Red Profesional de Especialistas Verificados
              </p>
            </div>
          </button>

          {/* Desktop Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#F7FCFF] p-1.5 rounded-2xl border border-[#E2E8F0]">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF2E3A] text-[#DBF6FF] shadow-sm shadow-[#FF2E3A]/30'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#DBF6FF]/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded-full font-extrabold ${
                        isActive
                          ? 'bg-[#DBF6FF] text-[#FF2E3A]'
                          : 'bg-[#FF2E3A] text-[#DBF6FF]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={onOpenQuickRequest}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#DBF6FF] text-[#0F172A] hover:bg-[#FF2E3A] hover:text-[#DBF6FF] transition-colors border border-[#0F172A]/10 cursor-pointer"
            >
              Cotizar Trabajo
            </button>
            <button
              onClick={() => handleNavClick('onboarding')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FF2E3A] text-[#DBF6FF] hover:bg-[#E0212D] transition-all shadow-md shadow-[#FF2E3A]/20 cursor-pointer"
            >
              <span>Únete como Especialista</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="relative p-2.5 rounded-xl bg-[#DBF6FF] text-[#FF2E3A] font-bold text-xs"
              aria-label="Solicitudes"
            >
              <LayoutDashboard className="w-5 h-5" />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF2E3A] text-[#DBF6FF] text-[10px] font-extrabold flex items-center justify-center">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F7FCFF]"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#FF2E3A] text-[#DBF6FF]'
                    : 'bg-[#F7FCFF] text-[#0F172A] hover:bg-[#DBF6FF]'
                }`}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-extrabold ${
                      isActive ? 'bg-[#DBF6FF] text-[#FF2E3A]' : 'bg-[#FF2E3A] text-[#DBF6FF]'
                    }`}
                  >
                    {item.badge} activas
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-3 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuickRequest();
              }}
              className="w-full py-3 rounded-xl text-xs font-bold bg-[#DBF6FF] text-[#FF2E3A] border border-[#FF2E3A]/20"
            >
              Solicitar Servicio
            </button>
            <button
              onClick={() => handleNavClick('onboarding')}
              className="w-full py-3 rounded-xl text-xs font-bold bg-[#FF2E3A] text-[#DBF6FF]"
            >
              Únete como Especialista
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
