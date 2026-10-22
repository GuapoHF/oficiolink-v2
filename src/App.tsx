import React, { useState } from 'react';
import {
  AppView,
  Specialist,
  TradeCategoryId,
  ServiceRequest,
  ServiceRequestStatus,
  PortfolioProject,
  VerifiedReview,
} from './types/oficiolink';
import {
  TRADE_CATEGORIES,
  INITIAL_SPECIALISTS,
  INITIAL_SERVICE_REQUESTS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ServiceRequestModal } from './components/ServiceRequestModal';
import { LandingView } from './views/LandingView';
import { ExplorerView } from './views/ExplorerView';
import { ProfileView } from './views/ProfileView';
import { OnboardingView } from './views/OnboardingView';
import { DashboardView } from './views/DashboardView';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [specialists, setSpecialists] = useState<Specialist[]>(INITIAL_SPECIALISTS);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist>(
    INITIAL_SPECIALISTS[0]
  );
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(
    INITIAL_SERVICE_REQUESTS
  );

  // Explorer initial filter state passed from Landing Page
  const [explorerTrade, setExplorerTrade] = useState<TradeCategoryId>('todos');
  const [explorerCity, setExplorerCity] = useState<string>('Todas');
  const [explorerQuery, setExplorerQuery] = useState<string>('');

  // Service Request Modal state
  const [requestModalOpen, setRequestModalOpen] = useState<boolean>(false);
  const [modalTargetSpecialist, setModalTargetSpecialist] = useState<Specialist | null>(
    null
  );

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleExploreWithFilters = (
    trade: TradeCategoryId,
    city: string,
    query: string
  ) => {
    setExplorerTrade(trade);
    setExplorerCity(city);
    setExplorerQuery(query);
    setCurrentView('explorer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSpecialist = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRequestForSpecialist = (specialist: Specialist) => {
    setModalTargetSpecialist(specialist);
    setRequestModalOpen(true);
  };

  const handleOpenQuickRequest = () => {
    setModalTargetSpecialist(null);
    setRequestModalOpen(true);
  };

  const handleCreateServiceRequest = (newRequest: ServiceRequest) => {
    setServiceRequests((prev) => [newRequest, ...prev]);
    setRequestModalOpen(false);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerToast(
      `Solicitud #${newRequest.folio} enviada a ${newRequest.specialistName}. Puedes darle seguimiento en el Dashboard.`
    );
  };

  const handleUpdateRequestStatus = (
    requestId: string,
    newStatus: ServiceRequestStatus,
    quotedAmount?: number,
    quoteNotes?: string
  ) => {
    setServiceRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: newStatus,
              quotedAmountMXN: quotedAmount ?? req.quotedAmountMXN,
              quoteNotes: quoteNotes ?? req.quoteNotes,
            }
          : req
      )
    );
    triggerToast(`Estado de la solicitud actualizado a: ${newStatus.toUpperCase()}`);
  };

  const handleAddPortfolioProject = (
    specialistId: string,
    project: PortfolioProject
  ) => {
    setSpecialists((prev) =>
      prev.map((sp) =>
        sp.id === specialistId
          ? { ...sp, portfolio: [project, ...sp.portfolio] }
          : sp
      )
    );
    if (selectedSpecialist.id === specialistId) {
      setSelectedSpecialist((prev) => ({
        ...prev,
        portfolio: [project, ...prev.portfolio],
      }));
    }
    triggerToast('Nuevo proyecto "Antes y Después" añadido al Portafolio Visual.');
  };

  const handleAddVerifiedReview = (
    specialistId: string,
    requestId: string,
    review: VerifiedReview
  ) => {
    setServiceRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, reviewed: true } : r))
    );

    setSpecialists((prev) =>
      prev.map((sp) => {
        if (sp.id !== specialistId) return sp;
        const updatedReviews = [review, ...sp.reviews];
        return {
          ...sp,
          reviewsCount: sp.reviewsCount + 1,
          completedJobs: sp.completedJobs + 1,
          reviews: updatedReviews,
        };
      })
    );

    if (selectedSpecialist.id === specialistId) {
      setSelectedSpecialist((prev) => ({
        ...prev,
        reviewsCount: prev.reviewsCount + 1,
        completedJobs: prev.completedJobs + 1,
        reviews: [review, ...prev.reviews],
      }));
    }

    triggerToast(
      `¡Reseña Verificada publicada con éxito! Se ha sumado a la reputación del especialista.`
    );
  };

  const handleCompleteOnboarding = (newSpecialist: Specialist) => {
    setSpecialists((prev) => [newSpecialist, ...prev]);
    setSelectedSpecialist(newSpecialist);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerToast(
      `¡Felicidades ${newSpecialist.name}! Tu Insignia de Identidad Verificada y CV Visual ya están activos.`
    );
  };

  const pendingCount = serviceRequests.filter(
    (r) => r.status === 'nueva' || r.status === 'cotizada'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0F172A]">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-[#0F172A] text-[#DBF6FF] px-5 py-4 rounded-2xl shadow-2xl border-2 border-[#FF2E3A] flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-xl bg-[#FF2E3A] text-[#DBF6FF] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold leading-snug">{toastMessage}</p>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        pendingRequestsCount={pendingCount}
        onOpenQuickRequest={handleOpenQuickRequest}
      />

      {/* Main Active Screen */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            categories={TRADE_CATEGORIES}
            specialists={specialists}
            onExploreWithFilters={handleExploreWithFilters}
            onSelectSpecialist={handleSelectSpecialist}
            onRequestService={handleOpenRequestForSpecialist}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'explorer' && (
          <ExplorerView
            categories={TRADE_CATEGORIES}
            specialists={specialists}
            initialTrade={explorerTrade}
            initialCity={explorerCity}
            initialQuery={explorerQuery}
            onSelectSpecialist={handleSelectSpecialist}
            onRequestService={handleOpenRequestForSpecialist}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            specialist={selectedSpecialist}
            allSpecialists={specialists}
            onSelectSpecialist={handleSelectSpecialist}
            onRequestService={handleOpenRequestForSpecialist}
            onBackToExplorer={() => setCurrentView('explorer')}
          />
        )}

        {currentView === 'onboarding' && (
          <OnboardingView
            categories={TRADE_CATEGORIES}
            onCompleteOnboarding={handleCompleteOnboarding}
            onExploreAsClient={() => setCurrentView('explorer')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            requests={serviceRequests}
            specialists={specialists}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onAddPortfolioProject={handleAddPortfolioProject}
            onAddVerifiedReview={handleAddVerifiedReview}
            onOpenNewRequestModal={handleOpenQuickRequest}
            onViewSpecialistProfile={handleSelectSpecialist}
          />
        )}
      </main>

      {/* Service Request Modal */}
      <ServiceRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        selectedSpecialist={modalTargetSpecialist}
        allSpecialists={specialists}
        onSubmitRequest={handleCreateServiceRequest}
      />

      {/* Footer */}
      <Footer onNavigate={setCurrentView} />
    </div>
  );
}
export default App;
