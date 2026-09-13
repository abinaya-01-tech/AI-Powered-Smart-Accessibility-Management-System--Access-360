import crypto from 'crypto';

export interface WheelchairTokenRecord {
  tokenId: string;
  userId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'USED';
  createdAt: string;
  expiresAt: string;
  revokedAt?: string;
}

export interface UserRecord {
  userId: string;
  email: string;
  name: string;
  role: 'wheelchair_user' | 'inspector' | 'admin';
  createdAt: string;
  tokenId?: string;
  accessibilityNeeds?: string[];
}

export interface AccessLogRecord {
  id: string;
  tokenId: string;
  facilityId: string;
  location: string;
  accessType: string;
  status: 'VERIFIED' | 'DENIED' | 'FLAGGED';
  timestamp: string;
  reportId?: string;
}

export interface DetectionItem {
  class: 'ramp' | 'stairs' | 'handrail' | 'accessible_toilet_sign' | 'lift';
  confidence: number;
  box?: number[];
}

export interface AccessibilityReportRecord {
  id: string;
  locationId: string;
  locationName: string;
  score: number;
  category: 'Highly Accessible' | 'Accessible' | 'Partially Accessible' | 'Poor Accessibility';
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

export interface LocationRecord {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  accessibilityScore: number;
  accessibilityCategory: 'Highly Accessible' | 'Accessible' | 'Partially Accessible' | 'Poor Accessibility';
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

// Initial robust seed database
const SEED_LOCATIONS: LocationRecord[] = [
  {
    id: "LOC-001",
    name: "Central University Library",
    address: "100 Academic Way, Campus Quad",
    latitude: 37.7749,
    longitude: -122.4194,
    accessibilityScore: 92,
    accessibilityCategory: "Highly Accessible",
    features: {
      ramp: true,
      lift: true,
      handrail: true,
      accessibleToilet: true,
      stairs: false
    },
    wheelchairAccessStatus: "FULLY_ACCESSIBLE",
    lastVerificationDate: "2026-09-10T14:30:00Z",
    reportsCount: 4
  },
  {
    id: "LOC-002",
    name: "Administrative & Student Services Center",
    address: "220 Chancellor Plaza",
    latitude: 37.7785,
    longitude: -122.4150,
    accessibilityScore: 76,
    accessibilityCategory: "Accessible",
    features: {
      ramp: true,
      lift: false,
      handrail: true,
      accessibleToilet: true,
      stairs: true
    },
    wheelchairAccessStatus: "FULLY_ACCESSIBLE",
    lastVerificationDate: "2026-09-08T11:15:00Z",
    reportsCount: 3
  },
  {
    id: "LOC-003",
    name: "Engineering & Innovation Complex",
    address: "550 Tech Drive",
    latitude: 37.7710,
    longitude: -122.4230,
    accessibilityScore: 88,
    accessibilityCategory: "Highly Accessible",
    features: {
      ramp: true,
      lift: true,
      handrail: true,
      accessibleToilet: true,
      stairs: false
    },
    wheelchairAccessStatus: "FULLY_ACCESSIBLE",
    lastVerificationDate: "2026-09-12T09:45:00Z",
    reportsCount: 5
  },
  {
    id: "LOC-004",
    name: "Old Arts & Humanities Hall",
    address: "12 Heritage Lane",
    latitude: 37.7760,
    longitude: -122.4270,
    accessibilityScore: 35,
    accessibilityCategory: "Poor Accessibility",
    features: {
      ramp: false,
      lift: false,
      handrail: true,
      accessibleToilet: false,
      stairs: true
    },
    wheelchairAccessStatus: "INACCESSIBLE",
    lastVerificationDate: "2026-09-05T16:00:00Z",
    reportsCount: 2
  },
  {
    id: "LOC-005",
    name: "Campus Recreation & Aquatic Pavilion",
    address: "400 Sports Boulevard",
    latitude: 37.7800,
    longitude: -122.4200,
    accessibilityScore: 58,
    accessibilityCategory: "Partially Accessible",
    features: {
      ramp: true,
      lift: false,
      handrail: true,
      accessibleToilet: true,
      stairs: true
    },
    wheelchairAccessStatus: "ASSISTED_ACCESS_ONLY",
    lastVerificationDate: "2026-09-02T13:20:00Z",
    reportsCount: 2
  },
  {
    id: "LOC-006",
    name: "Civic Metro Transit Hub",
    address: "800 Transit Boulevard",
    latitude: 37.7790,
    longitude: -122.4130,
    accessibilityScore: 85,
    accessibilityCategory: "Highly Accessible",
    features: {
      ramp: true,
      lift: true,
      handrail: true,
      accessibleToilet: true,
      stairs: true
    },
    wheelchairAccessStatus: "FULLY_ACCESSIBLE",
    lastVerificationDate: "2026-09-11T10:00:00Z",
    reportsCount: 6
  }
];

const SEED_USERS: UserRecord[] = [
  {
    userId: "USER-WHEELCHAIR-01",
    email: "wheelchair.user@college.edu",
    name: "Alex Rivera",
    role: "wheelchair_user",
    createdAt: "2026-08-15T08:00:00Z",
    tokenId: "WAT-7X92-KL8P-QM41",
    accessibilityNeeds: ["Manual/Power Wheelchair Access", "Zero-Step Entrance", "Accessible Restroom"]
  },
  {
    userId: "USER-INSPECTOR-01",
    email: "inspector@gov.city.gov",
    name: "Sarah Chen (Accessibility Inspector #14)",
    role: "inspector",
    createdAt: "2026-08-10T09:00:00Z"
  },
  {
    userId: "USER-ADMIN-01",
    email: "admin@gov.city.gov",
    name: "Director Marcus Vance (Infrastructure Admin)",
    role: "admin",
    createdAt: "2026-08-01T08:00:00Z"
  }
];

const SEED_TOKENS: WheelchairTokenRecord[] = [
  {
    tokenId: "WAT-7X92-KL8P-QM41",
    userId: "USER-WHEELCHAIR-01",
    status: "ACTIVE",
    createdAt: "2026-08-15T08:00:00Z",
    expiresAt: "2027-08-15T08:00:00Z"
  },
  {
    tokenId: "WAT-4K99-M8P2-ZV71",
    userId: "USER-DEMO-EXPIRED",
    status: "EXPIRED",
    createdAt: "2025-01-01T00:00:00Z",
    expiresAt: "2026-01-01T00:00:00Z"
  },
  {
    tokenId: "WAT-8B33-N1W9-TR64",
    userId: "USER-DEMO-REVOKED",
    status: "REVOKED",
    createdAt: "2026-05-10T00:00:00Z",
    expiresAt: "2027-05-10T00:00:00Z",
    revokedAt: "2026-06-01T12:00:00Z"
  }
];

const SEED_ACCESS_LOGS: AccessLogRecord[] = [
  {
    id: "LOG-1001",
    tokenId: "WAT-7X92-KL8P-QM41",
    facilityId: "LOC-001",
    location: "Central University Library - North Automated Accessible Door",
    accessType: "Automated Power Door Release",
    status: "VERIFIED",
    timestamp: "2026-09-13T06:45:12Z"
  },
  {
    id: "LOG-1002",
    tokenId: "WAT-7X92-KL8P-QM41",
    facilityId: "LOC-003",
    location: "Engineering Complex - South Ramp Gate",
    accessType: "Platform Lift & Turnstile Bypass",
    status: "VERIFIED",
    timestamp: "2026-09-12T14:22:30Z"
  },
  {
    id: "LOG-1003",
    tokenId: "WAT-7X92-KL8P-QM41",
    facilityId: "LOC-006",
    location: "Civic Metro Transit Hub - Platform 1 Elevator",
    accessType: "Accessible Priority Lift Verification",
    status: "VERIFIED",
    timestamp: "2026-09-11T16:10:05Z"
  }
];

const SEED_REPORTS: AccessibilityReportRecord[] = [
  {
    id: "REP-2001",
    locationId: "LOC-001",
    locationName: "Central University Library",
    score: 92,
    category: "Highly Accessible",
    detections: [
      { class: "ramp", confidence: 0.96 },
      { class: "handrail", confidence: 0.91 },
      { class: "lift", confidence: 0.94 },
      { class: "accessible_toilet_sign", confidence: 0.89 }
    ],
    recommendations: ["Maintain regular tactile paving inspections."],
    issues: [],
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
    annotatedImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
    inspectorId: "USER-INSPECTOR-01",
    inspectorName: "Sarah Chen (Accessibility Inspector #14)",
    isDemoMode: false,
    modelStatus: "REAL AI RESULT (YOLOv8 + OpenCV)",
    createdAt: "2026-09-10T14:30:00Z",
    status: "VERIFIED"
  },
  {
    id: "REP-2002",
    locationId: "LOC-004",
    locationName: "Old Arts & Humanities Hall",
    score: 35,
    category: "Poor Accessibility",
    detections: [
      { class: "stairs", confidence: 0.95 },
      { class: "handrail", confidence: 0.82 }
    ],
    recommendations: [
      "Immediate retrofitting required: construct an exterior ramp or install an enclosed vertical platform lift.",
      "Add ADA compliant directional signage pointing to closest accessible wing."
    ],
    issues: [
      "Stairs detected: Front entry has 14 steep steps with no ground-level ramp bypass."
    ],
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
    annotatedImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
    inspectorId: "USER-INSPECTOR-01",
    inspectorName: "Sarah Chen (Accessibility Inspector #14)",
    isDemoMode: true,
    modelStatus: "DEMO MODE — AI MODEL NOT CONNECTED",
    createdAt: "2026-09-05T16:00:00Z",
    status: "FLAGGED"
  }
];

// In-Memory Database Store (with persistent mutations for session)
class InMemoryFirestoreService {
  private users = new Map<string, UserRecord>();
  private tokens = new Map<string, WheelchairTokenRecord>();
  private accessLogs: AccessLogRecord[] = [];
  private reports: AccessibilityReportRecord[] = [];
  private locations = new Map<string, LocationRecord>();

