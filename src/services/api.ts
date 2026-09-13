import {
  User,
  WheelchairToken,
  AccessLog,
  AccessibilityReport,
  LocationItem,
  VerificationResponse,
  AdminStatistics
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async register(data: { email: string; name: string; role: string; accessibilityNeeds?: string[] }): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Registration failed');
    return json;
  },

  async login(email: string): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    return json;
  },

  async getDemoUsers(): Promise<{ users: User[] }> {
    const res = await fetch(`${API_BASE}/auth/demo-users`);
    if (!res.ok) throw new Error('Failed to load demo accounts');
    return res.json();
  },

  // Wheelchair Tokens
  async generateToken(userId: string): Promise<{ token: WheelchairToken }> {
    const res = await fetch(`${API_BASE}/wheelchair/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to generate token');
    return json;
  },

  async getTokenByUserId(userId: string): Promise<{ token: WheelchairToken | null }> {
    const res = await fetch(`${API_BASE}/wheelchair/token/${userId}`);
    if (res.status === 404) return { token: null };
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch token');
    return json;
  },

  async revokeToken(tokenId: string): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE}/wheelchair/token/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Revocation failed');
    return json;
  },

  async verifyToken(token: string, facilityId?: string, location?: string, accessType?: string): Promise<VerificationResponse> {
    const res = await fetch(`${API_BASE}/wheelchair/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, facilityId, location, accessType })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Token verification failed');
    return json;
  },

  async recordAccess(data: { tokenId: string; facilityId: string; location: string; accessType: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/wheelchair/access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to record access event');
    return json;
  },

  async getAccessLogs(tokenId?: string): Promise<{ logs: AccessLog[] }> {
    const url = tokenId ? `${API_BASE}/wheelchair/history?tokenId=${encodeURIComponent(tokenId)}` : `${API_BASE}/wheelchair/history`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load access history');
    return res.json();
  },

  // Accessibility Image & Reports
  async analyzeImage(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/accessibility/analyze`, {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unable to analyze the image. Please try again.');
    return json;
  },

  async saveReport(reportData: Partial<AccessibilityReport>): Promise<{ report: AccessibilityReport }> {
    const res = await fetch(`${API_BASE}/accessibility/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to record accessibility report');
    return json;
  },

  async getReports(): Promise<{ reports: AccessibilityReport[] }> {
    const res = await fetch(`${API_BASE}/accessibility/reports`);
    if (!res.ok) throw new Error('Failed to fetch accessibility reports');
    return res.json();
  },

  async getReportById(id: string): Promise<{ report: AccessibilityReport }> {
    const res = await fetch(`${API_BASE}/accessibility/reports/${id}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Accessibility report not found');
    return json;
  },

  // Locations
  async getLocations(params?: {
    search?: string;
    category?: string;
    minScore?: number;
    ramp?: boolean;
    lift?: boolean;
    handrail?: boolean;
    accessibleToilet?: boolean;
  }): Promise<{ locations: LocationItem[] }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'ALL') query.append('category', params.category);
    if (params?.minScore !== undefined) query.append('minScore', String(params.minScore));
    if (params?.ramp) query.append('ramp', 'true');
    if (params?.lift) query.append('lift', 'true');
    if (params?.handrail) query.append('handrail', 'true');
    if (params?.accessibleToilet) query.append('accessibleToilet', 'true');

    const res = await fetch(`${API_BASE}/locations?${query.toString()}`);
    if (!res.ok) throw new Error('Unable to load accessibility locations.');
    return res.json();
  },

  async getLocationById(id: string): Promise<{ location: LocationItem; reports: AccessibilityReport[] }> {
    const res = await fetch(`${API_BASE}/locations/${id}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to load location details');
    return json;
  },

  async createLocation(data: Partial<LocationItem>): Promise<{ location: LocationItem }> {
    const res = await fetch(`${API_BASE}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create location');
    return json;
  },

  // Admin
  async getAdminStatistics(): Promise<AdminStatistics> {
    const res = await fetch(`${API_BASE}/admin/statistics`);
    if (!res.ok) throw new Error('Failed to retrieve government oversight statistics');
    return res.json();
  }
};
