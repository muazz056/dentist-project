import React from "react";
import { Phone, Calendar } from "lucide-react";
import { useConfig } from "./config-context";

interface StickyMobileCtaProps {
  onBookClick: () => void;
}

export const StickyMobileCta: React.FC<StickyMobileCtaProps> = ({ onBookClick }) => {
  const { config } = useConfig();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-2.5 shadow-2xl flex md:hidden items-center gap-2" id="mobile-sticky-quick-actions">
      {/* Quick Phone Call Button */}
      <a
        href={config.phoneLink}
        className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white font-black py-3 px-4 rounded-xl shadow-lg hover:bg-red-700 active:scale-95 transition-all text-sm tracking-wide uppercase"
      >
        <Phone className="h-4.5 w-4.5 fill-current animate-bounce" />
        <span>Call Now</span>
      </a>

      {/* Quick Booking Anchor */}
      <button
        onClick={onBookClick}
        className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-900 text-white font-black py-3 px-4 rounded-xl shadow-lg hover:bg-blue-950 active:scale-95 transition-all text-sm tracking-wide uppercase"
      >
        <Calendar className="h-4.5 w-4.5" />
        <span>Book Online</span>
      </button>
    </div>
  );
};

export default StickyMobileCta;
