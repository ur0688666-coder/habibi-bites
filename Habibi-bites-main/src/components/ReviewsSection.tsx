import React from 'react';
import { Star, Quote, Sparkles, CheckCircle } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/restaurantData';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-20 sm:py-28 bg-[#0b0d10] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181d26] border border-[#d4af37]/30 text-xs font-bold text-[#f3e5ab] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Community Love</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            What Our <span className="text-[#d4af37]">Customers</span> Say
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#a2abb9]">
            Real feedback from local diners who experienced the authentic taste, generous portions, and warm hospitality of Habibi Bites.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {CUSTOMER_REVIEWS.map((review, idx) => (
            <div
              key={review.id}
              id={`customer-review-${idx + 1}`}
              className="rounded-3xl bg-[#12161e] border border-[#242c38] p-6 sm:p-8 flex flex-col justify-between relative shadow-xl hover:border-[#d4af37]/40 transition-all duration-300 group"
            >
              {/* Quote Mark Accent */}
              <div className="absolute top-6 right-6 text-[#d4af37]/15 group-hover:text-[#d4af37]/30 transition-colors">
                <Quote className="w-10 h-10" />
              </div>

              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-4 text-[#d4af37]">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Exact Customer Quote */}
                <blockquote className="text-base sm:text-lg text-[#eae6df] font-medium leading-relaxed mb-6 italic">
                  “{review.quote.replace(/^“|”$/g, '')}”
                </blockquote>
              </div>

              {/* Author & Badge Meta */}
              <div className="pt-4 border-t border-[#1e2531] flex items-center justify-between">
                <div>
                  <div className="font-heading font-bold text-white text-sm">
                    {review.author}
                  </div>
                  <div className="text-xs text-[#8c96a5]">
                    Recommended: <span className="text-[#d4af37] font-medium">{review.dishRecommended}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#86efac] bg-[#14261b] px-2.5 py-1 rounded-full border border-[#166534]/50">
                  <CheckCircle className="w-3 h-3" />
                  <span>{review.badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating Callout */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#171c25] via-[#1b222d] to-[#171c25] border border-[#2b3443] p-6 max-w-xl mx-auto text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-1 text-[#d4af37]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <div className="text-xs sm:text-sm text-[#c4ccd7]">
            Rated <span className="text-white font-bold">5.0 / 5.0</span> by local fast-food lovers for flavor, portion size, and price.
          </div>
        </div>

      </div>
    </section>
  );
};
