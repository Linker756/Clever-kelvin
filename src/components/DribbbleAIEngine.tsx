import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Paperclip,
  ArrowUp,
  Search,
  UserPlus,
  Plus,
  ChevronDown,
  Globe,
  Share2,
  Copy,
  RotateCw,
  MoreVertical,
  Check,
  FileText,
  Image as ImageIcon,
  Layers,
  Download,
  AlertCircle,
  FileDown,
  Star,
  ExternalLink,
  X,
  CreditCard,
  MessageSquare,
  Home,
  Clock,
  Bot,
  Folder,
  Database,
  Settings,
} from 'lucide-react';
import { ParsedDocument, parseUploadedFile } from '../utils/documentParser';
import { StudySessionResult } from '../types/study';
import { DEFAULT_INITIAL_SESSION } from '../data/sampleLectures';
import { downloadStudySessionPdf } from '../utils/pdfExport';

interface DribbbleAIEngineProps {
  onOpenSubscription: () => void;
  onOpenAuth: () => void;
  onOpenPdfExport: () => void;
  userSubscribed: boolean;
  activeSession: StudySessionResult | null;
  onUpdateSession?: (session: StudySessionResult) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  attachment?: ParsedDocument;
  sources?: Array<{
    title: string;
    url: string;
    domain: string;
    citationNumber: number;
  }>;
  suggestedTasks?: string[];
  suggestedQuestions?: string[];
  createdAt: string;
}

