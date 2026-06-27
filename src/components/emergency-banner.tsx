import React from "react";
import { Phone, AlertTriangle } from "lucide-react";
import { useConfig } from "./config-context";

export const EmergencyBanner: React.FC = () => {
  const { config } = useConfig();

  return (
    <div className="bg-red-600 text-white py-2.5 px-4 shadow-md text-center text-xs sm:text-sm font-medium z-50 relative flex items-center justify-center gap-2 flex-wrap" id="emergency-alert-banner">
      <div className="flex items-center gap-1.5 animate-pulse">
        <AlertTriangle className="h-4.5 w-4.5 text-white" />
        <span className="font-bold tracking-wide uppercase">DENTAL EMERGENCY?</span>
      </div>
      <span className="opacity-95">We offer Same-Day Appointments for severe pain, tooth fractures & swelling.</span>
      <a
        href={config.phoneLink}
        className="inline-flex items-center gap-1 bg-white text-red-600 font-bold px-3 py-1 rounded-full hover:bg-red-50 transition-colors text-xs shadow-sm ml-1"
      >
        <Phone className="h-3 w-3 fill-current" />
        <span>Call Now: {config.phone}</span>
      </a>
    </div>
  );
};

export default EmergencyBanner;
