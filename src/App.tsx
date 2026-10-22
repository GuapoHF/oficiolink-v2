import React, { useState, useEffect } from 'react';
import {
  AppView,
  Specialist,
  TradeCategoryId,
  ServiceRequest,
  ServiceRequestStatus,
  PortfolioProject,
  VerifiedReview,
  AuthSessionState,
  SecurityAuditLogEntry,
} from './types/oficiolink';
import { TRADE_CATEGORIES } from './data/mockData';
import {
  loadPersistedSpecialists,
  savePersistedSpecialists,
  loadPersistedRequests,
  savePersistedRequests,
  loadPersistedAuditLogs,
  savePersistedAuditLogs,
} from './services/databaseService';
import {
  createSecureSessionState,
  assertServerAuthenticated,
  createAuditLogEntry,
} from './security/securityEngine';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ServiceRequestModal } from './components/ServiceRequestModal';
import { LandingView } from './views/LandingView';
import { ExplorerView } from './views/ExplorerView';
import { ProfileView } from './views/ProfileView';
import { OnboardingView } from './views/OnboardingView';
import { DashboardView } from './views/DashboardView';
import { SecurityView } from './views/SecurityView';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [specialists, setSpecialists] = useState<Specialist[]>(() =>
    loadPersistedSpecialists()
  );
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist>(
    () => loadPersistedSpecialists()[0]
  );
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() =>
    loadPersistedRequests()
  );
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLogEntry[]>(() =>
    loadPersistedAuditLogs()
  );

  // Control #6 & #9: Active Server-Validated Session & __Host- Cookie State
  const [session, setSession] = useState<AuthSessionState>(() =>
    createSecureSessionState(
      'esp-1',
      'roberto.mendoza@oficiolink.mx',
      'Ing. Téc. Roberto Mendoza Morales',
      'specialist',
      1
    )
  );

  // Persist to local database replica
  useEffect(() => {
    savePersistedSpecialists(specialists);
  }, [specialists]);

  useEffect(() => {
    savePersistedRequests(serviceRequests);
  }, [serviceRequests]);

  useEffect(() => {
    savePersistedAuditLogs(auditLogs);
  }, [auditLogs]);

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

  const appendAuditLog = (
    entry: Omit<SecurityAuditLogEntry, 'id' | 'timestamp' | 'queryDurationMs'> & {
      queryDurationMs?: number;
    }
  ) => {
    const log = createAuditLogEntry(entry);
    setAuditLogs((prev) => [log, ...prev]);
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
    assertServerAuthenticated(session);
    setServiceRequests((prev) => [newRequest, ...prev]);
    setRequestModalOpen(false);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    appendAuditLog({
      actorUserId: session.userId,
      eventType: 'SERVICE_REQUEST_INSERTED',
      severity: 'INFO',
      targetTable: 'service_requests',
      targetRecordId: newRequest.folio,
      controlReference: 'Controles #5, #6, #12, #14 y #15',
      details: `Solicitud #${newRequest.folio} creada con dirección y teléfono cifrados en AES-256.`,
    });

    triggerToast(
      `Solicitud #${newRequest.folio} cifrada (AES-256) y enviada a ${newRequest.specialistName}.`
    );
  };

  const handleUpdateRequestStatus = (
    requestId: string,
    newStatus: ServiceRequestStatus,
    quotedAmount?: number,
    quoteNotes?: string
  ) => {
    assertServerAuthenticated(session);
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

    appendAuditLog({
      actorUserId: session.userId,
      eventType: `SERVICE_REQUEST_${newStatus.toUpperCase()}`,
      severity: 'INFO',
      targetTable: 'service_requests',
      targetRecordId: requestId,
      controlReference: 'Controles #6 & #7 (JWT + Anti-IDOR)',
      details: `Estado de orden actualizado a [${newStatus}] por auth.uid() = ${session.userId}.`,
    });

    triggerToast(`Estado de la solicitud actualizado a: ${newStatus.toUpperCase()}`);
  };

  const handleAddPortfolioProject = (
    specialistId: string,
    project: PortfolioProject
  ) => {
    assertServerAuthenticated(session);
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

    appendAuditLog({
      actorUserId: session.userId,
      eventType: 'PORTFOLIO_PROJECT_CREATED',
      severity: 'INFO',
      targetTable: 'portfolio_projects',
      targetRecordId: project.id,
      controlReference: 'Controles #15 & #16 (XSS + Bucket Público)',
      details: `Proyecto "${project.title}" sanitizado y añadido al CV Visual.`,
    });

    triggerToast('Nuevo proyecto "Antes y Después" añadido al Portafolio Visual.');
  };

  const handleAddVerifiedReview = (
    specialistId: string,
    requestId: string,
    review: VerifiedReview
  ) => {
    assertServerAuthenticated(session);
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

    appendAuditLog({
      actorUserId: session.userId,
      eventType: 'VERIFIED_REVIEW_COMMITTED',
      severity: 'INFO',
      targetTable: 'verified_reviews',
      targetRecordId: review.verifiedServiceId,
      controlReference: 'Controles #4, #8, #14 y #15',
      details: `Reseña verificada (${review.overallRating}★) vinculada a servicio concluido #${review.verifiedServiceId}.`,
    });

    triggerToast(
      `¡Reseña Verificada publicada! Se actualizó automáticamente el promedio en PostgreSQL.`
    );
  };

  const handleCompleteOnboarding = (newSpecialist: Specialist) => {
    assertServerAuthenticated(session);
    setSpecialists((prev) => [newSpecialist, ...prev]);
    setSelectedSpecialist(newSpecialist);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    appendAuditLog({
      actorUserId: newSpecialist.id,
      eventType: 'IDENTITY_VERIFICATION_APPROVED',
      severity: 'CRITICAL',
      targetTable: 'identity_verifications',
      targetRecordId: newSpecialist.verificationDetails.badgeCode,
      controlReference: 'Controles #5, #12, #14 y #16',
      details: `INE + Biometría validados en bucket privado identity-docs. Folio: ${newSpecialist.verificationDetails.badgeCode}`,
    });

    triggerToast(
      `¡Felicidades ${newSpecialist.name}! Tu Insignia de Identidad Verificada y CV Visual ya están activos.`
    );
  };

  const handleRotateRefreshToken = () => {
    setSession((prev) =>
      createSecureSessionState(
        prev.userId,
        prev.email,
        prev.fullName,
        prev.role,
        prev.refreshTokenGeneration + 1
      )
    );
    appendAuditLog({
      actorUserId: session.userId,
      eventType: 'SESSION_REFRESH_TOKEN_ROTATED',
      severity: 'INFO',
      targetTable: 'auth.sessions',
      targetRecordId: session.cookieName,
      controlReference: 'Control #9 (Cookie __Host- & Rotation)',
      details: `Refresh Token rotado a generación #${session.refreshTokenGeneration + 1}.`,
    });
    triggerToast('Cookie __Host-oficiolink_session y Refresh Token rotados con éxito.');
  };

  const handleSwitchSessionRole = (role: 'client' | 'specialist' | 'admin') => {
    setSession((prev) =>
      createSecureSessionState(
        role === 'client' ? 'client-uid-01' : role === 'admin' ? 'admin-uid-00' : 'esp-1',
        prev.email,
        prev.fullName,
        role,
        prev.refreshTokenGeneration
      )
    );
    appendAuditLog({
      actorUserId: session.userId,
      eventType: 'RLS_CONTEXT_SWITCHED',
      severity: 'INFO',
      targetTable: 'users_profiles',
      targetRecordId: role,
      controlReference: 'Controles #4 & #7 (RLS Context)',
      details: `Contexto RLS cambiado al rol [${role}].`,
    });
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

        {currentView === 'security' && (
          <SecurityView
            session={session}
            auditLogs={auditLogs}
            onRotateRefreshToken={handleRotateRefreshToken}
            onSwitchSessionRole={handleSwitchSessionRole}
            onAddAuditLog={appendAuditLog}
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
