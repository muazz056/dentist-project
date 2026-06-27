// Site configuration file
// This file loads configuration dynamically from environment variables,
// allowing the entire application to be rebranded by changing env files.

export interface SiteConfig {
  appName: string;
  phone: string;
  phoneLink: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  googleRating: string;
  googleReviews: string;
  email: string;
  googleMapsUrl: string;
  calendlyUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  gmbUrl: string;
  gaId: string;
  gtmId: string;
  officeHours: { day: string; hours: string }[];
}

// Robust defaults based on Bridgeport Dentists client details
export const DEFAULT_CONFIG: SiteConfig = {
  appName: "Bridgeport Dentists",
  phone: "(203) 873-0708",
  phoneLink: "tel:+12038730708",
  address: "2992 Main St",
  city: "Bridgeport",
  state: "CT",
  zip: "06606",
  googleRating: "4.4",
  googleReviews: "79",
  email: "info@bridgeportdentists.com",
  googleMapsUrl: "https://maps.google.com/?q=2992+Main+St,+Bridgeport,+CT+06606",
  calendlyUrl: "", // If empty, booking widget is hidden as per requirement
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "",
  gmbUrl: "https://business.google.com",
  gaId: "",
  gtmId: "",
  officeHours: [
    { day: "Monday", hours: "8:00 AM - 5:00 PM" },
    { day: "Tuesday", hours: "8:00 AM - 5:00 PM" },
    { day: "Wednesday", hours: "8:00 AM - 5:00 PM" },
    { day: "Thursday", hours: "8:00 AM - 7:00 PM" },
    { day: "Friday", hours: "8:00 AM - 2:00 PM" },
    { day: "Saturday", hours: "By Appointment" },
    { day: "Sunday", hours: "Closed (Emergency Only)" },
  ],
};

// Client-side config - uses defaults; runtime overrides come from /api/config (NEXT_PUBLIC_*)
export const siteConfig: SiteConfig = { ...DEFAULT_CONFIG };
