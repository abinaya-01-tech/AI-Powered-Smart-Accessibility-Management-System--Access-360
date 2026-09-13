export type UserRole = 'wheelchair_user' | 'inspector' | 'admin';

export interface User {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  tokenId?: string;
  accessibilityNeeds?: string[];
}

export type TokenStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'USED';

export interface WheelchairToken {
  tokenId: string;
  userId: string;
  status: TokenStatus;
  createdAt: string;
  expiresAt: string;
  revokedAt?: string;
}

export interface AccessLog {
  id: string;
  tokenId: string;
  facilityId: string;
  location: string;
  accessType: string;
  status: 'VERIFIED' | 'DENIED' | 'FLAGGED';
  timestamp: string;
  reportId?: string;
}

export type AccessibilityClass = 'ramp' | 'stairs' | 'handrail' | 'accessible_toilet_sign' | 'lift';

export interface DetectionItem {
  class: AccessibilityClass;
  confidence: number;
  box?: number[];
}

export type AccessibilityCategory = 'Highly Accessible' | 'Accessible' | 'Partially Accessible' | 'Poor Accessibility';

export interface AccessibilityReport {
  id: string;
  locationId: string;
  locationName: string;
  score: number;
  category: AccessibilityCategory;
  detections: DetectionItem[];
  recommendations: string[];
  issues: string[];
  imageUrl: string;
  annotatedImageUrl: string;
  inspectorId: string;
  inspectorName: string;
  isDemoMode: boolean;
  modelStatus: string;
  createdAt: string;
  status: 'VERIFIED' | 'PENDING' | 'FLAGGED';
}

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  accessibilityScore: number;
  accessibilityCategory: AccessibilityCategory;
  features: {
    ramp: boolean;
    lift: boolean;
    handrail: boolean;
    accessibleToilet: boolean;
    stairs: boolean;
  };
  wheelchairAccessStatus: 'FULLY_ACCESSIBLE' | 'ASSISTED_ACCESS_ONLY' | 'LIMITED' | 'INACCESSIBLE';
  lastVerificationDate: string;
  reportsCount: number;
}

export interface VerificationResponse {
  valid: boolean;
  tokenId: string;
  status: TokenStatus | 'NOT_FOUND';
  accessAuthorized: boolean;
  message: string;
  checkedAt: string;
  accessLog?: AccessLog;
}

export interface AdminStatistics {
  summary: {
    totalLocations: number;
    highlyAccessible: number;
    accessible: number;
    partiallyAccessible: number;
    poorAccessibility: number;
    totalReports: number;
    verifiedAccessEvents: number;
    activeTokens: number;
  };
  charts: {
    scoreBuckets: { range: string; count: number; fill: string }[];
    categoryDistribution: { name: string; value: number; color: string }[];
    featureCompliance: { feature: string; count: number; percentage: number }[];
    accessTimeline: { day: string; events: number; authorized: number }[];
  };
  problematicLocations: LocationItem[];
}
