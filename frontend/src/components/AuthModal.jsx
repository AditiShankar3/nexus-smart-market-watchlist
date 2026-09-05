import React, { useState } from 'react';
import { 
  X, 
  User, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  Check, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { loginUser, registerUser } from '../api';

export default function AuthModal({
  onClose,
  onLoginSuccess
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await loginUser('demo_user');
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError('Failed to login as demo user.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError('');

    try {
      let user;
      if (isRegister) {
        user = await registerUser(username.trim().toLowerCase(), name.trim() || username);
      } else {
        user = await loginUser(username.trim().toLowerCase());
      }
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#121826] border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {isRegister ? 'Create Account' : 'Sign In to Smart Watchlist'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* 1-Click Demo Login Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Quick Demo Account
            </div>
            <p className="text-xs text-slate-300">
              Test session diffing immediately as <strong>Aditi Shankar</strong> (simulates returning after 2 hours).
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>1-Click Demo Login</span>
            </button>
          </div>

          <div className="flex items-center gap-2 my-2 text-xs text-slate-500 uppercase font-mono">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span>Or use custom username</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                placeholder="e.g. aditi or trader1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Shankar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-xs text-white transition border border-slate-700 flex items-center justify-center gap-1.5"
            >
              {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isRegister ? 'Sign Up' : 'Sign In'}</span>
            </button>
          </form>

          {/* Toggle between Sign In & Sign Up */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          <div className="text-[11px] text-slate-500 text-center leading-tight pt-1">
            🔒 Prices and timestamp are recorded automatically the second you close the tab.
          </div>

        </div>

      </div>
    </div>
  );
}
