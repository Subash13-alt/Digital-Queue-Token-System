
export enum ServiceType {
  REVENUE = 'REVENUE',
  AADHAAR = 'AADHAAR',
  RATION = 'RATION',
  UTILITY = 'UTILITY'
}

export enum TokenStatus {
  WAITING = 'WAITING',
  SERVING = 'SERVING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  SKIPPED = 'SKIPPED'
}

export interface Token {
  id: string;
  displayId: string;
  serviceType: ServiceType;
  name?: string;
  phone?: string;
  isPriority: boolean;
  status: TokenStatus;
  timestamp: number;
  counterId?: number;
  completedAt?: number;
}

export interface Counter {
  id: number;
  name: string;
  isActive: boolean;
  currentTokenId?: string;
}

export interface DailyStats {
  totalIssued: number;
  totalServed: number;
  averageServiceTime: number; // in minutes
}

export const SERVICE_CONFIG = {
  [ServiceType.REVENUE]: { label: 'Revenue Services', prefix: 'R', avgTime: 8 },
  [ServiceType.AADHAAR]: { label: 'Aadhaar Services', prefix: 'A', avgTime: 6 },
  [ServiceType.RATION]: { label: 'Ration Card Services', prefix: 'N', avgTime: 7 },
  [ServiceType.UTILITY]: { label: 'Utility Bill Services', prefix: 'U', avgTime: 5 },
};

export const WORKING_HOURS = {
  start: 9, // 9 AM
  end: 17   // 5 PM
};
