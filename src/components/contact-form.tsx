import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { useConfig } from "./config-context";
import { servicesData } from "../data/services";

// Zod Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number"),
  email: z.string().email("Please enter a valid email address"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().max(500, "Message cannot exceed 500 characters").optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  prefilledService?: string;
  onSuccessCallback?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ prefilledService = "", onSuccessCallback }) => {
  const { config } = useConfig();
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  
  // Honeypot field for spam prevention
  const [honeypot, setHoneypot] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service: prefilledService,
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Spam Prevention Check: If honeypot is filled, discard or simulate success
    if (honeypot) {
      console.warn("Spam bot submission caught via honeypot.");
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setSubmitStatus("success");
        setStatusMessage("Thank you! Your request was received successfully.");
        reset();
      }, 1000);
      return;
    }

    // Validate using Zod
    const validation = contactSchema.safeParse(data);
    if (!validation.success) {
      setSubmitStatus("error");
      setStatusMessage(validation.error.issues[0]?.message || "Validation failed.");
      return;
    }

    setSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setStatusMessage(result.message || "Thank you! Your booking request was sent successfully.");
        reset();
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      } else {
        setSubmitStatus("error");
        setStatusMessage(result.error || "Failed to submit lead. Please try again or call our office.");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitStatus("error");
      setStatusMessage("Network error. Please call our clinic directly at " + config.phone);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xl max-w-xl mx-auto" id="appointment-form-container">
      <div className="mb-6">
        <h4 className="text-xl font-bold text-slate-900 tracking-tight">Request an Appointment</h4>
        <p className="text-sm text-slate-500 mt-1">Fill out this quick secure form. Our dental coordinator will reach out immediately.</p>
      </div>

      {submitStatus === "success" && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800 text-sm leading-relaxed animate-fade-in" id="form-success-alert">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Submission Confirmed!</span>
            <p className="mt-1">{statusMessage}</p>
            <p className="mt-2 text-xs font-semibold text-emerald-700">Need immediate care? Call us right now at <a href={config.phoneLink} className="underline font-bold">{config.phone}</a></p>
          </div>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm leading-relaxed animate-fade-in" id="form-error-alert">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Submission Failed</span>
            <p className="mt-1">{statusMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Honeypot Spam Prevention (Hidden) */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="website_url_check"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            placeholder="Do not fill this out if you are human"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="form-input-name">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="form-input-name"
            type="text"
            placeholder="John Doe"
            disabled={submitting}
            {...register("name", { required: true })}
            className={`w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm ${errors.name ? "border-red-400 focus:ring-red-100" : ""}`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Phone & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="form-input-phone">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="form-input-phone"
              type="tel"
              placeholder="(203) 555-0199"
              disabled={submitting}
              {...register("phone", { required: true })}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm ${errors.phone ? "border-red-400 focus:ring-red-100" : ""}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="form-input-email">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="form-input-email"
              type="email"
              placeholder="john@example.com"
              disabled={submitting}
              {...register("email", { required: true })}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm ${errors.email ? "border-red-400 focus:ring-red-100" : ""}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        {/* Service Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="form-select-service">
            Service Needed <span className="text-red-500">*</span>
          </label>
          <select
            id="form-select-service"
            disabled={submitting}
            {...register("service", { required: true })}
            className={`w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm ${errors.service ? "border-red-400 focus:ring-red-100" : ""}`}
          >
            <option value="">-- Choose a Service --</option>
            <option value="New Patient Special">New Patient Special ($99 Exam + X-Rays)</option>
            <option value="Emergency Consultation">Emergency Dental Visit (Same Day)</option>
            {servicesData.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service.message}</p>}
        </div>

        {/* Additional Message */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="form-input-message">
            Symptoms or Special Instructions
          </label>
          <textarea
            id="form-input-message"
            rows={3}
            placeholder="Describe your symptoms, oral pain level, or requested times..."
            disabled={submitting}
            {...register("message")}
            className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
          ></textarea>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-900 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-blue-950 active:scale-98 transition-all duration-150 cursor-pointer text-sm shadow-md disabled:bg-blue-900/50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending Secured Request...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Appointment Request</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400 font-medium">
          🔒 Secure & HIPPA-compliant lead routing. Your details are safe with us.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
