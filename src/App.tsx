import React, { useState } from 'react';
import { DribbbleAIEngine } from './components/DribbbleAIEngine';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AuthModal, UserProfile } from './components/AuthModal';
import { PdfExportModal } from './components/PdfExportModal';
import { DEFAULT_INITIAL_SESSION } from './data/sampleLectures';
import { StudySessionResult } from './types/study';
import { Check } from 'lucide-react';

export default function App() {
  const [activeSession, setActiveSession] = useState<StudySessionResult | null>(DEFAULT_INITIAL_SESSION);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User profile state matching Jason from the Dribbble interface
  const [user, setUser] = useState<UserProfile>({
    name: 'Jason Mwangi',
    email: 'jason.mwangi@university.edu',
    role: 'Student Operator',
    studentId: '#STU-88291',
    isLoggedIn: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    isSubscribed: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSubscriptionSuccess = (planName: string, method: string) => {
    setUser((prev) => ({ ...prev, isSubscribed: true }));
    showToast(`Subscribed to ${planName} via ${method}! All AI features & uploads unlocked.`);
    setTimeout(() => setIsSubModalOpen(false), 800);
  };

  const handleLogin = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    showToast(`Signed in as ${updatedUser.name}`);
  };

  const handleLogout = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
      isSubscribed: false,
    }));
    showToast('Signed out of account.');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#eaedf0] text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Dribbble Interface */}
      <DribbbleAIEngine
        onOpenSubscription={() => setIsSubModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPdfExport={() => setIsPdfModalOpen(true)}
        userSubscribed={user.isSubscribed}
        activeSession={activeSession}
        onUpdateSession={setActiveSession}
      />

      {/* Subscription & Payment Modal (M-Pesa, Visa, Mastercard) */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onSuccess={handleSubscriptionSuccess}
        isSubscribed={user.isSubscribed}
      />

      {/* User Login & Account Modal (Bottom Avatar Area) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenSubscription={() => setIsSubModalOpen(true)}
      />

      {/* Offline PDF Export Modal */}
      {activeSession && (
        <PdfExportModal
          session={activeSession}
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}
    </div>
  );
}
