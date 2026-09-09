import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { FAQ_ITEMS } from '../data/restaurantData';

export const FAQSection: React.FC = () => {
  const [openItemIds, setOpenItemIds] = useState<Record<string, boolean>>({
    'faq-1': true, // First open by default for immediate helpful scan
  });

  const toggleFAQ = (id: string) => {
    setOpenItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#0b0d10] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181d26] border border-[#d4af37]/30 text-xs font-bold text-[#f3e5ab] uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Got Questions?</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Frequently Asked <span className="text-[#d4af37]">Questions</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#a2abb9]">
            Everything you need to know about placing an order, customizing your bites, delivery confirmation, and finding our kitchen.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = !!openItemIds[item.id];

            return (
              <div
                key={item.id}
                id={`faq-item-${idx + 1}`}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#131720] border-[#d4af37]/40 shadow-xl'
                    : 'bg-[#10131a] border-[#222936] hover:border-[#2f3849]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-white">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl bg-[#191f2a] border border-[#2a3444] flex items-center justify-center shrink-0 text-[#d4af37] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#d4af37]/20 border-[#d4af37]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#9ea9b8] leading-relaxed border-t border-[#1a212c]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