  constructor() {
    this.seed();
  }

  private seed() {
    SEED_USERS.forEach(u => this.users.set(u.userId, { ...u }));
    SEED_TOKENS.forEach(t => this.tokens.set(t.tokenId, { ...t }));
    this.accessLogs = [...SEED_ACCESS_LOGS];
    this.reports = [...SEED_REPORTS];
    SEED_LOCATIONS.forEach(l => this.locations.set(l.id, { ...l }));
  }

  // User methods
  getUser(userId: string): UserRecord | undefined {
    return this.users.get(userId);
  }

  getUserByEmail(email: string): UserRecord | undefined {
    return Array.from(this.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: UserRecord): UserRecord {
    this.users.set(user.userId, user);
    return user;
  }

  updateUser(userId: string, updates: Partial<UserRecord>): UserRecord | undefined {
    const existing = this.users.get(userId);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.users.set(userId, updated);
    return updated;
  }

  getAllUsers(): UserRecord[] {
    return Array.from(this.users.values());
  }

  // Token methods
  getToken(tokenId: string): WheelchairTokenRecord | undefined {
    return this.tokens.get(tokenId);
  }

  getTokenByUserId(userId: string): WheelchairTokenRecord | undefined {
    return Array.from(this.tokens.values()).find(t => t.userId === userId && t.status === 'ACTIVE');
  }

  createToken(token: WheelchairTokenRecord): WheelchairTokenRecord {
    this.tokens.set(token.tokenId, token);
    return token;
  }

  updateToken(tokenId: string, updates: Partial<WheelchairTokenRecord>): WheelchairTokenRecord | undefined {
    const existing = this.tokens.get(tokenId);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.tokens.set(tokenId, updated);
    return updated;
  }

  getAllTokens(): WheelchairTokenRecord[] {
    return Array.from(this.tokens.values());
  }

  // Access Log methods
  createAccessLog(log: AccessLogRecord): AccessLogRecord {
    this.accessLogs.unshift(log);
    return log;
  }

  getAccessLogs(tokenId?: string): AccessLogRecord[] {
    if (tokenId) {
      return this.accessLogs.filter(l => l.tokenId === tokenId);
    }
    return [...this.accessLogs];
  }

  // Location methods
  getLocations(): LocationRecord[] {
    return Array.from(this.locations.values());
  }

  getLocation(id: string): LocationRecord | undefined {
    return this.locations.get(id);
  }

  createOrUpdateLocation(loc: LocationRecord): LocationRecord {
    this.locations.set(loc.id, loc);
    return loc;
  }

  // Report methods
  getReports(): AccessibilityReportRecord[] {
    return [...this.reports];
  }

  getReport(id: string): AccessibilityReportRecord | undefined {
    return this.reports.find(r => r.id === id);
  }

  createReport(report: AccessibilityReportRecord): AccessibilityReportRecord {
    this.reports.unshift(report);
    // Also update associated location stats if exists
    const loc = this.locations.get(report.locationId);
    if (loc) {
      loc.accessibilityScore = report.score;
      loc.accessibilityCategory = report.category;
      loc.lastVerificationDate = report.createdAt;
      loc.reportsCount += 1;
      
      const featureSet = new Set(report.detections.map(d => d.class));
      loc.features = {
        ramp: featureSet.has("ramp") || loc.features.ramp,
        lift: featureSet.has("lift") || loc.features.lift,
        handrail: featureSet.has("handrail") || loc.features.handrail,
        accessibleToilet: featureSet.has("accessible_toilet_sign") || loc.features.accessibleToilet,
        stairs: featureSet.has("stairs")
      };
      if (report.score >= 80) loc.wheelchairAccessStatus = "FULLY_ACCESSIBLE";
      else if (report.score >= 60) loc.wheelchairAccessStatus = "FULLY_ACCESSIBLE";
      else if (report.score >= 40) loc.wheelchairAccessStatus = "ASSISTED_ACCESS_ONLY";
      else loc.wheelchairAccessStatus = "INACCESSIBLE";

      this.locations.set(loc.id, loc);
    }
    return report;
  }
}

export const dbService = new InMemoryFirestoreService();
