import express from "express";
import { sendEmailWithBrevo } from "../src/lib/brevo.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/contact", async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    if (!name || !phone || !email || !service) {
      return res.status(400).json({
        success: false,
        error: "Required fields are missing. Please provide Name, Phone, Email, and Service."
      });
    }

    const result = await sendEmailWithBrevo({ name, phone, email, service, message });
    if (result.success) {
      return res.json({ success: true, message: result.message });
    } else {
      return res.status(500).json({ success: false, error: result.error });
    }
  } catch (err: any) {
    console.error("Error handling contact API:", err);
    return res.status(500).json({ success: false, error: "Internal server error." });
  }
});

app.get("/api/config", (req, res) => {
  res.json({
    appName: process.env.NEXT_PUBLIC_APP_NAME || "Bridgeport Dentists",
    phone: process.env.NEXT_PUBLIC_PHONE || "(203) 873-0708",
    phoneLink: process.env.NEXT_PUBLIC_PHONE_LINK || "tel:+12038730708",
    address: process.env.NEXT_PUBLIC_ADDRESS || "2992 Main St",
    city: process.env.NEXT_PUBLIC_CITY || "Bridgeport",
    state: process.env.NEXT_PUBLIC_STATE || "CT",
    zip: process.env.NEXT_PUBLIC_ZIP || "06606",
    googleRating: process.env.NEXT_PUBLIC_GOOGLE_RATING || "4.4",
    googleReviews: process.env.NEXT_PUBLIC_GOOGLE_REVIEWS || "79",
    email: process.env.NEXT_PUBLIC_EMAIL || "info@bridgeportdentists.com",
    googleMapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "",
    calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
    gmbUrl: process.env.NEXT_PUBLIC_GMB_URL || "",
    gaId: process.env.NEXT_PUBLIC_GA_ID || "",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  });
});

export default app;
