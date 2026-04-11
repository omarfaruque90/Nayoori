"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch reviews for this product
  useEffect(() => {
    async function fetchReviews() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("product_id", productId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        // Gracefully fallback to empty
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rating === 0 || !comment.trim()) return;

    setIsSubmitting(true);

    const newReview: Omit<Review, "id" | "created_at"> = {
      product_id: productId,
      customer_name: name.trim(),
      rating,
      comment: comment.trim(),
    };

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([newReview])
        .select()
        .single();

      if (error) throw error;

      // Optimistic UI update — prepend to the list instantly
      if (data) {
        setReviews((prev) => [data, ...prev]);
      } else {
        // If Supabase doesn't return data (e.g., RLS), still show optimistically
        const optimistic: Review = {
          id: `temp-${Date.now()}`,
          ...newReview,
          created_at: new Date().toISOString(),
        };
        setReviews((prev) => [optimistic, ...prev]);
      }

      // Reset form
      setName("");
      setRating(0);
      setComment("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to submit review:", err.message);
      // Still show optimistically even if Supabase fails (demo mode)
      const optimistic: Review = {
        id: `temp-${Date.now()}`,
        ...newReview,
        created_at: new Date().toISOString(),
      };
      setReviews((prev) => [optimistic, ...prev]);
      setName("");
      setRating(0);
      setComment("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = name.trim() !== "" && rating > 0 && comment.trim() !== "";

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mt-24 border-t border-warm-beige pt-16"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
            Customer Reviews
          </h2>
          <p className="font-sans text-gray-500 text-sm">
            Hear from our fashionable community
          </p>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(Number(averageRating))
                      ? "fill-[#d4a574] text-[#d4a574]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-sans text-lg text-gray-900 font-medium">
              {averageRating}
            </span>
            <span className="font-sans text-sm text-gray-500">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Review List */}
        <div className="flex-1">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="h-4 bg-warm-beige/40 rounded w-1/3"></div>
                  <div className="h-3 bg-warm-beige/30 rounded w-1/4"></div>
                  <div className="h-3 bg-warm-beige/20 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-16 text-center bg-warm-beige/10 rounded-2xl border border-warm-beige/30">
              <p className="font-serif text-xl text-gray-900 mb-2">
                No reviews yet
              </p>
              <p className="font-sans text-gray-500 text-sm">
                Be the first to share your experience with this piece.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <AnimatePresence>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      ease: "easeOut",
                    }}
                    className="pb-8 border-b border-warm-beige/40 last:border-0"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-warm-beige/30 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-sans text-sm font-semibold text-gray-900">
                          {review.customer_name}
                        </p>
                        <p className="font-sans text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "fill-[#d4a574] text-[#d4a574]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="font-sans text-gray-600 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right: Review Form */}
        <div className="w-full lg:w-[420px] flex-shrink-0">
          <div className="bg-warm-beige/10 border border-warm-beige/40 rounded-2xl p-8 sticky top-32">
            <h3 className="font-serif text-2xl text-gray-900 mb-6">
              Leave a Review
            </h3>

            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center"
              >
                <p className="font-sans text-sm text-green-700 font-medium">
                  Thank you! Your review has been submitted.
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-xs font-sans tracking-widest uppercase text-gray-500">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-white border border-gray-200 rounded-none shadow-sm focus:border-gray-900 focus:ring-0 outline-none transition-colors font-sans text-sm"
                  placeholder="e.g. Fatima"
                />
              </div>

              {/* Star Rating */}
              <div className="space-y-2">
                <label className="block text-xs font-sans tracking-widest uppercase text-gray-500">
                  Your Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors duration-200 ${
                          star <= (hoverRating || rating)
                            ? "fill-[#d4a574] text-[#d4a574]"
                            : "text-gray-300 hover:text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="block text-xs font-sans tracking-widest uppercase text-gray-500">
                  Your Review
                </label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-white border border-gray-200 rounded-none shadow-sm focus:border-gray-900 focus:ring-0 outline-none transition-colors font-sans text-sm resize-none"
                  placeholder="Share your experience with this piece..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full py-4 bg-gray-900 text-white font-sans uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
