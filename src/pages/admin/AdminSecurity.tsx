import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  User, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  ShieldAlert,
  Save
} from 'lucide-react';
import { api } from '../../lib/api';

export const AdminSecurity: React.FC = () => {
  const [currentUsername, setCurrentUsername] = useState<string>('admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentAdmin();
  }, []);

  const loadCurrentAdmin = async () => {
    setFetchingUser(true);
    try {
      const authInfo = await api.checkSession();
      if (authInfo.username) {
        setCurrentUsername(authInfo.username);
        setNewUsername(authInfo.username);
      }
    } catch {
      // fallback
    } finally {
      setFetchingUser(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('Please enter your current administrator password to confirm your identity.');
      return;
    }

    const usernameToUpdate = newUsername.trim();
    const passwordToUpdate = newPassword.trim();

    if (usernameToUpdate.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(usernameToUpdate)) {
      setError('Username may only contain letters, numbers, dots, hyphens, and underscores.');
      return;
    }

    if (passwordToUpdate) {
      if (passwordToUpdate.length < 6) {
        setError('New password must be at least 6 characters long.');
        return;
      }
      if (passwordToUpdate !== confirmPassword) {
        setError('New password and confirmation password do not match.');
        return;
      }
    } else if (usernameToUpdate === currentUsername) {
      setError('No changes detected. Enter a new username or new password to update.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.changeCredentials({
        currentPassword,
        newUsername: usernameToUpdate !== currentUsername ? usernameToUpdate : undefined,
        newPassword: passwordToUpdate || undefined
      });

      setSuccess(res.message || 'Credentials updated successfully.');
      setCurrentUsername(res.username || usernameToUpdate);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update credentials. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-zinc-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-emerald-400" />
            <span>Admin Authentication & Credentials</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Safely update your administrative login username and password. Changes persist in your active database.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
          <span className="text-zinc-400">Current Login:</span>
          <span className="font-mono text-emerald-400 font-semibold">{currentUsername}</span>
        </div>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-xs text-emerald-300 flex items-start gap-3 shadow-lg shadow-emerald-950/30 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-200">Credentials Updated Successfully</p>
            <p className="text-emerald-300/90 leading-relaxed">{success}</p>
            <p className="text-[11px] text-emerald-400/80 mt-1">
              Note: The default credentials banner has been permanently removed from the login screen. Please make sure to save your new password in a password manager.
            </p>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/30 text-xs text-red-300 flex items-start gap-3 shadow-lg shadow-red-950/30 animate-in fade-in">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-red-200">Credential Update Failed</p>
            <p className="text-red-300/90 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Modify Admin Login Details</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Enter your current password to authorize changes, then specify your new username and/or password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Current Password Field */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Current Administrator Password</span>
                  <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">Required for verification</span>
              </div>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 pl-3 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Username Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-zinc-400" />
                <span>New Administrator Username</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter new administrator username"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                Alphanumeric characters, dots, hyphens, and underscores only. Minimum 3 characters.
              </p>
            </div>

            <div className="border-t border-zinc-800/80 pt-4 space-y-4">
              <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-zinc-400" />
                <span>Update Password (Optional)</span>
              </div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep existing password"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-3 pr-10 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {newPassword && (
                  <p className={`text-[11px] ${newPassword.length >= 6 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {newPassword.length >= 6 ? '✓ Password length is sufficient' : 'Must be at least 6 characters'}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              {newPassword.length > 0 && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-xs font-medium text-zinc-400 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-3 pr-10 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <p className={`text-[11px] ${confirmPassword === newPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                      {confirmPassword === newPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-zinc-950 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving Changes...' : 'Update Admin Credentials'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Security Info & Best Practices Sidebar */}
        <div className="space-y-5">
          
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Security Highlights</span>
            </div>
            
            <ul className="text-[11px] text-zinc-400 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>No UI Credential Leakage:</strong> The admin login page no longer displays default usernames or passwords.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Bcrypt Password Hashing:</strong> Passwords are cryptographically salted and hashed before persistence.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Rate Limiting Protected:</strong> Brute-force login attempts are automatically throttled per IP address.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Dual-Store Persistence:</strong> New credentials persist across your PostgreSQL database and runtime memory.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2 text-zinc-300 font-semibold">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>Important Recommendation</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              After updating your administrator credentials, be sure to store your new username and password in a secure password manager. You will need them for future administrative sign-ins.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
