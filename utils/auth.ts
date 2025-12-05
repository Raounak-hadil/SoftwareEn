import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production-change-this-in-production';

// Global token store - using a global variable to persist across serverless invocations
// In production, use Redis or database for better persistence
declare global {
  // eslint-disable-next-line no-var
  var tokenStore: Map<string, { user: AuthUser; expiresAt: number }> | undefined;
}

if (!global.tokenStore) {
  global.tokenStore = new Map<string, { user: AuthUser; expiresAt: number }>();
}

const tokenStore = global.tokenStore;

/**
 * Create a signed token that can be verified without server-side storage
 * Format: base64(JSON({user, expiresAt})) + '.' + HMAC_SHA256(signature)
 */
function createSignedToken(user: AuthUser, expiresAt: number): string {
  const payload = {
    email: user.email,
    id: user.id,
    role: user.role,
    exp: expiresAt,
  };
  
  const payloadStr = JSON.stringify(payload);
  const encodedPayload = Buffer.from(payloadStr).toString('base64url');
  
  // Create HMAC signature
  const hmac = crypto.createHmac('sha256', JWT_SECRET);
  hmac.update(encodedPayload);
  const signature = hmac.digest('base64url');
  
  return `${encodedPayload}.${signature}`;
}

/**
 * Verify a signed token without requiring server-side storage
 */
function verifySignedToken(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return null;
    }
    
    const [encodedPayload, signature] = parts;
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', JWT_SECRET);
    hmac.update(encodedPayload);
    const expectedSignature = hmac.digest('base64url');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Decode payload
    const payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadStr);
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }
    
    return {
      email: payload.email,
      id: payload.id,
      role: payload.role,
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export interface AuthUser {
  email: string;
  id?: string;
  role?: string;
}

/**
 * Generate a signed token for a user (doesn't require server-side storage)
 */
export function generateToken(user: AuthUser): string {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  // Use signed token that can be verified without server-side storage
  const signedToken = createSignedToken(user, expiresAt);
  
  // Also store in tokenStore for backward compatibility and quick lookup
  tokenStore.set(signedToken, { user, expiresAt });
  
  // Clean up expired tokens periodically
  if (tokenStore.size > 1000) {
    const now = Date.now();
    for (const [key, value] of tokenStore.entries()) {
      if (value.expiresAt < now) {
        tokenStore.delete(key);
      }
    }
  }
  
  return signedToken;
}

/**
 * Verify a token - tries signed token first, then falls back to tokenStore
 */
export function verifyToken(token: string): AuthUser | null {
  if (!token || token.trim() === '') {
    return null;
  }
  
  // First try to verify as signed token (works without server-side storage)
  const signedUser = verifySignedToken(token);
  if (signedUser) {
    return signedUser;
  }
  
  // Fallback to tokenStore lookup (for backward compatibility)
  const stored = tokenStore.get(token);
  if (!stored) {
    return null;
  }
  
  if (stored.expiresAt < Date.now()) {
    tokenStore.delete(token);
    return null;
  }
  
  return stored.user;
}

/**
 * Extract token from Authorization header
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return null;
  }
  
  // Handle "Bearer token" format (case-insensitive)
  const normalized = authHeader.trim();
  if (normalized.toLowerCase().startsWith('bearer ')) {
    const token = normalized.substring(7).trim();
    return token || null;
  }
  
  return null;
}

/**
 * Authenticate request using either token or session
 * Returns the authenticated user or null
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: AuthUser | null; error: string | null }> {
  // Try token authentication first
  const token = extractToken(request);
  const authHeader = request.headers.get('authorization');
  
  // Debug logging
  console.log('Auth check - Has auth header:', !!authHeader);
  console.log('Auth check - Extracted token:', !!token, token ? `Length: ${token.length}` : 'none');
  console.log('Auth check - Token store size:', tokenStore.size);
  
  if (token) {
    console.log('Attempting to verify token. Token format:', token.includes('.') ? 'signed (new)' : 'hex (old)');
    const user = verifyToken(token);
    if (user) {
      console.log('Token verified successfully for user:', user.email);
      return { user, error: null };
    }
    // Log for debugging
    console.log('Token verification failed. Token exists:', !!token, 'Token length:', token?.length);
    console.log('Token store size:', tokenStore.size);
    // Check if token exists in store
    const tokenExists = tokenStore.has(token);
    console.log('Token exists in store:', tokenExists);
    console.log('Token preview:', token.substring(0, 50) + '...');
    
    // Check if it's an old format token
    if (!token.includes('.')) {
      return { user: null, error: 'Invalid token format. Please login again to get a new token.' };
    }
    
    return { user: null, error: 'Invalid or expired token. Please login again.' };
  }

  // Try session authentication only if no token was provided
  try {
    const supabase = await createClient();
    const {
      data: { user: sessionUser },
      error: sessionError,
    } = await supabase.auth.getUser();

    if (sessionError || !sessionUser) {
      return { user: null, error: 'No valid session found. Please provide a Bearer token.' };
    }

    return {
      user: {
        email: sessionUser.email || '',
        id: sessionUser.id,
        role: sessionUser.user_metadata?.role,
      },
      error: null,
    };
  } catch (error) {
    return { user: null, error: 'Authentication failed' };
  }
}

/**
 * Middleware helper to protect routes
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ user: AuthUser; response?: NextResponse } | { user: null; response: NextResponse }> {
  const { user, error } = await authenticateRequest(request);

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: error || 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  return { user };
}

