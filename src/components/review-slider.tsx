import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useConfig } from "./config-context";

interface Review {
  id: string;
  author: string;
  stars: number;
  date: string;
  text: string;
  treatment: string;
}

const reviews: Review[] = [
  {
    id: "rev1",
    author: "Jessica M.",
    stars: 5,
    date: "1 week ago",
    text: "I woke up with the most excruciating toothache of my life. I called Bridgeport Dentists first thing at 8 AM and they were able to get me a same-day appointment by 10:30 AM! Dr. and the team were so gentle. Turns out I needed a root canal, which was completely painless. Absolute lifesavers!",
    treatment: "Emergency Root Canal"
  },
  {
    id: "rev2",
    author: "David R.",
    stars: 5,
    date: "3 weeks ago",
    text: "Super clean office and highly professional staff. I have severe dental anxiety, but the hygienist explained everything she was doing and made sure I was comfortable the entire time. The deep cleaning was thorough and painless. Highly recommend this practice for family dental care!",
    treatment: "Preventive Cleaning & Exam"
  },
  {
    id: "rev3",
    author: "Samantha K.",
    stars: 5,
    date: "1 month ago",
    text: "I recently finished my cosmetic smile makeover here with custom porcelain veneers. I am absolutely blown away by the results! They look so natural and I can finally smile in photos without feeling self-conscious. Excellent investment, and they helped me set up a low-interest monthly payment plan too.",
    treatment: "Cosmetic Porcelain Veneers"
  },
  {
    id: "rev4",
    author: "Robert T.",
    stars: 5,
    date: "2 months ago",
    text: "Getting a dental implant was a big decision for me. The doctors explained the entire 3D planning process so clearly and executed it flawlessly. The implant feels and functions exactly like my real teeth. If you need implants in Bridgeport, this is the place to go.",
    treatment: "Single Tooth Dental Implant"
  },
  {
    id: "rev5",
    author: "Elena G.",
    stars: 5,
    date: "3 months ago",
    text: "My 6-year-old was terrified of going to the dentist, but the kids-friendly team here did an amazing job. They made the appointment fun, showed her all the tools like toys, and gave her a custom certificate. This office is officially our dental home now!",
    treatment: "Pediatric Preventive Visit"
  }
];

export const ReviewSlider: React.FC = () => {
  const { config } = useConfig();
  const [activeIndex, setActiveIndex] = useState(0);

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-sm max-w-3xl mx-auto" id="reviews-slider-component">
      {/* Top Google Rating Summary Block */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div className="flex items-center gap-3">
          {/* Simulated Google Logo (SVG stylized) */}
          <div className="bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-xs flex items-center justify-center font-bold text-lg select-none">
            <span className="text-blue-600">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-600">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-slate-900 font-extrabold text-2xl leading-none">{config.googleRating}</span>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Based on {config.googleReviews}+ Verified Google Reviews</p>
          </div>
        </div>
        <a
          href={config.gmbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-white text-slate-700 font-semibold border border-slate-200 px-4 py-2 rounded-xl text-xs hover:bg-slate-100 transition-colors shadow-xs"
        >
          <span>Write a Review</span>
        </a>
      </div>

      {/* Testimonial Active Display Card */}
      <div className="relative min-h-[220px] flex flex-col justify-between" id="active-review-card">
        <div>
          {/* Stars & Verification */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex text-amber-500">
              {[...Array(reviews[activeIndex].stars)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="h-3 w-3" />
              <span>Verified Patient</span>
            </div>
          </div>

          {/* Review Text */}
          <blockquote className="text-slate-700 italic text-sm sm:text-base leading-relaxed mb-4">
            "{reviews[activeIndex].text}"
          </blockquote>
        </div>

        {/* Author details */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
          <div>
            <cite className="font-bold text-slate-900 not-italic text-sm sm:text-base">{reviews[activeIndex].author}</cite>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <span>{reviews[activeIndex].date}</span>
              <span>•</span>
              <span className="font-semibold text-slate-500">Treatment: {reviews[activeIndex].treatment}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-1">
            <button
              onClick={prevReview}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-900 text-slate-500 transition-all cursor-pointer"
              aria-label="Previous patient review"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextReview}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-900 text-slate-500 transition-all cursor-pointer"
              aria-label="Next patient review"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSlider;
