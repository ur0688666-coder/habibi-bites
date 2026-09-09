import React from 'react';
import { Flame, BadgePercent, Leaf, HeartHandshake, Sparkles } from 'lucide-react';
import { WHY_CHOOSE_ITEMS } from '../data/restaurantData';

export const WhyChooseSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-6 h-6 text-[#d4af37]" />;
      case 'BadgePercent':
        return <BadgePercent className="w-6 h-6 text-[#d4af37]" />;
      case 'Leaf':
        return <Leaf className="w-6 h-6 text-[#d4af37]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-[#d4af37]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#d4af37]" />;
    }
  };

  return (
    <section id="why-choose" className="py-20 sm:py-28 bg-[#0e1116] relative border-t border-[#1e242f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181d26] border border-[#d4af37]/30 text-xs font-bold text-[#f3e5ab] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>The Habibi Standard</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Why Choose <span className="text-[#d4af37]">Habibi Bites</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#a2abb9]">
            We pour heart and craft into every meal we serve. Here is what sets our kitchen apart.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              id={`why-choose-card-${idx + 1}`}
              className="rounded-2xl bg-[#131720] border border-[#242b37] p-6 sm:p-7 hover:border-[#d4af37]/50 shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1b212c] border border-[#2c3545] flex items-center justify-center mb-5 group-hover:border-[#d4af37]/40 group-hover:scale-110 transition-all shadow-md">
                {getIcon(item.iconName)}
              </div>

              <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#f3e5ab] transition-colors mb-2">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#9ba4b2] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