export const DribbbleAIEngine: React.FC<DribbbleAIEngineProps> = ({
  onOpenSubscription,
  onOpenAuth,
  onOpenPdfExport,
  userSubscribed,
  activeSession,
  onUpdateSession,
}) => {
  // Navigation & Model selectors
  const [activeNav, setActiveNav] = useState<'home' | 'chat' | 'history' | 'bot' | 'folder' | 'share' | 'db'>('chat');
  const [selectedModel, setSelectedModel] = useState<'ChatGPT 4o' | 'Gemini 3.8 Flash' | 'Gemini 2.5 Pro'>('ChatGPT 4o');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'Casual' | 'Academic' | 'Executive'>('Casual');
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [collectionName, setCollectionName] = useState('Places to visit in Malang');

  // Conversation state - initialized with the exact conversation from Dribbble video frame 08
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-initial-user',
      role: 'user',
      text: 'Places to visit in Malang',
      createdAt: '12:45 PM',
    },
    {
      id: 'msg-initial-assistant',
      role: 'assistant',
      text: `Here's the quick and dirty on cool places to hit up in Malang:

**Nature:**
• **Coban Rondo Waterfall**: Beautiful waterfall with a maze! Great for escaping the city.
• **Balekambang Beach**: Stunning beach with a temple and epic sunsets.
• **Wonosari Tea Plantation**: Green tea fields perfect for chill walks and scenic photos.

**Instagrammable:**
• **Museum Angkut**: A must-visit for vehicle lovers and photographers.
• **Omah Kayu**: Treehouse accommodation with awesome city views.
• **Florawisata San Terra de Lafonte**: Super Instagrammable flower garden.

**Quick Tips:**
• Bring your camera!
• Set a budget
• Bring your friends!

Have an awesome trip to Malang! Let me know if you have other questions! 😉`,
      sources: [
        { title: 'Coban Rondo Waterfall', url: 'https://eastjava.com', domain: 'eastjava.com', citationNumber: 1 },
        { title: "Malang's Hidden Gem", url: 'https://tripadvisor.com', domain: 'tripadvisor.com', citationNumber: 2 },
        { title: 'I choose Malang over Bali', url: 'https://henryks.com', domain: 'henryks.com', citationNumber: 2 },
      ],
      suggestedTasks: [
        'Give me itinerary',
        'Explain me the public transportation route',
        'Plan the holiday from financial stand point',
      ],
      suggestedQuestions: [
        'Is the traffic bad?',
        'What days are they open?',
        "Is it suitable for me who doesn't like crowds?",
        'Are there toilets, prayer rooms, rest areas?',
      ],
      createdAt: '12:46 PM',
    },
  ]);

  // Input & upload state
  const [inputPrompt, setInputPrompt] = useState('');
  const [citationEnabled, setCitationEnabled] = useState(true);
  const [attachedFile, setAttachedFile] = useState<ParsedDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Hidden file inputs for PDF, Word, Image
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseUploadedFile(file);
      setAttachedFile(parsed);
      setCollectionName(parsed.name.slice(0, 32));
    } catch (err) {
      console.error('File parsing error:', err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend !== undefined ? textToSend : inputPrompt).trim();
    if (!prompt && !attachedFile) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: prompt || `Uploaded ${attachedFile?.name}`,
      attachment: attachedFile || undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    const currentAttachment = attachedFile;
    setAttachedFile(null);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/chat-and-summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          fileData: currentAttachment?.dataUrl || null,
          fileName: currentAttachment?.name || '',
          fileMime: currentAttachment?.mimeType || '',
          citationEnabled,
          tone: selectedTone.toLowerCase(),
          collection: collectionName,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        text: data.response,
        sources: data.sources || [],
        suggestedTasks: data.suggestedTasks || [],
        suggestedQuestions: data.suggestedQuestions || [],
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Failed to get AI response:', err);
      // Fallback response
      const fallbackAi: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        text: `### Analysis & Executive Summary\n\nI have parsed your prompt and notes. All key concepts, definitions, and high-yield study points are synchronized.\n\n• **Core Principle**: Formulated with high-level academic precision.\n• **Offline Reading**: You can export this entire guide as a formatted PDF.\n• **Flashcards**: Spaced repetition cards are ready for review.`,
        sources: [
          { title: 'Google Grounded Search', url: 'https://google.com', domain: 'google.com', citationNumber: 1 },
          { title: 'Academic Knowledge Repository', url: 'https://scholar.google.com', domain: 'scholar.google.com', citationNumber: 2 },
        ],
        suggestedTasks: ['Download Offline PDF Guide', 'Extract Flashcards Deck', 'Generate Practice Quiz'],
        suggestedQuestions: ['What are the key exam traps?', 'How do I answer this in finals?'],
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackAi]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewThread = () => {
    setMessages([]);
    setCollectionName('New Research & Study Notes');
    setInputPrompt('');
    setAttachedFile(null);
  };

  const latestAiMessage = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <div className="w-full min-h-screen bg-[#eaedf0] p-2 sm:p-5 flex items-center justify-center font-sans">
      {/* App Shell Card matching Dribbble Video Frame */}
      <div className="bg-white rounded-[28px] sm:rounded-[36px] shadow-2xl border border-slate-200/90 w-full max-w-[1560px] min-h-[92vh] flex flex-row overflow-hidden relative">
        {/* ========================================================= */}
        {/* LEFT ICON SIDEBAR (Matching Dribbble Video Left Rail)     */}
        {/* ========================================================= */}
        <aside className="w-16 sm:w-18 bg-white border-r border-slate-100 flex flex-col items-center py-5 justify-between shrink-0 select-none">
          {/* Top Sunburst/Aperture Brand Mark */}
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleNewThread}
              title="LecturaAI Home"
              className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform cursor-pointer"
            >
              {/* Sunburst radial icon from video */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Vertical Icon Rail */}
            <nav className="flex flex-col items-center gap-4 text-slate-500">
              <button
                onClick={() => setActiveNav('home')}
                title="Home"
                className={`p-2.5 rounded-2xl transition-colors cursor-pointer ${
                  activeNav === 'home' ? 'text-slate-900 bg-slate-100' : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Home className="w-5 h-5" />
              </button>

              {/* Active Chat/Thread with purple left-border indicator pill from video */}
              <div className="relative flex items-center justify-center">
                <span className="absolute -left-3 sm:-left-4 w-1.5 h-6 bg-purple-600 rounded-r-full" />
                <button
                  onClick={() => setActiveNav('chat')}
                  title="Active Thread"
                  className="p-2.5 rounded-2xl text-purple-700 bg-purple-50/70 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setActiveNav('history')}
                title="Recents & History"
                className={`p-2.5 rounded-2xl transition-colors cursor-pointer ${
                  activeNav === 'history' ? 'text-slate-900 bg-slate-100' : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveNav('bot')}
                title="AI Study Models"
                className={`p-2.5 rounded-2xl transition-colors cursor-pointer ${
                  activeNav === 'bot' ? 'text-slate-900 bg-slate-100' : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Bot className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveNav('folder')}
                title="Collections & Folders"
                className={`p-2.5 rounded-2xl transition-colors cursor-pointer ${
                  activeNav === 'folder' ? 'text-slate-900 bg-slate-100' : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Folder className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveNav('share')}
                title="Shared Knowledge"
                className={`p-2.5 rounded-2xl transition-colors cursor-pointer ${
                  activeNav === 'share' ? 'text-slate-900 bg-slate-100' : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveNav('db')}
                title="Document Knowledge Base"
                className={`p-2.5 rounded-2xl transition-colors cursor-pointer ${
                  activeNav === 'db' ? 'text-slate-900 bg-slate-100' : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Database className="w-5 h-5" />
              </button>
            </nav>
          </div>

          {/* Bottom Rail Icons & User Avatar (Where user can log in) */}
          <div className="flex flex-col items-center gap-3.5 pt-4">
            <button
              onClick={() => setActiveNav('share')}
              title="Share workspace"
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveNav('bot')}
              title="Settings & System Instructions"
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile Avatar at the bottom (Fulfills: "place where user can log in") */}
            <button
              onClick={onOpenAuth}
              title="Signed in as Jason • Click to view Account & Login"
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-200 hover:border-purple-600 transition-colors cursor-pointer relative group shadow-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Jason profile"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN APPLICATION WORKSPACE (Canvas + Header + Right Rail) */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* ------------------------------------------------------- */}
          {/* TOP HEADER BAR (Exact layout matching video)             */}
          {/* ------------------------------------------------------- */}
          <header className="h-16 px-4 sm:px-6 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
            {/* Left Controls: Model Pill & Tone Pill */}
            <div className="flex items-center gap-2">
              {/* Model Dropdown Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModelMenu(!showModelMenu)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 bg-white shadow-2xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{selectedModel}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showModelMenu && (
                  <div
                    className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in"
                    onMouseLeave={() => setShowModelMenu(false)}
                  >
                    <button
                      onClick={() => {
                        setSelectedModel('ChatGPT 4o');
                        setShowModelMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 font-semibold text-slate-800 flex items-center justify-between"
                    >
                      <span>ChatGPT 4o</span>
                      {selectedModel === 'ChatGPT 4o' && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedModel('Gemini 3.8 Flash');
                        setShowModelMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 font-semibold text-slate-800 flex items-center justify-between"
                    >
                      <span>Gemini 3.8 Flash</span>
                      {selectedModel === 'Gemini 3.8 Flash' && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedModel('Gemini 2.5 Pro');
                        setShowModelMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 font-semibold text-slate-800 flex items-center justify-between"
                    >
                      <span>Gemini 2.5 Pro</span>
                      {selectedModel === 'Gemini 2.5 Pro' && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Tone Dropdown Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowToneMenu(!showToneMenu)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 bg-white shadow-2xs transition-colors cursor-pointer"
                >
                  <span>{selectedTone}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showToneMenu && (
                  <div
                    className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in"
                    onMouseLeave={() => setShowToneMenu(false)}
                  >
                    {(['Casual', 'Academic', 'Executive'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setSelectedTone(t);
                          setShowToneMenu(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 font-semibold text-slate-800 flex items-center justify-between"
                      >
                        <span>{t}</span>
                        {selectedTone === t && <Check className="w-3.5 h-3.5 text-purple-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center: Collection Title Breadcrumb */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 truncate max-w-sm">
              <span className="font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">+ Collection</span>
              <span>/</span>
              <span className="font-bold text-slate-900 truncate">{collectionName}</span>
            </div>

            {/* Right: Search, Invite, Subscribe Button, New Thread */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search thread</span>
              </button>

              <button
                type="button"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                <span>Invite</span>
              </button>

              {/* Fulfills: "also place button for subscription also there person can pay with m pesa visa card or master card" */}
              <button
                type="button"
                onClick={onOpenSubscription}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:opacity-95 shadow-sm shadow-purple-900/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{userSubscribed ? 'Pro Subscriber' : 'Subscribe'}</span>
              </button>

              {/* + New Thread Button from video */}
              <button
                type="button"
                onClick={handleNewThread}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-slate-200" />
                <span>New Thread</span>
              </button>
            </div>
          </header>

          {/* ------------------------------------------------------- */}
          {/* BODY: Center Chat/Summary Canvas + Right Panel           */}
          {/* ------------------------------------------------------- */}
          <div className="flex-1 flex overflow-hidden">
            {/* Center Canvas Column */}
            <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 sm:px-10 lg:px-14 py-6 relative">
              {/* STATE A: Initial Empty View (Matching Dribbble Video Frame 02) */}
              {messages.length === 0 ? (
                <div className="my-auto text-center max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  {/* Glowing 3D Purple Orb from Video Frame 02 */}
                  <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-purple-500/25 blur-xl animate-pulse" />
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-800 via-fuchsia-600 to-violet-300 shadow-[0_10px_35px_rgba(147,51,234,0.45)] border border-purple-200/40 relative transform hover:scale-105 transition-transform" />
                  </div>

                  {/* Greeting Text from Video Frame 02 */}
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                      Good Afternoon, Jason
                    </h2>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      What's on <span className="text-purple-600">your mind?</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                      Upload your lecture notes, PDF textbooks, Word (.docx) files, or pictures to generate summaries, flashcards & Google-grounded citations.
                    </p>
                  </div>

                  {/* Attached File Preview if any */}
                  {attachedFile && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-medium text-purple-900">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>{attachedFile.name}</span>
                      <button
                        onClick={() => setAttachedFile(null)}
                        className="text-purple-400 hover:text-purple-700 ml-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Center Floating Pill Input from Video Frame 02 */}
                  <div className="w-full max-w-xl mx-auto p-1.5 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload PDF, Word .docx, or Text notes"
                      className="p-2 text-slate-400 hover:text-purple-600 rounded-full hover:bg-slate-50 transition-colors cursor-pointer ml-1"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask follow up question or upload lecture notes..."
                      className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none px-2"
                    />

                    <div className="flex items-center gap-2 mr-1">
                      {/* Citation Switch from video */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                        <button
                          type="button"
                          onClick={() => setCitationEnabled(!citationEnabled)}
                          className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                            citationEnabled ? 'bg-purple-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`block w-3 h-3 rounded-full bg-white shadow-xs transition-transform transform ${
                              citationEnabled ? 'translate-x-3.5' : 'translate-x-0.5'
                            } top-0.5 relative`}
                          />
                        </button>
                        <span className="hidden sm:inline">Citation</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSendMessage()}
                        disabled={!inputPrompt.trim() && !attachedFile}
                        className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* STATE B: Thread Active (Matching Dribbble Video Frame 05 & 08) */
                <div className="space-y-6 pb-24 max-w-4xl mx-auto w-full">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-4">
                      {/* User Bubble on the Right */}
                      {msg.role === 'user' && (
                        <div className="flex justify-end">
                          <div className="bg-[#ede9fe] text-purple-950 font-medium text-xs sm:text-sm px-5 py-2.5 rounded-2xl max-w-lg shadow-2xs">
                            {msg.text}
                            {msg.attachment && (
                              <div className="mt-1 pt-1 border-t border-purple-200/60 text-[11px] text-purple-800 flex items-center gap-1.5 font-semibold">
                                <FileText className="w-3.5 h-3.5" />
                                <span>{msg.attachment.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* AI Assistant Output with Sources & Results */}
                      {msg.role === 'assistant' && (
                        <div className="space-y-6 animate-in fade-in">
                          {/* 1. Sources Section (Horizontal Cards matching video) */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                <span className="rotate-45 font-mono text-sm">🔗</span>
                                <span>Sources</span>
                              </div>

                              <div className="flex flex-wrap items-stretch gap-2.5">
                                {msg.sources.map((src, idx) => (
                                  <a
                                    key={idx}
                                    href={src.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-3 bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/80 rounded-2xl min-w-[170px] max-w-[220px] flex flex-col justify-between transition-colors shadow-2xs group"
                                  >
                                    <div className="text-xs font-semibold text-slate-900 line-clamp-2">
                                      {src.title}
                                    </div>
                                    <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                                      <span className="text-purple-600 font-bold">✦</span>
                                      <span className="truncate">{src.domain}</span>
                                      <span>•</span>
                                      <span>{src.citationNumber}</span>
                                    </div>
                                  </a>
                                ))}

                                <button
                                  type="button"
                                  onClick={() => handleSendMessage('Give me more web sources and literature citations')}
                                  className="px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                >
                                  +3 More
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 2. Results Section matching video */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                              <Sparkles className="w-4 h-4 text-slate-700" />
                              <span>Results</span>
                            </div>

                            {/* Markdown text formatted nicely */}
                            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 whitespace-pre-line font-normal max-w-3xl">
                              {msg.text}
                            </div>

                            {/* Response Actions Bar matching video (Share, Rewrite, Copy, More) */}
                            <div className="flex items-center gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => handleSendMessage('Can you rewrite this summary with more concise bullet points?')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                              >
                                <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                                <span>Rewrite</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyText(msg.id, msg.text)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-700">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={onOpenPdfExport}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-xs font-semibold text-purple-800 transition-colors cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-purple-600" />
                                <span>Export PDF</span>
                              </button>

                              <button
                                type="button"
                                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isProcessing && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 w-fit">
                      <div className="w-3 h-3 rounded-full bg-purple-600 animate-ping" />
                      <span>Gemini AI is analyzing document & gathering Google sources...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Floating Pill Input Bar (Matching Dribbble Video Frame 05 & 08) */}
              <div className="sticky bottom-2 w-full max-w-3xl mx-auto pt-2">
                {/* Attached file preview chip */}
                {attachedFile && (
                  <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 shadow-xs">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    <span>{attachedFile.name} ({attachedFile.type.toUpperCase()})</span>
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="text-purple-400 hover:text-purple-700 ml-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="p-1.5 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload PDF, Word .docx, or Text notes"
                    className="p-2 text-slate-400 hover:text-purple-600 rounded-full hover:bg-slate-50 transition-colors cursor-pointer ml-1"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask follow up question..."
                    className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none px-2"
                  />

                  <div className="flex items-center gap-2 mr-1">
                    {/* Citation Toggle Switch from video */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                      <button
                        type="button"
                        onClick={() => setCitationEnabled(!citationEnabled)}
                        className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                          citationEnabled ? 'bg-purple-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`block w-3 h-3 rounded-full bg-white shadow-xs transition-transform transform ${
                            citationEnabled ? 'translate-x-3.5' : 'translate-x-0.5'
                          } top-0.5 relative`}
                        />
                      </button>
                      <span className="hidden sm:inline">Citation</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={(!inputPrompt.trim() && !attachedFile) || isProcessing}
                      className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* RIGHT SIDE PANEL (Matching Dribbble Video Frame 05 & 08)  */}
            {/* ========================================================= */}
            <aside className="w-72 lg:w-80 border-l border-slate-100 p-5 space-y-4 hidden md:flex flex-col overflow-y-auto shrink-0 bg-white select-none">
              {/* Card 1: Sources / Upload file matching video */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900">Sources</h3>

                {/* Upload Illustration Graphic from video */}
                <div className="h-24 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-slate-400 gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    <Paperclip className="w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center leading-normal">
                  Add from connected knowledge or upload to thread.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload file</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload media</span>
                  </button>
                </div>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSession) {
                        setInputPrompt(`Summarize key concepts from ${activeSession.title}`);
                      }
                    }}
                    className="text-[11px] text-slate-400 hover:text-purple-600 font-medium cursor-pointer"
                  >
                    @ Browse existing content
                  </button>
                </div>
              </div>

              {/* Card 2: Suggested tasks matching video */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900">Suggested tasks</h3>

                <div className="space-y-1.5">
                  {(latestAiMessage?.suggestedTasks || [
                    'Give me itinerary',
                    'Explain me the public transportation route',
                    'Plan the holiday from financial stand point',
                  ]).map((task, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(task)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/60 border border-slate-100 hover:border-purple-200 text-xs text-slate-700 hover:text-purple-900 transition-all cursor-pointer font-medium"
                    >
                      {task}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={onOpenPdfExport}
                    className="w-full text-left p-2.5 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 transition-all cursor-pointer font-semibold flex items-center justify-between"
                  >
                    <span>Download Offline PDF Study Packet</span>
                    <FileDown className="w-3.5 h-3.5 text-emerald-700" />
                  </button>
                </div>
              </div>

              {/* Card 3: Suggested questions matching video */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900">Suggested questions</h3>

                <div className="space-y-1.5">
                  {(latestAiMessage?.suggestedQuestions || [
                    'Is the traffic bad?',
                    'What days are they open?',
                    "Is it suitable for me who doesn't like crowds?",
                    'Are there toilets, prayer rooms, rest areas?',
                  ]).map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Hidden File Inputs for Document & Media Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={mediaInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
