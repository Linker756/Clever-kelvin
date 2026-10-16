import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  CheckCircle2,
  LogOut,
  Sparkles,
  Shield,
  ArrowRight,
} from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  studentId: string;
  isLoggedIn: boolean;
  avatarUrl: string;
  isSubscribed: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogin: (updated: UserProfile) => void;
  onLogout: () => void;
  onOpenSubscription: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  onOpenSubscription,
}) => {
  const [email, setEmail] = useState('jason.mwangi@university.edu');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('Jason Mwangi');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name,
      email,
      role: 'University Student (Operator)',
      studentId: '#STU-88291',
      isLoggedIn: true,
      avatarUrl: '',
      isSubscribed: user.isSubscribed,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-base font-bold">
                {user.isLoggedIn ? 'Student Profile & Account' : 'Sign in to LecturaAI'}
              </h2>
              <p className="text-xs text-slate-400">
                {user.isLoggedIn ? 'Manage account, subscription & synced notes' : 'Access your synced study notes & PDF guides'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close login dialog"
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {user.isLoggedIn ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md">
                  JM
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{user.name}</h3>
                  <div className="text-xs text-slate-500">{user.email}</div>
                  <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                    ID: {user.studentId} • {user.role}
                  </div>
                </div>
              </div>

              {/* Subscription Status Card */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Subscription: {user.isSubscribed ? 'Pro Active' : 'Free Scholar'}
                  </div>
                  <div className="text-[11px] text-purple-700 mt-0.5">
                    {user.isSubscribed
                      ? 'Full multimodal access (PDF, Word, Images, Google Search)'
                      : 'Standard study features. Upgrade for unlimited documents.'}
                  </div>
                </div>

                {!user.isSubscribed && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSubscription();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shrink-0 cursor-pointer transition-all"
                  >
                    Upgrade
                  </button>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out of account</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isRegisterMode && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student@university.edu"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-purple-600 font-semibold hover:underline cursor-pointer"
                >
                  {isRegisterMode ? 'Already have account? Sign in' : 'Create new account'}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/10 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isRegisterMode ? 'Create Student Account' : 'Sign in as Jason (Student)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
