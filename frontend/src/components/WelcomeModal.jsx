import React, { useState } from 'react';
import { 
  X, 
  User, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import { loginUser, registerUser } from '../api';

export default function WelcomeModal({
  isOpen,
  onClose,
  onLoginSuccess
}) {
  const [view, setView] = useState('welcome'); // 'welcome' | 'signin' | 'signup'
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
      if (view === 'signup') {
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

  const handleContinueAsGuest = () => {
    localStorage.setItem('nexus_guest_dismissed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#121826] border border-slate-700/90 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Welcome to Nexus Market Graph
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Indian Equities (NSE/BSE) • Zero-Hallucination Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={handleContinueAsGuest}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Close / Continue as Guest"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 relative z-10">
          
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* VIEW: Welcome Selection Screen */}
          {view === 'welcome' && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="text-lg font-bold text-white mb-1">
                  How would you like to get started?
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Track exact session exits, explore 150+ Indian stocks, or browse supply chain knowledge graphs.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                
                {/* 1. Quick Demo Account */}
                <button
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full p-3.5 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 hover:from-blue-900/60 hover:to-indigo-900/60 border border-blue-500/40 hover:border-blue-400 transition text-left flex items-center justify-between group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/30 text-blue-300 flex items-center justify-center border border-blue-500/30 shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-300 transition flex items-center gap-1.5">
                        <span>1-Click Demo Login</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">Recommended</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Login as <strong>Aditi Shankar</strong> with simulated logout prices to test session diffing immediately.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                </button>

                {/* 2. Sign In to Existing Account */}
                <button
                  onClick={() => { setView('signin'); setError(''); }}
                  className="w-full p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 shrink-0">
                      <LogIn className="w-4 h-4 text-slate-300" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-400 transition">
                        Sign In
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Log in with your existing username to see what changed since your last visit.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                </button>

                {/* 3. Create New Account (Sign Up) */}
                <button
                  onClick={() => { setView('signup'); setError(''); }}
                  className="w-full p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 shrink-0">
                      <UserPlus className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                        Create New Profile (Sign Up)
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Create a personal account that records your exact exit second and custom watchlists.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                </button>

                {/* 4. Continue as Guest */}
                <button
                  onClick={handleContinueAsGuest}
                  className="w-full p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700 transition text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800/50 text-slate-400 flex items-center justify-center border border-slate-800 shrink-0">
                      <Compass className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-300 group-hover:text-white transition">
                        Continue as Guest
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Browse general 1h, 3h, 5h market summaries and explore 150+ stocks with no login.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                </button>

              </div>
            </div>
          )}

          {/* VIEW: Sign In Form */}
          {view === 'signin' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-white">Sign In to Your Profile</h3>
                <button
                  type="button"
                  onClick={() => setView('welcome')}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  ← Back to Options
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. aditi or demo_user"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white transition shadow-md flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Need an account? Sign Up
                </button>
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Continue as Guest
                </button>
              </div>
            </form>
          )}

          {/* VIEW: Sign Up Form */}
          {view === 'signup' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-white">Create New Profile</h3>
                <button
                  type="button"
                  onClick={() => setView('welcome')}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  ← Back to Options
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Username (Unique handle)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. trader_aditi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white transition shadow-md flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creating Profile...' : 'Create Account & Start Tracking'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Already have an account? Sign In
                </button>
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Continue as Guest
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>🔒 0-Hallucination Math</span>
          <span>Exact ₹ Prices & Session Exits</span>
        </div>

      </div>
    </div>
  );
}
