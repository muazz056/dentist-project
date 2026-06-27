import React, { useState, useEffect } from "react";
import { X, Gift, Phone, Calendar } from "lucide-react";
import { useConfig } from "./config-context";

interface ExitIntentPopupProps {
  onClaimSpecial: () => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClaimSpecial }) => {
  const { config } = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed this during their session
    const hasBeenShown = sessionStorage.getItem("exit_intent_special_dismissed");
    if (hasBeenShown === "true") {
      setDismissed(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // clientY < 15 is standard for leaving the top of the browser screen (back button, tab switching)
      if (e.clientY < 15 && !isOpen && !dismissed) {
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isOpen, dismissed]);

  const handleClose = () => {
    setIsOpen(false);
    setDismissed(true);
    sessionStorage.setItem("exit_intent_special_dismissed", "true");
  };

  const handleClaim = () => {
    handleClose();
    onClaimSpecial();
  };

  if (!isOpen || dismissed) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in" id="exit-intent-modal-overlay">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-scale-up">
        {/* Top Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 hover:bg-white/20 rounded-full transition-colors z-10"
          aria-label="Close Special Offer Dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Highlight Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-6 text-center flex flex-col items-center gap-2">
          <div className="bg-white/20 p-3 rounded-full text-white inline-flex items-center justify-center mb-1">
            <Gift className="h-8 w-8 text-white animate-bounce" />
          </div>
          <h3 className="text-2xl font-black tracking-tight uppercase">Wait! Don't Leave Without Saving</h3>
          <p className="text-blue-50/90 text-sm">Exclusive Bridgeport Dental Web Offer</p>
        </div>

        {/* Offer Body */}
        <div className="p-8 text-center">
          <div className="text-slate-900 font-extrabold text-4xl sm:text-5xl tracking-tight leading-none mb-1 text-primary">
            $99 New Patient
          </div>
          <div className="text-emerald-600 font-bold text-lg uppercase tracking-wider mb-4">
            Comprehensive Exam & Digital X-Rays
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
            Secure this exclusive same-day voucher. Call us directly or click below to lock in this pricing before leaving.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClaim}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-emerald-700 active:scale-98 transition-all text-sm shadow-md"
            >
              <Calendar className="h-4 w-4" />
              <span>Claim Voucher & Book</span>
            </button>
            <a
              href={config.phoneLink}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-900 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-950 active:scale-98 transition-all text-sm shadow-md"
            >
              <Phone className="h-4 w-4 fill-current" />
              <span>Call: {config.phone}</span>
            </a>
          </div>

          <p className="text-[10px] text-slate-400 mt-4 italic">
            *Offer valid for new patients only. Coupon must be requested during initial booking. Expires shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
