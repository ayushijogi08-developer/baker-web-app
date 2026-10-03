import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, MessageSquarePlus, X, Send, Sparkles } from "lucide-react";
import api from "../../services/api";
import { Button } from "./Button";

export interface ReviewItem {
  id: string;
  name: string;
  location?: string;
  comment: string;
  rating: number;
  isVerified?: boolean;
  createdAt?: string;
}

const DEFAULT_TESTIMONIALS: ReviewItem[] = [
  {
    id: "t1",
    name: "Pooja Deshmukh",
    location: "Ramdas Peth, Akola",
    comment: "The Belgian Truffle Cake for my son's birthday was unbelievably delicious! Super moist, rich dark chocolate ganache and 100% eggless. Highly recommended!",
    rating: 5,
    isVerified: true
  },
  {
    id: "t2",
    name: "Aniket Joshi",
    location: "Civil Lines, Akola",
    comment: "Ordered fresh Artisanal Garlic Sourdough and Cheesecake for family evening. Delivery arrived hot in under 45 mins. Hands down the best bakery in Akola!",
    rating: 5,
    isVerified: true
  },
  {
    id: "t3",
    name: "Sneha Kulkarni",
    location: "Jawaar Nagar, Akola",
    comment: "The Fresh Alphonso Mango Cake tasted divine! Natural mango flavor with zero artificial sweetness. Everyone at the party was asking where we ordered it from.",
    rating: 5,
    isVerified: true
  },
  {
    id: "t4",
    name: "Dr. Rahul Wankhede",
    location: "Gorakshan Road, Akola",
    comment: "Outstanding presentation and packaging! The customized message on the red velvet cake was written so neatly. Will order for every family celebration.",
    rating: 5,
    isVerified: true
  }
];

const AVATAR_COLORS = [
  "bg-amber-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-blue-600",
  "bg-teal-600",
  "bg-indigo-600"
];

export const TestimonialSlider: React.FC<{ productId?: string }> = ({ productId }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_TESTIMONIALS);
  const [index, setIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  // Review Form State
  const [formData, setFormData] = useState({
    name: "",
    location: "Akola",
    rating: 5,
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  // Fetch Reviews from Database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url = productId ? `/reviews?productId=${productId}` : "/reviews";
        const res = await api.get(url);
        if (res.data && res.data.length > 0) {
          setReviews(res.data);
        }
      } catch (err) {
        console.error("Error loading reviews from database:", err);
      }
    };
    fetchReviews();
  }, [productId]);

  // Auto-play Slider
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const next = () => setIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      setFormError("Please enter your name and honest review.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const res = await api.post("/reviews", {
        name: formData.name.trim(),
        location: formData.location.trim() || "Akola",
        rating: formData.rating,
        comment: formData.comment.trim(),
        productId: productId || null
      });

      const newReview = res.data;
      setReviews((prev) => [newReview, ...prev]);
      setIndex(0); // Slide to newly posted review
      setIsModalOpen(false);
      setFormData({ name: "", location: "Akola", rating: 5, comment: "" });
      
      // Toast Celebration
      setToastMessage("Thank you! Your review has been published 🎉");
      setTimeout(() => setToastMessage(""), 4000);
    } catch (err) {
      console.error("Error submitting review:", err);
      setFormError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const current = reviews[index] || DEFAULT_TESTIMONIALS[0];

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 md:p-12 shadow-md relative overflow-hidden">
      {/* Background Decorative Watermark Quote */}
      <Quote className="absolute -top-4 -right-4 w-40 h-40 text-[var(--border-color)]/30 pointer-events-none stroke-[1]" />

      {/* Success Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto space-y-6 relative z-10 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              Real Customer Love
            </span>
            <h2 className="font-serif-heading font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-0.5">
              What Akola Cake Lovers Say
            </h2>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="sm"
            className="font-bold shadow-xs cursor-pointer shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4 mr-1.5" /> Write a Review
          </Button>
        </div>

        {/* Carousel Content */}
        <div className="min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id || index}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Star Rating */}
              <div className="flex items-center justify-center gap-1 text-amber-400">
                {Array.from({ length: current.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Comment Text */}
              <p className="text-base sm:text-lg text-[var(--text-primary)] font-serif-heading italic leading-relaxed max-w-2xl mx-auto">
                "{current.comment}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className={`w-10 h-10 rounded-full ${AVATAR_COLORS[index % AVATAR_COLORS.length]} text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0`}>
                  {(current.name || "C").charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-bold text-xs sm:text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                    <span>{current.name}</span>
                    {current.isVerified !== false && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)]">{current.location || "Akola"}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {reviews.length > 1 && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            <div className="flex items-center gap-1.5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === i
                      ? "w-6 bg-[var(--accent-primary)]"
                      : "w-2 bg-[var(--border-color)] hover:bg-[var(--text-muted)]"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* WRITE A REVIEW MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-5 relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                    Share Your Experience
                  </span>
                  <h3 className="font-serif-heading font-extrabold text-xl text-[var(--text-primary)]">
                    Write a Customer Review
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-bold">
                  {formError}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* Rating Selector */}
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= formData.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-500 ml-2">
                      {formData.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Pooja Deshmukh"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">
                      City / Area in Akola
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Ramdas Peth, Akola"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-bold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Your Honest Feedback & Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Tell us about the taste, packaging, delivery speed, or custom cake design..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-medium text-xs leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    size="md"
                    className="font-bold shadow-md cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Publishing..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1.5" /> Submit Review
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
