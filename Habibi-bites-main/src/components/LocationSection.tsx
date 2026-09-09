import React from 'react';
import { MapPin, Navigation, Phone, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-20 sm:py-28 bg-[#0b0d10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181d26] border border-[#d4af37]/30 text-xs font-bold text-[#f3e5ab] uppercase tracking-wider mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Visit Us In Person</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Find <span className="text-[#d4af37]">Us</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#a2abb9]">
            Drop by our restaurant for fresh takeaway bites, or get exact driving directions directly on Google Maps.
          </p>
        </div>

        {/* Location Showcase Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#12161d] border border-[#242c38] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Visual Map Stylized Preview (7 cols) */}
            <div className="md:col-span-7 relative min-h-[280px] sm:min-h-[340px] bg-[#161a22] flex flex-col items-center justify-center p-8 text-center border-b md:border-b-0 md:border-r border-[#202734] overflow-hidden">
              {/* Decorative Map Pattern Background */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:18px_18px]" />
              
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] mx-auto flex items-center justify-center shadow-lg shadow-[#d4af37]/20">
                  <MapPin className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-display font-bold text-2xl text-white">Habibi Bites</h3>
                  <p className="text-xs text-[#d4af37] font-semibold mt-1">Local Pakistani Kitchen & Takeaway</p>
                </div>

                <p className="text-xs text-[#9aa4b2] max-w-sm mx-auto">
                  Click below to open our exact pin on Google Maps for real-time navigation and driving directions.
                </p>

                {/* Prominent "Get Directions" Button */}
                <a
                  href={RESTAURANT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="get-directions-btn"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#c59b27] text-[#121417] text-sm font-bold shadow-lg shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Practical Information (5 cols) */}
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#141821] space-y-6">
              <div className="space-y-5">
                <div className="border-b border-[#212835] pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] block mb-1">
                    Direct Contact
                  </span>
                  <a
                    href={RESTAURANT_INFO.phoneTel}
                    className="inline-flex items-center gap-2 text-white hover:text-[#f3e5ab] text-base font-bold transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#d4af37]" />
                    <span>{RESTAURANT_INFO.phone}</span>
                  </a>
                </div>

                <div className="border-b border-[#212835] pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] block mb-1">
                    Operating Hours
                  </span>
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <Clock className="w-4 h-4 text-[#d4af37]" />
                    <span>{RESTAURANT_INFO.serviceHours}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] block mb-1">
                    Delivery & Takeaway
                  </span>
                  <div className="flex items-start gap-2 text-xs text-[#a0aab8] leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-[#86efac] shrink-0 mt-0.5" />
                    <span>Hot delivery straight to your doorstep or fast counter takeaway ready in minutes.</span>
                  </div>
                </div>
              </div>

              {/* Verified Pin Notice */}
              <div className="p-3.5 rounded-xl bg-[#0b0d10] border border-[#202734] text-[11px] text-[#788394]">
                📍 Verified location pinned on Google Maps. Follow the live map link for turn-by-turn navigation.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
