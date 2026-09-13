import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { db } from './db.js';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_PASSWORD_DEFAULT = process.env.ADMIN_PASSWORD || 'leadgen2026!';
const SESSION_SECRET = process.env.SESSION_SECRET || 'b2b_leadgen_secret_session_key_2026';

// In-memory active sessions (token -> expiry)
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

// Login rate limiting map (ip -> { attempts: number, resetAt: number })
const loginAttempts = new Map<string, { attempts: number; resetAt: number }>();

export const auth = {
  getAdminUsername: async (): Promise<string> => {
    try {
      const creds = await db.getAdminAuth();
      return creds.username || ADMIN_USERNAME;
    } catch {
      return ADMIN_USERNAME;
    }
  },

  // Verify credentials
  verifyCredentials: async (username: string, password: string, clientIp: string): Promise<{ success: boolean; token?: string; username?: string; error?: string }> => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check rate limit
    const now = Date.now();
    const rate = loginAttempts.get(clientIp);
    if (rate && rate.resetAt > now) {
      if (rate.attempts >= 10) {
        const remainingSec = Math.ceil((rate.resetAt - now) / 1000);
        return { success: false, error: `Too many failed login attempts. Please try again in ${remainingSec} seconds.` };
      }
    } else {
      loginAttempts.set(clientIp, { attempts: 0, resetAt: now + 15 * 60 * 1000 });
    }

    const adminAuth = await db.getAdminAuth();
    const targetUsername = (adminAuth.username || ADMIN_USERNAME).toLowerCase();

    // Flexible authorized username check
    const isAuthorizedUsername = 
      cleanUser === targetUsername ||
      cleanUser === 'ibrahim@07' ||
      cleanUser === 'admin' ||
      cleanUser === 'ibrahim' ||
      cleanUser === 'ibrahimshakeshuvo6@gmail.com';

    if (!isAuthorizedUsername) {
      const current = loginAttempts.get(clientIp)!;
      current.attempts += 1;
      return { success: false, error: 'Invalid username or password.' };
    }

    let passwordMatch = false;

    // Direct match for user's explicit credentials
    if (cleanPass === 'ibrahim@07') {
      passwordMatch = true;
    }

    // Default system credentials match
    if (!passwordMatch && (cleanPass === 'leadgen2026!' || cleanPass === ADMIN_PASSWORD_DEFAULT)) {
      passwordMatch = true;
    }

    // Bcrypt comparison against stored database hash
    if (!passwordMatch && adminAuth.passwordHash && adminAuth.passwordHash.trim().length > 0) {
      try {
        passwordMatch = await bcrypt.compare(cleanPass, adminAuth.passwordHash);
      } catch (e) {
        console.error('Bcrypt compare error:', e);
      }
    }

    if (!passwordMatch && ADMIN_PASSWORD_HASH && ADMIN_PASSWORD_HASH.trim().length > 0) {
      try {
        passwordMatch = await bcrypt.compare(cleanPass, ADMIN_PASSWORD_HASH);
      } catch (e) {
        console.error('Bcrypt compare error:', e);
      }
    }

    if (!passwordMatch) {
      const current = loginAttempts.get(clientIp)!;
      current.attempts += 1;
      return { success: false, error: 'Invalid username or password.' };
    }

    // Success: reset attempts completely
    loginAttempts.delete(clientIp);

    const authenticatedUsername = cleanUser === 'ibrahim@07' ? 'ibrahim@07' : (adminAuth.username || 'ibrahim@07');

    // Ensure database stores ibrahim@07 if user logged in with ibrahim@07
    if (cleanUser === 'ibrahim@07' && cleanPass === 'ibrahim@07') {
      try {
        const newHash = await bcrypt.hash('ibrahim@07', 10);
        await db.updateAdminAuth('ibrahim@07', newHash);
      } catch (err) {
        console.error('Error saving updated admin credentials:', err);
      }
    }

    // Create session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days
    activeSessions.set(token, { username: authenticatedUsername, expiresAt });

    return { success: true, token, username: authenticatedUsername };
  },

  // Change Admin Credentials
  changeCredentials: async (
    currentPassword: string,
    newUsername?: string,
    newPassword?: string
  ): Promise<{ success: boolean; username?: string; error?: string }> => {
    const adminAuth = await db.getAdminAuth();
    let currentMatch = false;

    if (currentPassword === 'ibrahim@07') {
      currentMatch = true;
    }

    if (!currentMatch && adminAuth.passwordHash && adminAuth.passwordHash.trim().length > 0) {
      try {
        currentMatch = await bcrypt.compare(currentPassword, adminAuth.passwordHash);
      } catch (e) {
        console.error('Bcrypt compare error in changeCredentials:', e);
      }
    }

    if (!currentMatch && ADMIN_PASSWORD_HASH && ADMIN_PASSWORD_HASH.trim().length > 0) {
      try {
        currentMatch = await bcrypt.compare(currentPassword, ADMIN_PASSWORD_HASH);
      } catch (e) {}
    }

    if (!currentMatch && (currentPassword === (process.env.ADMIN_PASSWORD || 'leadgen2026!') || currentPassword === 'leadgen2026!')) {
      currentMatch = true;
    }

    if (!currentMatch) {
      return { success: false, error: 'Current password is incorrect. Please re-enter your current password.' };
    }

    let targetUsername = adminAuth.username || 'ibrahim@07';
    if (newUsername && newUsername.trim().length > 0) {
      const trimmedUser = newUsername.trim();
      if (trimmedUser.length < 3) {
        return { success: false, error: 'New username must be at least 3 characters.' };
      }
      if (!/^[a-zA-Z0-9_@.-]+$/.test(trimmedUser)) {
        return { success: false, error: 'Username may only contain letters, numbers, @, hyphens, dots, and underscores.' };
      }
      targetUsername = trimmedUser;
    }

    let targetPasswordHash = adminAuth.passwordHash;
    if (newPassword && newPassword.trim().length > 0) {
      const trimmedPass = newPassword.trim();
      if (trimmedPass.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters long.' };
      }
      targetPasswordHash = await bcrypt.hash(trimmedPass, 10);
    }

    await db.updateAdminAuth(targetUsername, targetPasswordHash);

    // Update active sessions username
    for (const [, session] of activeSessions.entries()) {
      session.username = targetUsername;
    }

    return { success: true, username: targetUsername };
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
