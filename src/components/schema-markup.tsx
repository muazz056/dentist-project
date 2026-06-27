import React from "react";
import { useConfig } from "./config-context";
import { servicesData } from "../data/services";

export const SchemaMarkup: React.FC = () => {
  const { config } = useConfig();

  const businessUrl = window.location.origin;

  // 1. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": config.appName,
    "url": businessUrl,
    "logo": `${businessUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": config.phone,
      "contactType": "customer service",
      "email": config.email
    },
    "sameAs": [
      config.facebookUrl,
      config.instagramUrl,
      config.youtubeUrl,
      config.gmbUrl
    ].filter(Boolean)
  };

  // 2. Dentist / MedicalBusiness Schema
  const dentistSchema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${businessUrl}/#clinic`,
    "name": config.appName,
    "url": businessUrl,
    "telephone": config.phone,
    "email": config.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config.address,
      "addressLocality": config.city,
      "addressRegion": config.state,
      "postalCode": config.zip,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.2155", // Bridgeport CT coordinates
      "longitude": "-73.1895"
    },
    "image": `${businessUrl}/hero-clinic.jpg`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": config.googleRating,
      "reviewCount": config.googleReviews,
      "bestRating": "5",
      "worstRating": "1"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday"],
        "opens": "08:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Thursday",
        "opens": "08:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Friday",
        "opens": "08:00",
        "closes": "14:00"
      }
    ],
    "priceRange": "$$",
    "hasMap": config.googleMapsUrl || "https://maps.google.com"
  };

  // 3. Service Schemas (Dynamic)
  const serviceSchemas = servicesData.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": s.name,
    "serviceType": "DentalCare",
    "provider": {
      "@type": "Dentist",
      "name": config.appName
    },
    "description": s.shortDescription,
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": config.city
    }
  }));

  // 4. FAQ Schema for Emergency Dentistry
  const emergencyService = servicesData.find((s) => s.id === "emergency");
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (emergencyService?.faqs || []).map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchemas) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
};

export default SchemaMarkup;
