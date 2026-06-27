import { siteConfig } from "../config/site";

export function CalendlyBooking() {
  const url = siteConfig.calendlyUrl;

  if (!url) {
    return null;
  }

  // Support responsive heights for the widget
  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg" id="calendly-booking-container">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-slate-900">Schedule Your Dental Appointment Online</h3>
        <p className="text-sm text-slate-500 mt-1">Select an available time slot below to secure your visit instantly.</p>
      </div>
      <div className="w-full h-[650px] min-h-[500px]">
        <iframe
          src={`${url}?embed_domain=${window.location.host}&embed_type=Inline`}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Schedule Appointment with Bridgeport Dentists"
          className="w-full h-full rounded-lg"
        ></iframe>
      </div>
    </div>
  );
}
export default CalendlyBooking;
