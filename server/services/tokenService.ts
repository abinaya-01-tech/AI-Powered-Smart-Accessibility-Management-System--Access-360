import crypto from 'crypto';
import { dbService, WheelchairTokenRecord, AccessLogRecord } from './firebase.js';

// Unambiguous, high-contrast characters (avoid 0, O, 1, I, L)
const TOKEN_CHARACTERS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/**
 * Generates a cryptographically secure, anonymous Wheelchair Access Token
 * Format: WAT-XXXX-XXXX-XXXX
 */
export function generateSecureWheelchairToken(userId: string): WheelchairTokenRecord {
  const segment = (length: number) => {
    const bytes = crypto.randomBytes(length);
    let str = '';
    for (let i = 0; i < length; i++) {
      const idx = bytes[i] % TOKEN_CHARACTERS.length;
      str += TOKEN_CHARACTERS[idx];
    }
    return str;
  };

  const tokenId = `WAT-${segment(4)}-${segment(4)}-${segment(4)}`;
  const now = new Date();
  // Valid for 1 year
  const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();

  // If user has existing active tokens, mark them superseded/replaced
  const existingActive = dbService.getTokenByUserId(userId);
  if (existingActive) {
    dbService.updateToken(existingActive.tokenId, {
      status: 'REVOKED',
      revokedAt: now.toISOString()
    });
  }

  const tokenRecord: WheelchairTokenRecord = {
    tokenId,
    userId,
    status: 'ACTIVE',
    createdAt: now.toISOString(),
    expiresAt
  };

  dbService.createToken(tokenRecord);
  dbService.updateUser(userId, { tokenId });

  return tokenRecord;
}

export interface VerificationResult {
  valid: boolean;
  tokenId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'NOT_FOUND' | 'USED';
  accessAuthorized: boolean;
  message: string;
  checkedAt: string;
  accessLog?: AccessLogRecord;
}

/**
 * Anonymous verification of a Wheelchair Access Token
 * Checks Firestore, status, and expiry without exposing personal info
 */
export function verifyWheelchairToken(
  rawToken: string,
  facilityId = "FAC-DEFAULT",
  location = "Accessible Entrance Portal",
  accessType = "Accessibility Verification & Gateway Access",
  recordLog = true
): VerificationResult {
  const cleanToken = (rawToken || '').trim().toUpperCase();
  const checkedAt = new Date().toISOString();

  if (!cleanToken) {
    return {
      valid: false,
      tokenId: '',
      status: 'NOT_FOUND',
      accessAuthorized: false,
      message: 'No token provided for verification.',
      checkedAt
    };
  }

  const token = dbService.getToken(cleanToken);

  if (!token) {
    return {
      valid: false,
      tokenId: cleanToken,
      status: 'NOT_FOUND',
      accessAuthorized: false,
      message: '✗ TOKEN INVALID: Token does not exist in registry.',
      checkedAt
    };
  }

  // Check expiration
  if (token.expiresAt && new Date(token.expiresAt).getTime() < Date.now()) {
    if (token.status !== 'EXPIRED') {
      dbService.updateToken(token.tokenId, { status: 'EXPIRED' });
    }
    return {
      valid: false,
      tokenId: token.tokenId,
      status: 'EXPIRED',
      accessAuthorized: false,
      message: '✗ TOKEN EXPIRED: Validity period has lapsed.',
      checkedAt
    };
  }

  // Check revocation
  if (token.status === 'REVOKED') {
    return {
      valid: false,
      tokenId: token.tokenId,
      status: 'REVOKED',
      accessAuthorized: false,
      message: '✗ TOKEN REVOKED: Token has been revoked by user or administrator.',
      checkedAt
    };
  }

  if (token.status !== 'ACTIVE') {
    return {
      valid: false,
      tokenId: token.tokenId,
      status: token.status,
      accessAuthorized: false,
      message: `✗ TOKEN INACTIVE: Current status is ${token.status}.`,
      checkedAt
    };
  }

  // Valid active token
  let accessLog: AccessLogRecord | undefined;
  if (recordLog) {
    accessLog = dbService.createAccessLog({
      id: `LOG-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
      tokenId: token.tokenId,
      facilityId,
      location,
      accessType,
      status: 'VERIFIED',
      timestamp: checkedAt
    });
  }

  return {
    valid: true,
    tokenId: token.tokenId,
    status: 'ACTIVE',
    accessAuthorized: true,
    message: '✓ TOKEN VERIFIED — Wheelchair Accessibility Access: AUTHORIZED',
    checkedAt,
    accessLog
  };
}

/**
 * Revoke a token
 */
export function revokeWheelchairToken(tokenId: string): boolean {
  const token = dbService.getToken(tokenId);
  if (!token) return false;
  dbService.updateToken(tokenId, {
    status: 'REVOKED',
    revokedAt: new Date().toISOString()
  });
  return true;
}
