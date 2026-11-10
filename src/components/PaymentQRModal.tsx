import React, { useState, useEffect } from 'react';
import { Film, AdminPaymentConfig, PurchaseRecord } from '../types';
import { 
  X, QrCode, CheckCircle2, Copy, Check, Clock, 
  Sparkles, ShieldCheck, Play, ArrowRight, Film as FilmIcon, AlertCircle, ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cinemaAudio } from '../utils/audio';

interface PaymentQRModalProps {
  film: Film;
  adminPaymentConfig: AdminPaymentConfig;
  onClose: () => void;
  onPurchaseSuccess: (purchase: PurchaseRecord) => void;
  onEnterScreeningRoom: (film: Film) => void;
  onGoBack?: () => void;
}

export const PaymentQRModal: React.FC<PaymentQRModalProps> = ({
  film,
  adminPaymentConfig,
  onClose,
  onPurchaseSuccess,
  onEnterScreeningRoom,
  onGoBack
}) => {
  const [buyerName, setBuyerName] = useState('Aryan Sahu');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onGoBack) onGoBack();
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onGoBack, onClose]);

  const handleBack = () => {
    cinemaAudio.playChime();
    if (onGoBack) onGoBack();
    else onClose();
  };

  const handleCopyHandle = () => {
    navigator.clipboard.writeText(adminPaymentConfig.paymentHandle);
    setIsCopied(true);
    cinemaAudio.playChime();
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleQuickAutofill = () => {
    const randomRef = 'UPI-' + Math.floor(10000000 + Math.random() * 90000000);
    setTransactionRef(randomRef);
    setErrorMessage('');
    cinemaAudio.playChime();
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!transactionRef.trim()) {
      setErrorMessage('Please enter your payment reference / transaction ID');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    cinemaAudio.playTicketPunch();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      const newPurchase: PurchaseRecord = {
        id: 'purch-' + Date.now(),
        filmId: film.id,
        filmTitle: film.title,
        thumbnail: film.thumbnail || film.posterUrl || '',
        runtime: film.runtime || film.duration || 10,
        genre: film.genre || (film.genres && film.genres[0]) || 'Cinema',
        pricePaid: film.price || film.ticketPrice || 0,
        purchaseDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        transactionRef: transactionRef.trim(),
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim()
      };

      onPurchaseSuccess(newPurchase);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f59e0b', '#fbbf24', '#ffffff', '#10b981']
        });
      } catch {
        // Confetti fallback
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0c0c10] border border-[#d4af37]/40 shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden my-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#121218] border-b border-[#d4af37]/20">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181824] hover:bg-[#232334] text-amber-300 hover:text-amber-200 border border-[#d4af37]/40 hover:border-amber-400 text-xs font-serif font-semibold transition-all cursor-pointer group shadow"
              title="Return to previous page / film details"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
              <span>← Back</span>
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#1f1a14] border border-[#d4af37]/50 flex items-center justify-center text-amber-300">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-300/90 font-serif font-semibold block">
                  Direct QR Payment
                </span>
                <span className="text-[11px] text-zinc-400 hidden sm:block">
                  Unlock Lifetime Access to "{film.title}"
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleBack}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-200 hover:bg-[#1a1a22] transition-colors cursor-pointer"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* SUCCESS STATE: FILM UNLOCKED */
          <div className="p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase font-serif tracking-widest text-emerald-400 font-bold block mb-1">
              Payment Confirmed & Verified
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100 mb-2">
              You Now Own "{film.title}"
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto mb-6 leading-relaxed">
              This short film has been permanently added to your personal film library. You have full, unlimited access to stream it in the cinema screening room at any time.
            </p>

            {/* Film Snapshot Card */}
            <div className="max-w-md mx-auto bg-[#14141c] rounded-xl border border-[#d4af37]/30 p-4 mb-6 flex items-center space-x-4 text-left">
              <img
                src={film.thumbnail || film.posterUrl}
                alt={film.title}
                className="w-20 h-16 object-cover rounded-lg border border-zinc-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold font-serif text-amber-200 truncate">
                  {film.title}
                </h4>
                <div className="flex items-center space-x-2 text-[11px] text-zinc-400 mt-0.5">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{film.runtime || film.duration} mins</span>
                  </span>
                  <span>•</span>
                  <span>{film.genre || (film.genres && film.genres[0])}</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">
                  Ref: {transactionRef}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  cinemaAudio.playCurtainSwoosh();
                  onEnterScreeningRoom(film);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-serif font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-102"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Watch Film Now</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#181822] hover:bg-[#222230] text-zinc-200 border border-zinc-700 text-xs font-serif transition-colors cursor-pointer"
              >
                Back to Catalog
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT FLOW */
          <div className="p-6 sm:p-8">
            {/* Film Summary Banner */}
            <div className="rounded-xl bg-[#14141c] border border-zinc-800 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <img
                  src={film.thumbnail || film.posterUrl}
                  alt={film.title}
                  className="w-14 h-14 object-cover rounded-lg border border-zinc-700 shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold font-serif text-amber-100">
                    {film.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-0.5">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{film.runtime || film.duration} mins</span>
                    </span>
                    <span>•</span>
                    <span className="text-amber-300/90">{film.genre || (film.genres && film.genres[0])}</span>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
                  Amount to Pay
                </span>
                <span className="text-2xl font-black font-mono text-amber-300">
                  ${(film.price || film.ticketPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column: Admin Payment QR Code */}
              <div className="bg-[#101016] border border-[#d4af37]/30 rounded-xl p-5 text-center flex flex-col items-center">
                <span className="text-[11px] font-serif uppercase tracking-widest text-amber-400 font-semibold mb-3">
                  Scan QR to Pay
                </span>

                {/* QR Code Graphic Frame */}
                <div className="relative p-2.5 bg-white rounded-xl shadow-lg mb-3 max-w-[200px] w-full aspect-square flex items-center justify-center overflow-hidden border-2 border-[#d4af37]">
                  <img
                    src={adminPaymentConfig.qrCodeUrl}
                    alt="Admin Payment QR Code"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback QR code generator if external URL is broken
                      (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(adminPaymentConfig.paymentHandle)}`;
                    }}
                  />
                </div>

                {/* Admin Payment Handle & Copy */}
                <div className="w-full bg-[#181822] rounded-lg p-2.5 border border-zinc-800 flex items-center justify-between text-xs mb-2">
                  <div className="text-left truncate mr-2">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 block">
                      Payee Handle / UPI
                    </span>
                    <span className="text-amber-200 font-mono font-medium truncate block">
                      {adminPaymentConfig.paymentHandle}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyHandle}
                    className="px-2.5 py-1 rounded bg-[#272736] hover:bg-[#343448] text-amber-300 border border-[#d4af37]/30 text-[11px] font-serif flex items-center space-x-1 shrink-0 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-zinc-400 leading-snug">
                  {adminPaymentConfig.paymentInstructions}
                </p>
              </div>

              {/* Right Column: Verification Form */}
              <form onSubmit={handleConfirmPayment} className="space-y-4">
                <div>
                  <label className="text-xs font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-zinc-700 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                    Email Address <span className="text-zinc-500 font-normal lowercase">(for receipt, optional)</span>
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-zinc-700 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-serif uppercase tracking-wider text-zinc-300 font-medium">
                      Transaction / UTR Reference *
                    </label>
                    <button
                      type="button"
                      onClick={handleQuickAutofill}
                      className="text-[10px] text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer"
                    >
                      Autofill Test Ref
                    </button>
                  </div>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. UPI-98765432 or Bank Ref"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#14141c] border border-zinc-700 text-amber-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:opacity-60 text-black font-serif font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center space-x-2 cursor-pointer transition-all"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>Confirm Payment & Unlock Film</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-zinc-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct Creator P2P Settlement • Instant Ownership</span>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
