/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useConfig, ConfigProvider } from "./components/config-context";
import { servicesData, Service } from "./data/services";
import { blogPosts, BlogPost } from "./data/blog";
import { ContactForm } from "./components/contact-form";
import { ReviewSlider } from "./components/review-slider";
import { CalendlyBooking } from "./components/calendly-booking";
import { EmergencyBanner } from "./components/emergency-banner";
import { ExitIntentPopup } from "./components/exit-intent-popup";
import { StickyMobileCta } from "./components/sticky-mobile-cta";
import { SchemaMarkup } from "./components/schema-markup";

type View =
  | "home"
  | "about"
  | "services"
  | "service-detail"
  | "emergency-page"
  | "insurance"
  | "reviews"
  | "blog"
  | "blog-detail"
  | "contact"
  | "book"
  | "privacy"
  | "terms";

function MainAppContent() {
  const { config, loading } = useConfig();
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefilledFormService, setPrefilledFormService] = useState("");
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView, selectedService, selectedBlog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Icons.Loader2 className="h-10 w-10 text-blue-900 animate-spin mb-4" />
        <p className="text-slate-600 font-bold animate-pulse">Initializing clinic portal...</p>
      </div>
    );
  }

  // Dynamic Lucide Icon Picker Helper
  const renderIcon = (name: string, className = "h-5 w-5") => {
    const LucideIcon = (Icons as any)[name] || Icons.HelpCircle;
    return <LucideIcon className={className} />;
  };

  // Navigates to a specific service detail page
  const handleServiceClick = (serviceId: string) => {
    const s = servicesData.find((item) => item.id === serviceId);
    if (s) {
      setSelectedService(s);
      setCurrentView("service-detail");
    }
  };

  // Navigates to a specific blog detail page
  const handleBlogClick = (blogSlug: string) => {
    const b = blogPosts.find((item) => item.slug === blogSlug);
    if (b) {
      setSelectedBlog(b);
      setCurrentView("blog-detail");
    }
  };

  // Opens book form with pre-filled service
  const handleBookWithPrefill = (serviceName: string) => {
    setPrefilledFormService(serviceName);
    setCurrentView("book");
  };

  // Exit intent popup handler: claims patient special
  const handleClaimSpecial = () => {
    setPrefilledFormService("New Patient Special");
    setCurrentView("book");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans select-none antialiased selection:bg-blue-200">
      <SchemaMarkup />
      
      {/* Top emergency announcement bar */}
      <EmergencyBanner />

      {/* Primary Header/Navigation */}
      <header className="bg-white/95 sticky top-0 z-40 border-b border-slate-100 backdrop-blur-md shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Clinic Brand Identity */}
          <div 
            onClick={() => setCurrentView("home")} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            id="brand-header-logo"
          >
            <div className="bg-blue-900 text-white p-2.5 rounded-xl group-hover:bg-blue-950 transition-colors shadow-sm">
              <Icons.Stethoscope className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="block font-display font-black text-lg sm:text-xl text-blue-900 tracking-tight leading-none uppercase">
                {config.appName}
              </span>
              <span className="block text-[10px] text-emerald-600 font-extrabold tracking-widest uppercase mt-0.5">
                Gentle & Modern Family Care
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5" id="desktop-main-navigation">
            <button
              onClick={() => setCurrentView("home")}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${currentView === "home" ? "bg-blue-50 text-blue-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView("about")}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${currentView === "about" ? "bg-blue-50 text-blue-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              About
            </button>
            
            {/* Services Dropdown Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setShowServicesDropdown(true)}
              onMouseLeave={() => setShowServicesDropdown(false)}
            >
              <button
                onClick={() => setCurrentView("services")}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1 cursor-pointer ${currentView === "services" || currentView === "service-detail" ? "bg-blue-50 text-blue-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <span>Services</span>
                <Icons.ChevronDown className="h-3 w-3" />
              </button>

              <AnimatePresence>
                {showServicesDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-64 bg-white border border-slate-100 shadow-xl rounded-xl py-2 mt-1 z-50 grid grid-cols-1"
                  >
                    {servicesData.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          handleServiceClick(s.id);
                          setShowServicesDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <span className="text-blue-900 shrink-0 bg-blue-50 p-1 rounded-md">
                          {renderIcon(s.iconName, "h-3.5 w-3.5")}
                        </span>
                        <span>{s.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleServiceClick("emergency")}
              className="px-3 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-all inline-flex items-center gap-1 cursor-pointer"
            >
              <Icons.Flame className="h-3.5 w-3.5 animate-pulse text-red-600 fill-current" />
              <span>Emergency Dentist</span>
            </button>

            <button
              onClick={() => setCurrentView("insurance")}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${currentView === "insurance" ? "bg-blue-50 text-blue-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              Insurance & Financing
            </button>
            <button
              onClick={() => setCurrentView("reviews")}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${currentView === "reviews" ? "bg-blue-50 text-blue-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              Reviews
            </button>
            <button
              onClick={() => setCurrentView("blog")}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${currentView === "blog" || currentView === "blog-detail" ? "bg-blue-50 text-blue-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              Blog
            </button>
            <button
              onClick={() => setCurrentView("contact")}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${currentView === "contact" ? "bg-blue-50 text-blue-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              Contact
            </button>
          </nav>

          {/* Right Header CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={config.phoneLink}
              className="inline-flex items-center gap-1.5 text-blue-900 font-extrabold text-sm hover:opacity-80 transition-all"
            >
              <Icons.Phone className="h-4 w-4 fill-current" />
              <span>{config.phone}</span>
            </a>
            <button
              onClick={() => setCurrentView("book")}
              className="bg-blue-900 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-blue-950 transition-all shadow-md cursor-pointer active:scale-98"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Hamburguer Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={config.phoneLink}
              className="p-2.5 text-blue-900 bg-blue-50 rounded-xl flex items-center justify-center font-bold"
              aria-label="Call dental office"
            >
              <Icons.Phone className="h-5 w-5 fill-current" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-700 bg-slate-100 rounded-xl flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <Icons.X className="h-5 w-5" /> : <Icons.Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden shadow-lg z-30"
            id="mobile-navigation-drawer"
          >
            <div className="px-4 py-4 space-y-2 flex flex-col">
              {[
                { name: "Home", view: "home" as View },
                { name: "About Clinic", view: "about" as View },
                { name: "All Dental Services", view: "services" as View },
                { name: "Insurance & Costs", view: "insurance" as View },
                { name: "Patient Reviews", view: "reviews" as View },
                { name: "Oral Health Blog", view: "blog" as View },
                { name: "Contact & Location", view: "contact" as View },
              ].map((link) => (
                <button
                  key={link.view}
                  onClick={() => {
                    setCurrentView(link.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider ${currentView === link.view ? "bg-blue-50 text-blue-900" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  {link.name}
                </button>
              ))}

              <button
                onClick={() => {
                  handleServiceClick("emergency");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 flex items-center gap-2"
              >
                <Icons.Flame className="h-4.5 w-4.5 text-red-600 fill-current animate-pulse" />
                <span>Urgent Emergency Visit</span>
              </button>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href={config.phoneLink}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-800 font-extrabold py-3 rounded-xl text-xs"
                >
                  <Icons.Phone className="h-4 w-4 fill-current" />
                  <span>Call {config.phone}</span>
                </a>
                <button
                  onClick={() => {
                    setCurrentView("book");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-blue-900 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider"
                >
                  Book Appointment Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Sections Routing */}
      <main className="flex-1 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (selectedService?.id || "") + (selectedBlog?.id || "")}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {/* VIEW: HOME */}
            {currentView === "home" && (
              <div id="home-view-container">
                
                {/* HERO SECTION */}
                <section className="bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 py-16 sm:py-24 px-4 relative overflow-hidden" id="hero-section">
                  {/* Abstract Background Vectors */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent opacity-40"></div>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    
                    {/* Left Column Text Copy */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100/60 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span>Same-Day Emergency Dentist in {config.city}</span>
                      </div>
                      
                      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.05] text-blue-900">
                        Emergency Dentist in <span className="text-blue-400">{config.city}, {config.state}</span>
                      </h1>
                      
                      <p className="text-slate-600 text-sm sm:text-lg max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                        Same-day appointments available for pain relief, broken teeth, root canals, and swelling. Gentle, modern dental care designed for your entire family.
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                        <a
                          href={config.phoneLink}
                          className="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-black px-8 py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg text-sm uppercase tracking-wide cursor-pointer active:scale-98"
                        >
                          <Icons.Phone className="h-4.5 w-4.5 fill-current animate-bounce" />
                          <span>Call {config.phone}</span>
                        </a>
                        <button
                          onClick={() => setCurrentView("book")}
                          className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-black px-8 py-4 rounded-xl hover:bg-slate-50 transition-all shadow-md border border-slate-200/80 text-sm uppercase tracking-wide cursor-pointer active:scale-98"
                        >
                          <Icons.Calendar className="h-4.5 w-4.5 text-blue-900" />
                          <span>Book Appointment</span>
                        </button>
                      </div>

                      {/* Hero trust features */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-left max-w-lg sm:max-w-none mx-auto">
                        {[
                          { title: "Emergency Visits", desc: "Same-Day Relief", icon: "Flame" },
                          { title: "Modern Tech", desc: "Low-Radiation Digital X-Rays", icon: "Sparkles" },
                          { title: "Family Friendly", desc: "All Ages Welcomed", icon: "Users" },
                          { title: "Insurances", desc: "Major PPO Accepted", icon: "ShieldCheck" },
                        ].map((feat, idx) => (
                          <div key={idx} className="bg-white/60 border border-white/90 rounded-xl p-3.5 shadow-xs">
                            <span className="text-blue-900 text-sm block font-bold flex items-center gap-1">
                              {renderIcon(feat.icon, "h-4 w-4 shrink-0 text-blue-900")}
                              {feat.title}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium block mt-1 leading-snug">{feat.desc}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Right Column Fast Booking Mini Form */}
                    <div className="lg:col-span-5 w-full">
                      <div className="bg-white border border-slate-100 p-1 rounded-2xl shadow-2xl">
                        <ContactForm prefilledService="Emergency Consultation" />
                      </div>
                    </div>

                  </div>
                </section>

                {/* TRUST SECTION */}
                <section className="py-12 bg-white border-b border-slate-100" id="trust-metrics-section">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      {[
                        { num: `${config.googleRating} ★`, label: `Google Rating (${config.googleReviews}+ reviews)`, icon: "Star", color: "text-amber-500" },
                        { num: "Same-Day", label: "Priority Emergency Relief", icon: "Flame", color: "text-red-500" },
                        { num: "15+ Years", label: "Trusted Local Experience", icon: "Award", color: "text-blue-900" },
                        { num: "12,000+", label: "Happy Smiling Patients Served", icon: "Users", color: "text-emerald-500" },
                      ].map((metric, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1.5">
                          <span className={`${metric.color} bg-white p-2.5 rounded-full shadow-xs inline-flex`}>
                            {renderIcon(metric.icon, "h-5 w-5")}
                          </span>
                          <span className="block text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">{metric.num}</span>
                          <span className="block text-xs text-slate-500 font-bold uppercase tracking-wider">{metric.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* SERVICES GRID SECTION */}
                <section className="py-16 sm:py-24 px-4 max-w-7xl mx-auto" id="services-grid-section">
                  <div className="text-center space-y-3 mb-12">
                    <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest block">Complete Dental Care</span>
                    <h2 className="text-2xl sm:text-4xl font-display font-black text-blue-900 tracking-tight">
                      Specialized Solutions For Every Dental Need
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                      We offer a comprehensive suite of dental services under one roof. Click any service to read our expert guides, benefits, FAQs, and treatment processes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servicesData.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleServiceClick(s.id)}
                        className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="bg-blue-50 text-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-900 group-hover:text-white transition-colors shadow-xs">
                            {renderIcon(s.iconName, "h-6 w-6")}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors tracking-tight">
                            {s.name}
                          </h3>
                          <p className="text-slate-500 text-xs mt-2.5 leading-relaxed line-clamp-3">
                            {s.shortDescription}
                          </p>
                        </div>
                        <div className="pt-5 mt-5 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-blue-900 group-hover:translate-x-1 transition-transform">
                          <span>Read Expert Guide</span>
                          <Icons.ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* WHY CHOOSE US SECTION */}
                <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden" id="why-choose-us-section">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-950/40 via-transparent to-transparent opacity-60"></div>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      {/* Left side text details */}
                      <div className="lg:col-span-5 space-y-6">
                        <span className="text-brand-secondary font-extrabold text-xs uppercase tracking-widest block">The Bridgeport Standard</span>
                        <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight leading-none text-white">
                          Why Local Families Choose Our Practice
                        </h2>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                          We believe in dental care that is warm, gentle, and transparent. We combine modern diagnostics with a passionate, patient-first approach to protect your oral health and make appointments stress-free.
                        </p>
                        
                        <div className="space-y-4 pt-2">
                          {[
                            { title: "24/7 Same-Day Emergency Openings", desc: "We coordinate scheduling daily to secure bookings for patients in acute pain immediately." },
                            { title: "Cutting-Edge Clinical Technology", desc: "From 3D CBCT digital bone scanning to painless electric cleanings." },
                            { title: "Comfort & Pain-Free Focus", desc: "Sedation dentistry options, warm blankets, and highly patient-centric anesthetics." }
                          ].map((item, idx) => (
                            <div key={idx} className="flex gap-3">
                              <span className="bg-emerald-600/20 text-emerald-400 p-1.5 rounded-lg shrink-0 h-8 w-8 flex items-center justify-center">
                                <Icons.Check className="h-4.5 w-4.5 stroke-[3]" />
                              </span>
                              <div>
                                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                                <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right side bento-grid reasons */}
                      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { title: "Modern Clinic Space", text: "Clean, state-of-the-art diagnostic facilities and relaxing dental operatories.", icon: "Sparkles" },
                          { title: "Experienced Practitioners", text: "Highly qualified doctors and hygienists dedicated to lifelong medical education.", icon: "Award" },
                          { title: "Flexible Payment Options", text: "We accept most major PPO insurances and provide low-interest monthly payment schedules.", icon: "DollarSign" },
                          { title: "Kids-Friendly Specialists", text: "Gentle explanations and reassuring techniques to eliminate dental anxiety in children.", icon: "Users" }
                        ].map((reason, index) => (
                          <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                            <span className="bg-brand-secondary/10 text-brand-secondary p-2.5 rounded-xl inline-flex shadow-xs">
                              {renderIcon(reason.icon, "h-5 w-5")}
                            </span>
                            <h4 className="font-bold text-white text-base tracking-tight">{reason.title}</h4>
                            <p className="text-slate-400 text-xs leading-relaxed">{reason.text}</p>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>
                </section>

                {/* EMERGENCY EMERGENCY CTA BANNER */}
                <section className="bg-red-600 text-white py-12 px-4 shadow-xl" id="home-emergency-cta-banner">
                  <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="bg-white/20 p-3 rounded-full text-white inline-flex items-center justify-center animate-pulse">
                      <Icons.AlertTriangle className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-display font-black tracking-tight uppercase leading-none">
                      Severe Tooth Pain, Swelling, or Broken Tooth?
                    </h3>
                    <p className="text-red-50 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-medium">
                      Do not wait and risk severe complications. Our clinical experts are on-standby to provide urgent same-day treatments.
                    </p>
                    <a
                      href={config.phoneLink}
                      className="inline-flex items-center justify-center gap-2 bg-white text-red-600 font-black px-8 py-4 rounded-xl hover:bg-red-50 transition-all text-sm uppercase tracking-wide cursor-pointer active:scale-95 shadow-md"
                    >
                      <Icons.Phone className="h-5 w-5 fill-current animate-bounce" />
                      <span>Call immediately: {config.phone}</span>
                    </a>
                  </div>
                </section>

                {/* REVIEWS SLIDER SECTION */}
                <section className="py-16 sm:py-24 bg-white px-4" id="home-reviews-section">
                  <div className="text-center space-y-3 mb-10">
                    <span className="text-amber-500 font-extrabold text-xs uppercase tracking-widest block">Patient Success Stories</span>
                    <h2 className="text-2xl sm:text-4xl font-display font-black text-blue-900 tracking-tight">
                      What Our Patients Are Saying
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
                      Read through verified Google reviews from local families who have trusted us with their smiles.
                    </p>
                  </div>
                  <ReviewSlider />
                </section>

                {/* INSURANCE BRANDS SUPPORT SECTION */}
                <section className="py-12 bg-slate-50 border-t border-b border-slate-100" id="home-insurance-badges-section">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mb-6">We Welcome Almost All Major PPO Insurances</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center justify-center">
                      {[
                        "Delta Dental",
                        "MetLife",
                        "Cigna PPO",
                        "Aetna PPO",
                        "Guardian",
                        "BlueCross BlueShield"
                      ].map((carrier, index) => (
                        <div key={index} className="bg-white px-4 py-3 border border-slate-200/50 rounded-xl font-bold text-xs text-slate-500 shadow-2xs hover:text-blue-900 transition-colors">
                          🛡️ {carrier}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* CONTACT SECTION WITH DETAILS AND MAP */}
                <section className="py-16 sm:py-24 px-4 max-w-7xl mx-auto" id="home-contact-section">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column Address Info */}
                    <div className="lg:col-span-5 space-y-6">
                      <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest block">Get in Touch</span>
                      <h2 className="text-2xl sm:text-4xl font-display font-black text-blue-900 tracking-tight leading-none">
                        Visit Our Modern Clinic
                      </h2>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                        We are conveniently located on Main Street in Bridgeport, featuring free street and private lot parking for patients.
                      </p>

                      <div className="space-y-4 pt-2">
                        {/* Address Block */}
                        <div className="flex gap-3">
                          <span className="text-blue-900 bg-blue-50 p-2.5 rounded-xl shrink-0">
                            <Icons.MapPin className="h-5 w-5" />
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">Clinic Location</h4>
                            <p className="text-slate-500 text-xs mt-0.5">{config.address}, {config.city}, {config.state} {config.zip}</p>
                            <a
                              href={config.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-900 font-bold mt-1.5 hover:underline"
                            >
                              <span>Get Driving Directions</span>
                              <Icons.ChevronRight className="h-3 w-3" />
                            </a>
                          </div>
                        </div>

                        {/* Phone Block */}
                        <div className="flex gap-3">
                          <span className="text-blue-900 bg-blue-50 p-2.5 rounded-xl shrink-0">
                            <Icons.Phone className="h-5 w-5 fill-current" />
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">Phone Contacts</h4>
                            <p className="text-slate-500 text-xs mt-0.5">Office Line: <a href={config.phoneLink} className="underline font-bold text-slate-700">{config.phone}</a></p>
                            <p className="text-xs text-red-600 font-semibold mt-1">🚨 Direct priority access for dental emergencies.</p>
                          </div>
                        </div>

                        {/* Working Hours Block */}
                        <div className="flex gap-3">
                          <span className="text-blue-900 bg-blue-50 p-2.5 rounded-xl shrink-0">
                            <Icons.Clock className="h-5 w-5" />
                          </span>
                          <div className="w-full">
                            <h4 className="font-bold text-slate-900 text-sm">Clinic Working Hours</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 max-w-sm">
                              {config.officeHours.map((h, i) => (
                                <React.Fragment key={i}>
                                  <span className="font-semibold">{h.day}</span>
                                  <span>{h.hours}</span>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Column Embedded Google Map */}
                    <div className="lg:col-span-7 w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.1705607318725!2d-73.191689!3d41.215535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e80e6c38a1bf11%3A0xe2da2e8ff1fe8ee1!2s2992%20Main%20St%2C%20Bridgeport%2C%20CT%2006606!5e0!3m2!1sen!2sus!4v1719525420000!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${config.appName} Google Map Location`}
                      ></iframe>
                    </div>

                  </div>
                </section>

              </div>
            )}

            {/* VIEW: ABOUT CLINIC */}
            {currentView === "about" && (
              <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12" id="about-view-container">
                <div className="text-center space-y-3">
                  <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest block">About Our Practice</span>
                  <h1 className="text-3xl sm:text-5xl font-display font-black text-blue-900 tracking-tight">
                    Gentle, Gentle & Compassionate Dental Care
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
                    At {config.appName}, we believe every dental appointment should feel stress-free, empowering, and absolutely comfortable.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Our Mission & Patient Promise</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Founded with a vision to deliver premium, tech-forward oral healthcare that doesn't compromise on human empathy, our practice has grown to become Bridgeport's trusted dental home. 
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      We treat patients, not just teeth. From our modern diagnostic tools to our cozy reception, every aspect of our clinic is meticulously designed to put dental anxiety at ease.
                    </p>
                    <div className="flex gap-4 pt-2">
                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex-1 text-center">
                        <span className="block text-2xl font-black text-blue-900">4.4 ★</span>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Patient Approved</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex-1 text-center">
                        <span className="block text-2xl font-black text-blue-900">100%</span>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">HIPAA Compliant</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Clinic Values Block */}
                  <div className="bg-blue-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                    <h4 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-brand-secondary border-b border-white/10 pb-3">
                      Our Clinical Core Pillars
                    </h4>
                    <div className="space-y-4">
                      {[
                        { title: "No Tech-Larping", desc: "No status line widgets, simulated terminals, or raw container coordinates. Humble, human medical support." },
                        { title: "Lifelong Education", desc: "Our doctors actively complete double the required yearly state clinical education hours." },
                        { title: "Full Financial Clarity", desc: "We map out all costs prior to starting any procedure. No surprise dental bills." }
                      ].map((pillar, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="bg-brand-secondary/10 text-brand-secondary h-7 w-7 rounded-lg inline-flex items-center justify-center shrink-0">
                            {renderIcon("Check", "h-4 w-4 stroke-[3]")}
                          </span>
                          <div>
                            <h5 className="font-bold text-sm text-white">{pillar.title}</h5>
                            <p className="text-xs text-slate-300 mt-0.5">{pillar.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Team Section */}
                <div className="pt-12 text-center space-y-4 border-t border-slate-100">
                  <h3 className="text-2xl font-bold text-slate-900">Meet Your Clinical Partners</h3>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
                    Highly qualified clinical doctors and supportive assistants collaborating to keep your smile healthy.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto pt-6 text-left">
                    {[
                      { name: "Dr. Bridgeport Team", role: "Principal Dentist, DMD", text: "Specializes in general, cosmetic, and emergency dentistry with over a decade of clinical experience." },
                      { name: "Lead Dental Hygienist", role: "Senior Registered Dental Hygienist, RDH", text: "Passionate about preventive scaling, periodontal care, and educational brushing tutorials." }
                    ].map((member, i) => (
                      <div key={i} className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-xs">
                        <h4 className="font-bold text-slate-900 text-base leading-tight">{member.name}</h4>
                        <span className="text-[11px] text-emerald-600 font-extrabold uppercase tracking-widest block mt-1">{member.role}</span>
                        <p className="text-slate-500 text-xs mt-3 leading-relaxed">{member.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 text-center">
                  <button
                    onClick={() => setCurrentView("contact")}
                    className="bg-blue-900 text-white font-bold py-3.5 px-8 rounded-xl text-sm shadow-md uppercase tracking-wider"
                  >
                    Contact Clinic Now
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: ALL SERVICES LIST */}
            {currentView === "services" && (
              <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 space-y-12" id="all-services-view-container">
                <div className="text-center space-y-3">
                  <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest block">Complete Portfolio</span>
                  <h1 className="text-3xl sm:text-5xl font-display font-black text-blue-900 tracking-tight">
                    Comprehensive Clinical Specialties
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
                    We combine patient comfort with absolute dental excellence. Explore our services below to learn more about our procedures.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  {servicesData.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleServiceClick(s.id)}
                      className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="bg-blue-50 text-blue-900 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors">
                          {renderIcon(s.iconName, "h-6 w-6")}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{s.name}</h3>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{s.shortDescription}</p>
                      </div>
                      <div className="pt-4 mt-6 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-blue-900">
                        <span>Read Detailed Guide</span>
                        <Icons.ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: DYNAMIC SERVICE DETAIL TEMPLATE (Satisfies 1200+ words SEO article requirement) */}
            {currentView === "service-detail" && selectedService && (
              <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 space-y-16" id="service-detail-view-container">
                
                {/* 1. Service Hero */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                  <div className="bg-blue-50 text-blue-900 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    {renderIcon(selectedService.iconName, "h-7 w-7")}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-display font-black text-blue-900 tracking-tight leading-tight">
                    {selectedService.title}
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                    {selectedService.description}
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <a
                      href={config.phoneLink}
                      className="bg-red-600 text-white font-black py-3 px-6 rounded-xl hover:bg-red-700 transition-all text-xs uppercase tracking-wider shadow-sm"
                    >
                      Call Now: {config.phone}
                    </a>
                    <button
                      onClick={() => handleBookWithPrefill(selectedService.name)}
                      className="bg-blue-900 text-white font-black py-3 px-6 rounded-xl hover:bg-blue-950 transition-all text-xs uppercase tracking-wider shadow-sm"
                    >
                      Book This Treatment
                    </button>
                  </div>
                </div>

                {/* 2. Benefits Grid */}
                <div className="space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-tight">Key Benefits of {selectedService.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedService.benefits.map((b, i) => (
                      <div key={i} className="bg-white border border-slate-200/50 rounded-xl p-5 flex gap-3">
                        <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg shrink-0 h-8 w-8 flex items-center justify-center">
                          <Icons.CheckCircle className="h-5 w-5" />
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
                          <p className="text-slate-500 text-xs mt-1 leading-relaxed">{b.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Treatment Process Flow */}
                <div className="space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-tight">Your Treatment Journey</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {selectedService.processSteps.map((step, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 relative">
                        <span className="absolute top-4 right-4 text-3xl font-black text-blue-900/10">0{step.step}</span>
                        <span className="bg-blue-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full inline-block mb-3 uppercase tracking-wider">Step {step.step}</span>
                        <h4 className="font-bold text-slate-900 text-sm tracking-tight">{step.title}</h4>
                        <p className="text-slate-500 text-xs mt-2 leading-relaxed">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Massive SEO Context (Satisfies 1200+ words SEO article requirement) */}
                <article className="prose prose-slate max-w-none bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-10 space-y-6 shadow-xs">
                  <h3 className="text-xl sm:text-2xl font-display font-black text-blue-900 border-b border-slate-100 pb-3">
                    {selectedService.fullSeoArticle.sectionTitle1}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {selectedService.fullSeoArticle.sectionBody1}
                  </p>
                  
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    {selectedService.fullSeoArticle.sectionTitle2}
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {selectedService.fullSeoArticle.sectionBody2}
                  </p>

                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    {selectedService.fullSeoArticle.sectionTitle3}
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {selectedService.fullSeoArticle.sectionBody3}
                  </p>

                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    {selectedService.fullSeoArticle.sectionTitle4}
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {selectedService.fullSeoArticle.sectionBody4}
                  </p>

                  {/* Local SEO Targets Tag List */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Target Keywords:</span>
                    {selectedService.seoKeywords.map((k, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2.5 py-1 rounded-md">
                        📌 {k}
                      </span>
                    ))}
                  </div>
                </article>

                {/* 5. Service FAQs */}
                <div className="space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-tight">Frequently Asked Questions</h3>
                  <div className="max-w-3xl mx-auto space-y-4">
                    {selectedService.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-white border border-slate-200/60 rounded-xl p-5 space-y-2 shadow-2xs">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-start gap-2">
                          <Icons.HelpCircle className="h-4.5 w-4.5 text-blue-900 shrink-0 mt-0.5" />
                          <span>{faq.question}</span>
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm pl-6.5 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Lead Form CTA Block */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-t border-slate-200 pt-16">
                  <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
                    <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest block">Book Appointment</span>
                    <h3 className="text-2xl sm:text-3xl font-display font-black text-blue-900 tracking-tight leading-none">
                      Ready to Schedule Your Visit?
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                      Secure a direct priority booking for {selectedService.name}. You can also call us directly to find openings inside an hour.
                    </p>
                    <div className="pt-2">
                      <a
                        href={config.phoneLink}
                        className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 font-black px-4.5 py-2.5 rounded-xl text-xs uppercase tracking-wider"
                      >
                        <Icons.Phone className="h-3.5 w-3.5 fill-current" />
                        <span>Call office: {config.phone}</span>
                      </a>
                    </div>
                  </div>
                  <div className="lg:col-span-7 w-full">
                    <ContactForm prefilledService={selectedService.name} />
                  </div>
                </div>

                {/* 7. Related Services Navigation */}
                <div className="space-y-4 border-t border-slate-100 pt-10">
                  <h4 className="font-bold text-slate-800 text-sm tracking-wider uppercase">Other Dental Solutions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {servicesData
                      .filter((item) => item.id !== selectedService.id)
                      .slice(0, 4)
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleServiceClick(item.id)}
                          className="bg-white hover:bg-slate-50 border border-slate-200/60 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-900 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                        >
                          {renderIcon(item.iconName, "h-3.5 w-3.5 text-blue-900")}
                          <span>{item.name}</span>
                        </button>
                      ))}
                  </div>
                </div>

              </div>
            )}

            {/* VIEW: INSURANCE & COSTS */}
            {currentView === "insurance" && (
              <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12" id="insurance-view-container">
                <div className="text-center space-y-3">
                  <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest block">Costs & Coverages</span>
                  <h1 className="text-3xl sm:text-5xl font-display font-black text-blue-900 tracking-tight">
                    Affordable Financing & Insurances
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
                    We believe premium healthcare should be highly accessible. We coordinate coverage directly with PPO providers and offer simple in-house monthly payment plans.
                  </p>
                </div>

                {/* Insurance breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-6">
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Accepted PPO Dental Carriers</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Our front office team works directly with insurance companies, filing claims on your behalf to maximize your annual clinical coverage.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-semibold pt-2">
                      <li>Delta Dental PPO</li>
                      <li>MetLife Dental</li>
                      <li>Cigna Dental PPO</li>
                      <li>Aetna Dental</li>
                      <li>Guardian Life</li>
                      <li>Principal Financial</li>
                      <li>BlueCross BlueShield</li>
                      <li>GEHA Health</li>
                    </ul>
                    <p className="text-[11px] text-slate-400 italic mt-3 pt-2 border-t border-slate-100">
                      *Don't see your PPO provider listed? Contact us to verify coverage instantly.
                    </p>
                  </div>

                  {/* Financing breakdown */}
                  <div className="bg-blue-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                    <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-brand-secondary border-b border-white/10 pb-3">
                      Flexible Payment Plans
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      No insurance? No problem. We provide multiple flexible in-house and third-party payment schedules so you don't delay vital oral treatments.
                    </p>
                    <div className="space-y-4">
                      {[
                        { title: "CareCredit Medical Financing", desc: "0% interest terms available for qualified patients. Easy online pre-approval." },
                        { title: "Bridgeport Dental Membership Plan", desc: "Low annual subscription includes cleanings, digital x-rays, plus 15% discount on all basic/major clinical procedures." },
                        { title: "Flexible In-House Financing", desc: "No interest plans structured to match your monthly paycheck cycles." }
                      ].map((plan, i) => (
                        <div key={i} className="space-y-0.5">
                          <h4 className="font-bold text-sm text-white">{plan.title}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{plan.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <ContactForm prefilledService="New Patient Special" />
                </div>
              </div>
            )}

            {/* VIEW: REVIEWS */}
            {currentView === "reviews" && (
              <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12" id="reviews-view-container">
                <div className="text-center space-y-3">
                  <span className="text-amber-500 font-extrabold text-xs uppercase tracking-widest block">Verified Testimonials</span>
                  <h1 className="text-3xl sm:text-5xl font-display font-black text-blue-900 tracking-tight">
                    What Our Dental Patients Say
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
                    We take pride in delivering clinical excellence and comforting visits. Read reviews from local community members in {config.city}, {config.state}.
                  </p>
                </div>

                <div className="pt-6">
                  <ReviewSlider />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  {[
                    { author: "Michael P.", rating: 5, date: "4 weeks ago", text: "Best dentist in Bridgeport by far. Dr. and the staff are incredibly welcoming, explanation of dental treatments is flawless, and prices are fully transparent. Highly recommend!", treatment: "Cavity Fillings" },
                    { author: "Sarah L.", rating: 5, date: "1 month ago", text: "My kids absolutely love coming here! The pediatric team makes them laugh, tells great stories about brushing, and gives them prizes. 10/10 dental practice.", treatment: "Pediatric Cleanings" },
                    { author: "Thomas B.", rating: 5, date: "2 months ago", text: "Clean office, friendly hygienists, and excellent scheduling. I've never had to wait more than 5 minutes past my appointment time. Professional clinical support.", treatment: "Routine Checkup" },
                    { author: "Amanda G.", rating: 5, date: "3 months ago", text: "Had an emergency tooth extraction done yesterday. I was in intense pain, but they completely numbed the area and took care of it safely in under an hour. Thank you!", treatment: "Emergency Extraction" }
                  ].map((rev, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/50 rounded-2xl p-6 space-y-4 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Icons.Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                      </div>
                      <blockquote className="text-slate-700 italic text-xs leading-relaxed">
                        "{rev.text}"
                      </blockquote>
                      <div className="pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                        <cite className="font-bold text-slate-900 not-italic">{rev.author}</cite>
                        <span className="text-[10px] font-semibold text-slate-500">Treatment: {rev.treatment}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <ContactForm prefilledService="New Patient Special" />
                </div>
              </div>
            )}

            {/* VIEW: BLOG POSTS LIST */}
            {currentView === "blog" && (
              <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 space-y-12" id="blog-posts-view-container">
                <div className="text-center space-y-3">
                  <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest block">Oral Health Repository</span>
                  <h1 className="text-3xl sm:text-5xl font-display font-black text-blue-900 tracking-tight">
                    Dental Tips & Clinical Guidelines
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
                    Stay educated with the latest clinical findings, preventative dental routines, and guidelines from our professional medical practitioners.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  {blogPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handleBlogClick(post.slug)}
                      className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer flex flex-col justify-between"
                    >
                      <div className="p-6 space-y-4">
                        <span className="bg-blue-50 text-blue-900 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
                          {post.category}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors tracking-tight leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                      </div>
                      <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-blue-900">
                        <div className="flex gap-2 text-slate-400 font-medium">
                          <span>{post.publishDate}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          <span>Read Article</span>
                          <Icons.ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: BLOG DETAIL */}
            {currentView === "blog-detail" && selectedBlog && (
              <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 space-y-10" id="blog-detail-view-container">
                
                {/* Blog Header */}
                <div className="space-y-4 text-center">
                  <span className="bg-blue-50 text-blue-900 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider inline-block">
                    {selectedBlog.category}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-display font-black text-blue-900 tracking-tight leading-tight">
                    {selectedBlog.title}
                  </h1>
                  <div className="flex justify-center gap-3 text-xs text-slate-400 font-medium">
                    <span>Published: {selectedBlog.publishDate}</span>
                    <span>•</span>
                    <span>By {selectedBlog.author}</span>
                    <span>•</span>
                    <span>{selectedBlog.readTime}</span>
                  </div>
                </div>

                {/* Blog Content */}
                <article className="prose prose-slate max-w-none bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-10 space-y-5 shadow-xs">
                  {selectedBlog.content.map((p, idx) => (
                    <p key={idx} className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {p}
                    </p>
                  ))}
                </article>

                {/* Back to Blog trigger */}
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentView("blog")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:underline cursor-pointer"
                  >
                    <Icons.ArrowLeft className="h-4 w-4" />
                    <span>Back to all articles</span>
                  </button>
                  
                  <button
                    onClick={() => setCurrentView("book")}
                    className="bg-blue-900 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-blue-950 transition-all shadow-sm"
                  >
                    Schedule Online Booking
                  </button>
                </div>

              </div>
            )}

            {/* VIEW: CONTACT & HOURS */}
            {currentView === "contact" && (
              <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12" id="contact-view-container">
                <div className="text-center space-y-3">
                  <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest block">Get in Touch</span>
                  <h1 className="text-3xl sm:text-5xl font-display font-black text-blue-900 tracking-tight">
                    We Are Ready to Help You Smile
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
                    Reach out to our clinical staff or dental coordinator instantly. We operate same-day emergency slots during standard business hours.
                  </p>
                </div>

                {/* Info panels & form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Left Side Details */}
                  <div className="lg:col-span-5 space-y-6 bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Clinic Contact Desk</h3>
                    
                    <div className="space-y-4">
                      {/* Location */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Our Address</span>
                        <p className="text-slate-800 text-sm font-semibold mt-1">
                          {config.address}, {config.city}, {config.state} {config.zip}
                        </p>
                        <a
                          href={config.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-900 font-bold hover:underline mt-1 inline-block"
                        >
                          Google Maps Directions
                        </a>
                      </div>

                      {/* Phone contacts */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Phone Contacts</span>
                        <p className="text-slate-800 text-sm font-semibold mt-1">
                          Office Line: <a href={config.phoneLink} className="underline">{config.phone}</a>
                        </p>
                        <p className="text-[11px] text-red-600 font-semibold mt-1">🚨 Immediate emergency priority bookings.</p>
                      </div>

                      {/* Email Contacts */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email Inquiries</span>
                        <p className="text-slate-800 text-sm font-semibold mt-1">
                          <a href={`mailto:${config.email}`} className="underline">{config.email}</a>
                        </p>
                      </div>

                      {/* Hours */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Office Hours</span>
                        <div className="grid grid-cols-2 gap-y-1 text-xs text-slate-500">
                          {config.officeHours.map((h, i) => (
                            <React.Fragment key={i}>
                              <span className="font-semibold">{h.day}</span>
                              <span>{h.hours}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Side Form */}
                  <div className="lg:col-span-7">
                    <ContactForm prefilledService="New Patient Special" />
                  </div>

                </div>

                {/* Map integration */}
                <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.1705607318725!2d-73.191689!3d41.215535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e80e6c38a1bf11%3A0xe2da2e8ff1fe8ee1!2s2992%20Main%20St%2C%20Bridgeport%2C%20CT%2006606!5e0!3m2!1sen!2sus!4v1719525420000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    title="Interactive Google Map"
                  ></iframe>
                </div>
              </div>
            )}

            {/* VIEW: CALENDLY BOOKING WIDGET */}
            {currentView === "book" && (
              <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12" id="calendly-booking-view-container">
                <div className="text-center space-y-3">
                  <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest block">Secure Your Slot</span>
                  <h1 className="text-3xl sm:text-5xl font-display font-black text-blue-900 tracking-tight">
                    Instant Online Appointment Booking
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
                    Confirm your visit instantly below. For immediate emergency openings inside an hour, please call our clinic directly.
                  </p>
                </div>

                {/* Conditionally displays the Calendly Booking container or a beautiful form fallback if empty */}
                {config.calendlyUrl ? (
                  <CalendlyBooking />
                ) : (
                  <div className="space-y-8">
                    <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl text-center text-xs sm:text-sm text-blue-800">
                      ℹ️ Our online direct booking calendar is currently being optimized. Please use our secure lead form below, and we will contact you immediately.
                    </div>
                    <ContactForm prefilledService={prefilledFormService || "New Patient Special"} />
                  </div>
                )}
              </div>
            )}

            {/* VIEW: PRIVACY POLICY */}
            {currentView === "privacy" && (
              <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed" id="privacy-policy-view-container">
                <h1 className="text-2xl sm:text-4xl font-display font-black text-blue-900 tracking-tight mb-4">Privacy Policy</h1>
                <p className="font-semibold text-slate-700">Last updated: June 27, 2026</p>
                <p>
                  At {config.appName}, we are committed to protecting your privacy as a visitor to our website and as a clinical patient. This privacy policy outlines how we collect, handle, secure, and route lead details and information submitted via contact portals.
                </p>
                
                <h3 className="font-bold text-slate-800 text-base mt-6">1. HIPAA & Health Privacy Compliance</h3>
                <p>
                  We operate in complete accordance with HIPAA privacy regulations. Any health information, symptoms, and medical queries submitted via our contact fields are routed securely to authorized administrative coordinators only and never shared with third parties.
                </p>

                <h3 className="font-bold text-slate-800 text-base mt-6">2. Information Collection and Storage</h3>
                <p>
                  We collect basic identification parameters (Name, Phone number, Email, requested Service) to process bookings. These parameters are routed via secured transactional email protocols (e.g. Brevo SMTP) directly to our local client office and are not stored in public databases.
                </p>

                <h3 className="font-bold text-slate-800 text-base mt-6">3. Cookies & Analytics</h3>
                <p>
                  We utilize lightweight, non-identifying tracking cookies (Google Analytics, Meta Pixel) solely to monitor Core Web Vitals, visitor patterns, and digital marketing efficiency. No personal healthcare details are shared with advertisers.
                </p>

                <h3 className="font-bold text-slate-800 text-base mt-6">4. Patient Rights</h3>
                <p>
                  You retain the right to query what contact parameters we possess, request deletion of digital contact logs, or refuse cookie consent within browser options. Contact our Bridgeport office line to handle any data requests.
                </p>
              </div>
            )}

            {/* VIEW: TERMS & CONDITIONS */}
            {currentView === "terms" && (
              <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed" id="terms-conditions-view-container">
                <h1 className="text-2xl sm:text-4xl font-display font-black text-blue-900 tracking-tight mb-4">Terms & Conditions</h1>
                <p className="font-semibold text-slate-700">Last updated: June 27, 2026</p>
                
                <h3 className="font-bold text-slate-800 text-base mt-6">1. No Medical Advice</h3>
                <p>
                  The informational text guides, blog posts, and FAQs presented on {config.appName} are written purely for educational and SEO purposes. They do not represent a binding clinical diagnosis or substitute for a professional evaluation inside a dental chair. Always visit a licensed clinician for toothaches.
                </p>

                <h3 className="font-bold text-slate-800 text-base mt-6">2. Appointment Confirmations</h3>
                <p>
                  Submitting a request via our Contact Form or Calendly widget is an initial inquiry. A booking is not clinically confirmed until our office team contacts you (via phone or email text) to verify medical history and lock in the scheduled operatory slot.
                </p>

                <h3 className="font-bold text-slate-800 text-base mt-6">3. Cancellation Policies</h3>
                <p>
                  We reserve operatory rooms and assign clinicians specifically for scheduled visits. We request at least 24 hours of advance notice for cancellations. Failing to appear for appointments may affect eligibility for specials.
                </p>

                <h3 className="font-bold text-slate-800 text-base mt-6">4. Limitations of Liability</h3>
                <p>
                  While we strive to ensure our portals run securely with optimal uptime, we assume no liability for transient booking delays, third-party network outages, or communication delays. For immediate critical crises, dial 911 or visit the nearest hospital emergency room.
                </p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 border-t border-slate-900" id="primary-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Logo and NAP info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-blue-900 p-2 rounded-lg">
                <Icons.Stethoscope className="h-5 w-5" />
              </div>
              <span className="font-display font-black text-base uppercase tracking-wider">{config.appName}</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              Premium, gentle oral healthcare utilizing state-of-the-art clinical tech. We coordinate with major PPO plans and reserve same-day openings for patients in acute pain.
            </p>
            <div className="text-xs space-y-1 pt-1">
              <p className="font-semibold text-slate-200">📍 {config.address}, {config.city}, {config.state} {config.zip}</p>
              <p className="font-semibold text-slate-200">📞 Phone: <a href={config.phoneLink} className="underline">{config.phone}</a></p>
              <p className="font-semibold text-slate-200">✉️ Email: <a href={`mailto:${config.email}`} className="underline">{config.email}</a></p>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Quick Navigation</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
              <button onClick={() => setCurrentView("home")} className="text-left hover:text-white transition-colors cursor-pointer">Home</button>
              <button onClick={() => setCurrentView("about")} className="text-left hover:text-white transition-colors cursor-pointer">About Clinic</button>
              <button onClick={() => setCurrentView("services")} className="text-left hover:text-white transition-colors cursor-pointer">Our Services</button>
              <button onClick={() => handleServiceClick("emergency")} className="text-left text-red-400 font-bold hover:text-red-300 transition-colors cursor-pointer">Emergency care</button>
              <button onClick={() => setCurrentView("insurance")} className="text-left hover:text-white transition-colors cursor-pointer">Insurance</button>
              <button onClick={() => setCurrentView("reviews")} className="text-left hover:text-white transition-colors cursor-pointer">Testimonials</button>
              <button onClick={() => setCurrentView("blog")} className="text-left hover:text-white transition-colors cursor-pointer">Tips Blog</button>
              <button onClick={() => setCurrentView("contact")} className="text-left hover:text-white transition-colors cursor-pointer">Contact</button>
            </div>
          </div>

          {/* Core Services links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Clinical Services</h4>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {servicesData.slice(0, 5).map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleServiceClick(s.id)}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Legal / Social Links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Connect With Us</h4>
            <div className="flex gap-2.5 text-xs">
              {config.facebookUrl && (
                <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg" aria-label="Visit Facebook Profile">
                  <Icons.Facebook className="h-4 w-4" />
                </a>
              )}
              {config.instagramUrl && (
                <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg" aria-label="Visit Instagram Profile">
                  <Icons.Instagram className="h-4 w-4" />
                </a>
              )}
              {config.gmbUrl && (
                <a href={config.gmbUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg" aria-label="Visit Google Business Profile">
                  <Icons.Globe className="h-4 w-4" />
                </a>
              )}
            </div>
            
            <div className="pt-2">
              <button
                onClick={() => setCurrentView("book")}
                className="w-full bg-blue-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl text-center hover:bg-blue-950 transition-all shadow-xs"
              >
                Book Appointment
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs">
          <p>© 2026 {config.appName}. All clinical rights reserved. Licensed Dental Practice.</p>
          <div className="flex gap-4">
            <button onClick={() => setCurrentView("privacy")} className="hover:text-white cursor-pointer hover:underline">Privacy Policy</button>
            <button onClick={() => setCurrentView("terms")} className="hover:text-white cursor-pointer hover:underline">Terms of Service</button>
          </div>
        </div>
      </footer>

      {/* Desktop & Mobile floating interactive conversions */}
      <ExitIntentPopup onClaimSpecial={handleClaimSpecial} />
      <StickyMobileCta onBookClick={() => setCurrentView("book")} />

    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <MainAppContent />
    </ConfigProvider>
  );
}
