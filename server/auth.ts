import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_PASSWORD_DEFAULT = process.env.ADMIN_PASSWORD || 'leadgen2026!';
const SESSION_SECRET = process.env.SESSION_SECRET || 'b2b_leadgen_secret_session_key_2026';

// In-memory active sessions (token -> expiry)
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

// Login rate limiting map (ip -> { attempts: number, resetAt: number })
const loginAttempts = new Map<string, { attempts: number; resetAt: number }>();

export const auth = {
  getAdminUsername: () => ADMIN_USERNAME,

  // Verify credentials
  verifyCredentials: async (username: string, password: string, clientIp: string): Promise<{ success: boolean; token?: string; error?: string }> => {
    // Check rate limit
    const now = Date.now();
    const rate = loginAttempts.get(clientIp);
    if (rate && rate.resetAt > now) {
      if (rate.attempts >= 5) {
        const remainingSec = Math.ceil((rate.resetAt - now) / 1000);
        return { success: false, error: `Too many failed login attempts. Please try again in ${remainingSec} seconds.` };
      }
    } else {
      loginAttempts.set(clientIp, { attempts: 0, resetAt: now + 15 * 60 * 1000 });
    }

    if (username.trim().toLowerCase() !== ADMIN_USERNAME.toLowerCase()) {
      const current = loginAttempts.get(clientIp)!;
      current.attempts += 1;
      return { success: false, error: 'Invalid username or password.' };
    }

    let passwordMatch = false;

    if (ADMIN_PASSWORD_HASH && ADMIN_PASSWORD_HASH.trim().length > 0) {
      try {
        passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      } catch (e) {
        console.error('Bcrypt compare error:', e);
      }
    } else {
      // Compare with default password
      passwordMatch = password === ADMIN_PASSWORD_DEFAULT;
    }

    if (!passwordMatch) {
      const current = loginAttempts.get(clientIp)!;
      current.attempts += 1;
      return { success: false, error: 'Invalid username or password.' };
    }

    // Success: reset attempts
    loginAttempts.delete(clientIp);

    // Create session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days
    activeSessions.set(token, { username: ADMIN_USERNAME, expiresAt });

    return { success: true, token };
  },

  // Validate session token
  validateToken: (token?: string | null): boolean => {
    if (!token) return false;
    const session = activeSessions.get(token);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      activeSessions.delete(token);
      return false;
    }
    return true;
  },

  // Invalidate token
  invalidateToken: (token?: string | null) => {
    if (token) activeSessions.delete(token);
  },

  // Express middleware to protect admin endpoints
  requireAuth: (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.['admin_session'];

    let token: string | null = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token || !auth.validateToken(token)) {
      return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
    }

    next();
  }
};
