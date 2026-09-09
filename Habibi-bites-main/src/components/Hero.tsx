import React from 'react';
import { Phone, ArrowRight, MapPin, Sparkles, Clock, Utensils } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import heroFoodImg from '../assets/images/habibi_hero_food_1788857017531.jpg';

interface HeroProps {
  onOrderClick: () => void;
  onMenuClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick, onMenuClick }) => {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#0b0d10]"
    >
      {/* Background Ambience & Food Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroFoodImg}
          alt="Gourmet Pakistani feast by Habibi Bites with crispy zinger burger, fresh loaded wraps, and seasoned golden fries"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-[1.08]"
          referrerPolicy="no-referrer"
        />
        {/* Luxury Radial & Dark Charcoal Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d10] via-[#0b0d10]/85 to-transparent sm:w-3/4" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,175,55,0.12),transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          {/* Authentic Local Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#181c24]/90 border border-[#d4af37]/30 backdrop-blur-md mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
            <span className="text-xs font-semibold text-[#f3e5ab] tracking-wider uppercase">
              Authentic Pakistani Fast-Food Kitchen
            </span>
          </div>

          {/* Restaurant Main Name */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-none">
            Habibi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5c05b] via-[#d4af37] to-[#f3e5ab]">Bites</span>
          </h1>

          {/* Tagline */}
          <p className="mt-4 font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-[#faf8f5] tracking-tight">
            “Big Flavour. Fresh Bites. Made for You.”
          </p>

          {/* Short Description */}
          <p className="mt-4 text-base sm:text-lg text-[#c2c8d2] leading-relaxed max-w-2xl">
            {RESTAURANT_INFO.shortDescription}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              id="hero-order-now-btn"
              onClick={onOrderClick}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#c59b27] text-[#121417] text-base font-bold shadow-xl shadow-[#d4af37]/25 hover:shadow-[#d4af37]/45 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4 text-[#121417]" />
            </button>

            <button
              type="button"
              id="hero-view-menu-btn"
              onClick={onMenuClick}
              className="px-8 py-4 rounded-xl bg-[#171b22]/90 hover:bg-[#202631] border border-[#343d4d] text-white text-base font-semibold hover:border-[#d4af37]/50 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Utensils className="w-4 h-4 text-[#d4af37]" />
              <span>View Menu</span>
            </button>
          </div>

          {/* Contact and Map Row */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-[#c8ced8]">
            {/* Phone Clickable */}
            <a
              href={RESTAURANT_INFO.phoneTel}
              id="hero-phone-link"
              className="inline-flex items-center gap-2 text-[#f3e5ab] hover:text-white transition-colors group font-semibold"
            >
              <span className="p-2 rounded-lg bg-[#1a1f28] border border-[#2b3341] group-hover:border-[#d4af37]/60 transition-colors">
                <Phone className="w-4 h-4 text-[#d4af37]" />
              </span>
              <span>{RESTAURANT_INFO.phone}</span>
            </a>

            {/* Google Maps Link */}
            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-maps-link"
              className="inline-flex items-center gap-2 text-[#a8b1c0] hover:text-[#f3e5ab] transition-colors group"
            >
              <span className="p-2 rounded-lg bg-[#1a1f28] border border-[#2b3341] group-hover:border-[#d4af37]/60 transition-colors">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
              </span>
              <span>Find Us on Google Maps ↗</span>
            </a>

            {/* Service Timing */}
            <div className="inline-flex items-center gap-2 text-[#929aa7] text-xs">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]/80" />
              <span>{RESTAURANT_INFO.serviceHours}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
