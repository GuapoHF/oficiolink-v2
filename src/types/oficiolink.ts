export type TradeCategoryId =
  | 'todos'
  | 'electricidad'
  | 'plomeria'
  | 'carpinteria'
  | 'herreria'
  | 'climatizacion'
  | 'pintura'
  | 'albanileria'
  | 'cerrajeria';

export interface TradeCategory {
  id: TradeCategoryId;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  specialistsCount: number;
  avgRateMXN: string;
  popularTags: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  location: string;
  completedDate: string;
  duration: string;
  approxCostMXN: number;
  description: string;
  technicalChallenge: string;
  solutionApplied: string;
  materialsUsed: string[];
  beforeImage: string;
  afterImage: string;
  galleryImages: string[];
  clientQuote?: {
    clientName: string;
    comment: string;
    rating: number;
  };
}

export interface VerifiedReview {
  id: string;
  clientName: string;
  clientAvatar: string;
  clientZone: string;
  serviceTitle: string;
  date: string;
  verifiedServiceId: string;
  overallRating: number;
  metrics: {
    punctuality: number;
    quality: number;
    cleanliness: number;
    fairPrice: number;
  };
  comment: string;
  projectPhoto?: string;
}

export interface Specialist {
  id: string;
  name: string;
  headline: string;
  primaryTrade: TradeCategoryId;
  primaryTradeLabel: string;
  secondaryTrades: string[];
  avatar: string;
  coverImage: string;
  verified: boolean;
  verificationDetails: {
    ineVerified: boolean;
    biometricSelfie: boolean;
    addressVerified: boolean;
    backgroundCheck: boolean;
    verifiedSince: string;
    badgeCode: string;
  };
  city: string;
  coverageZones: string[];
  yearsExperience: number;
  completedJobs: number;
  responseTime: string;
  emergency247: boolean;
  baseDiagnosticFeeMXN: number;
  hourlyOrProjectRangeMXN: string;
  rating: number;
  reviewsCount: number;
  ratingBreakdown: {
    punctuality: number;
    quality: number;
    cleanliness: number;
    fairPrice: number;
  };
  bio: string;
  certifications: string[];
  toolsAndWarranty: string[];
  portfolio: PortfolioProject[];
  reviews: VerifiedReview[];
}

export type ServiceRequestStatus =
  | 'nueva'
  | 'cotizada'
  | 'en_progreso'
  | 'finalizada';

export type UrgencyLevel = 'emergencia_hoy' | 'proximos_dias' | 'programado';

export interface ServiceRequest {
  id: string;
  folio: string;
  specialistId: string;
  specialistName: string;
  specialistTrade: string;
  specialistAvatar: string;
  clientName: string;
  clientPhone: string;
  clientZone: string;
  problemTitle: string;
  problemDescription: string;
  urgency: UrgencyLevel;
  suggestedDate: string;
  estimatedBudgetMXN: number;
  quotedAmountMXN?: number;
  quoteNotes?: string;
  warrantyDays?: number;
  status: ServiceRequestStatus;
  createdAt: string;
  issuePhotos: string[];
  reviewed?: boolean;
}

export type AppView =
  | 'landing'
  | 'explorer'
  | 'profile'
  | 'onboarding'
  | 'dashboard';
