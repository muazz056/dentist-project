import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

import { sendEmailWithBrevo } from "./src/lib/brevo.js";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === "production";

  // Middlewares for parsing JSON and URL-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route: Contact/Booking Leads submission to Brevo API
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, phone, email, service, message } = req.body;

      // Server-side Zod-like verification
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

  // API Route: Dynamic Client Config
  // This securely shares the env-configured company properties with the client-side at runtime,
  // making rebranding as simple as editing the container's environment variables.
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
      googleMapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "https://maps.google.com/?q=2992+Main+St,+Bridgeport,+CT+06606",
      calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
      facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com",
      instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com",
      youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
      gmbUrl: process.env.NEXT_PUBLIC_GMB_URL || "https://business.google.com",
      gaId: process.env.NEXT_PUBLIC_GA_ID || "",
      gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
    });
  });

  // Serve static files / index fallback based on environments
  if (!isProd) {
    console.log("Starting in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode with static assets serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server successfully booted and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
