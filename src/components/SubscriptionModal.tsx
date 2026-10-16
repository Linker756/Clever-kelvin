import React, { useState } from 'react';
import {
  X,
  Check,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  Receipt,
  AlertCircle,
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: string, method: string) => void;
  isSubscribed: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isSubscribed,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'pass'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'visa' | 'mastercard'>('mpesa');

  // M-Pesa fields
  const [mpesaPhone, setMpesaPhone] = useState('+254 712 345 678');
  // Card fields
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('482');
  const [cardName, setCardName] = useState('Jason Mwangi');

  const [isProcessing, setIsProcessing] = useState(false);
  const [stkPromptSent, setStkPromptSent] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [mpesaReceipt, setMpesaReceipt] = useState('');

  if (!isOpen) return null;

  const planPrices = {
    monthly: { usd: '$9.00 / mo', kes: 'KES 1,200 / mo', name: 'Scholar Pro Monthly' },
    annual: { usd: '$79.00 / yr', kes: 'KES 10,000 / yr', name: 'Academic Pro Annual (Save 35%)' },
    pass: { usd: '$1.99 / day', kes: 'KES 250 / 24h', name: 'Exam Cram 24h Pass' },
  };

  const handlePay = () => {
    setIsProcessing(true);

    if (paymentMethod === 'mpesa') {
      setStkPromptSent(true);
      setTimeout(() => {
        setIsProcessing(false);
        const receipt = 'QK' + Math.floor(10000000 + Math.random() * 90000000);
        setMpesaReceipt(receipt);
        setPaymentDone(true);
        setTimeout(() => {
          onSuccess(planPrices[selectedPlan].name, 'M-Pesa');
        }, 1200);
      }, 2500);
    } else {
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentDone(true);
        setTimeout(() => {
          onSuccess(planPrices[selectedPlan].name, paymentMethod === 'visa' ? 'Visa Card' : 'Mastercard');
        }, 1200);
      }, 1800);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sub-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 id="sub-modal-title" className="text-lg font-bold">
                Upgrade to LecturaAI Pro
              </h2>
              <p className="text-xs text-purple-200">
                Unlimited AI Summaries, PDF & Word uploads, and Google Research
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close subscription modal"
            className="p-1 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {paymentDone ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {paymentMethod === 'mpesa'
                  ? `M-Pesa Transaction ${mpesaReceipt} confirmed. KES ${planPrices[selectedPlan].kes} received.`
                  : `Your ${paymentMethod.toUpperCase()} payment has been approved and processed.`}
              </p>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-semibold inline-block">
                ✨ Pro Subscription Active • All Features Unlocked
              </div>
            </div>
          ) : (
            <>
              {/* Plan Picker */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                  1. Select Your Subscription Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('monthly')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedPlan === 'monthly'
                        ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-purple-700 uppercase">Monthly</div>
                    <div className="text-base font-extrabold text-slate-900 mt-1">$9.00</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">KES 1,200 / mo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('annual')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      selectedPlan === 'annual'
                        ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-amber-400 text-amber-950 font-extrabold text-[9px] rounded-full uppercase">
                      Save 35%
                    </span>
                    <div className="text-[11px] font-bold text-purple-700 uppercase">Annual</div>
                    <div className="text-base font-extrabold text-slate-900 mt-1">$79.00</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">KES 10,000 / yr</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('pass')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedPlan === 'pass'
                        ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-purple-700 uppercase">24h Pass</div>
                    <div className="text-base font-extrabold text-slate-900 mt-1">$1.99</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">KES 250 / 24h</div>
                  </button>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                  2. Choose Payment Method (M-Pesa, Visa, Mastercard)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* M-Pesa */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'mpesa'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 text-emerald-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                      M
                    </div>
                    <span className="text-xs">M-Pesa</span>
                  </button>

                  {/* Visa */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('visa')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'visa'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20 text-blue-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-[11px] italic tracking-tighter shadow-2xs">
                      VISA
                    </div>
                    <span className="text-xs">Visa Card</span>
                  </button>

                  {/* Mastercard */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mastercard')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'mastercard'
                        ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-600/20 text-rose-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center relative shadow-2xs overflow-hidden">
                      <div className="w-4 h-4 rounded-full bg-rose-500 absolute left-1" />
                      <div className="w-4 h-4 rounded-full bg-amber-400 absolute right-1 opacity-80" />
                    </div>
                    <span className="text-xs">Mastercard</span>
                  </button>
                </div>
              </div>

              {/* Payment Details Form */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                {paymentMethod === 'mpesa' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        Lipa na M-Pesa STK Push
                      </span>
                      <span className="text-emerald-700 font-bold">
                        {planPrices[selectedPlan].kes}
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Safaricom / Vodacom M-Pesa Mobile Number:
                      </label>
                      <input
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                      />
                    </div>

                    {stkPromptSent && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-amber-600 border-t-transparent animate-spin shrink-0 mt-0.5" />
                        <span>
                          Prompt sent to <strong>{mpesaPhone}</strong>. Enter your M-Pesa PIN on your phone to complete payment.
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        {paymentMethod === 'visa' ? 'Visa Debit / Credit' : 'Mastercard Secure'}
                      </span>
                      <span className="text-slate-900 font-bold">
                        {planPrices[selectedPlan].usd}
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Card Number:
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• ••••"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Expiry:
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          CVV / CVC:
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Cardholder Name:
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Security info */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  256-bit Encrypted Checkout
                </span>
                <span>Cancel Anytime</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!paymentDone && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                paymentMethod === 'mpesa'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
                  : 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 shadow-indigo-950/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <span>
                    Pay with {paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod === 'visa' ? 'Visa' : 'Mastercard'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
