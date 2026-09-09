import React from 'react';
import { Heart, Flame, ShieldCheck, Users, Sparkles, UtensilsCrossed } from 'lucide-react';
import kitchenImg from '../assets/images/habibi_kitchen_craft_1788857037940.jpg';

export const AboutSection: React.FC = () => {
  return (
    <section id="history" className="py-20 sm:py-28 bg-[#0e1116] relative overflow-hidden border-t border-b border-[#1f242d]">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Showcase (5 Cols on LG) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#2b3341] shadow-2xl group">
              <img
                src={kitchenImg}
                alt="Habibi Bites kitchen craft: preparing fresh Pakistani spices and flame-grilled wraps"
                className="w-full h-[420px] sm:h-[500px] object-cover object-center group-hover:scale-105 transition-transform duration-700 filter contrast-[1.05]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-transparent to-transparent opacity-80" />

              {/* Floating Quality Callout */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#141820]/90 backdrop-blur-md border border-[#d4af37]/30 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">Every Batch Made Fresh</div>
                    <div className="text-sm font-bold text-white">No Preservatives. 100% Halal & Pure.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent badge behind */}
            <div className="hidden sm:block absolute -top-4 -left-4 w-28 h-28 border-t-2 border-l-2 border-[#d4af37]/40 rounded-tl-2xl pointer-events-none" />
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-28 h-28 border-b-2 border-r-2 border-[#d4af37]/40 rounded-br-2xl pointer-events-none" />
          </div>

          {/* Narrative Content (7 Cols on LG) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181d26] border border-[#d4af37]/30 text-xs font-bold text-[#f3e5ab] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Authentic Pakistani Heritage</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Our <span className="text-[#d4af37]">History</span> & Passion
            </h2>

            <p className="text-base sm:text-lg text-[#d2d8e3] leading-relaxed">
              Habibi Bites was born from a simple yet powerful commitment: to celebrate the vibrant, bold street food culture of Pakistan and elevate it into an extraordinary culinary experience that anyone in our community can relish.
            </p>

            <p className="text-sm sm:text-base text-[#a0aab8] leading-relaxed">
              We started with a single promise to our neighborhood: never compromise on ingredient freshness, marinate every single cut of chicken with authentic hand-ground Pakistani spices, and keep our prices warmly accessible. From our iconic golden crunchy Zinger Burgers to our smoky BBQ Tikka Wraps dripping in freshly blended garlic yogurt sauces, every bite is cooked to order with deep culinary pride.
            </p>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#141820] border border-[#232934] hover:border-[#d4af37]/40 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <UtensilsCrossed className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-bold text-white text-sm">Fresh Ingredients</span>
                </div>
                <p className="text-xs text-[#9ba4b2] leading-normal">
                  Crisp vegetables chopped daily, top-grade poultry marinated overnight, and proprietary sauces whipped fresh every morning.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141820] border border-[#232934] hover:border-[#d4af37]/40 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-bold text-white text-sm">Affordable Prices</span>
                </div>
                <p className="text-xs text-[#9ba4b2] leading-normal">
                  Gourmet quality should never be out of reach. We price generously so families and students can feast heartily.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141820] border border-[#232934] hover:border-[#d4af37]/40 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-bold text-white text-sm">Friendly Service</span>
                </div>
                <p className="text-xs text-[#9ba4b2] leading-normal">
                  True Pakistani hospitality means you are treated like family from the moment you call or place an order.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141820] border border-[#232934] hover:border-[#d4af37]/40 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-bold text-white text-sm">Serving the Local Community</span>
                </div>
                <p className="text-xs text-[#9ba4b2] leading-normal">
                  Rooted locally, we take pride in feeding our neighbors with warmth, consistency, and big irresistible flavors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
