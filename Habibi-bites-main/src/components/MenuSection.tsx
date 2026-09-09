import React, { useState } from 'react';
import { ShoppingBag, Flame, Star, Sparkles } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS, RESTAURANT_INFO } from '../data/restaurantData';
import { MenuItem } from '../types';

interface MenuSectionProps {
  onSelectItemForOrder: (itemId: string, sizeName: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectItemForOrder }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  // Track selected size for each menu card
  const [itemSelectedSizes, setItemSelectedSizes] = useState<Record<string, string>>({});

  const filteredItems = selectedCategory === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  const getSelectedSize = (item: MenuItem) => {
    return itemSelectedSizes[item.id] || item.sizes[0]?.name || 'Standard';
  };

  const getPriceForSelectedSize = (item: MenuItem) => {
    const currentSize = getSelectedSize(item);
    const sizeObj = item.sizes.find((s) => s.name === currentSize);
    return sizeObj ? sizeObj.price : item.basePrice;
  };

  const handleSizeChange = (itemId: string, sizeName: string) => {
    setItemSelectedSizes((prev) => ({
      ...prev,
      [itemId]: sizeName,
    }));
  };

  return (
    <section id="menu" className="py-20 sm:py-28 bg-[#0b0d10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181d26] border border-[#d4af37]/30 text-xs font-bold text-[#f3e5ab] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Handcrafted With Passion</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            The Habibi <span className="text-[#d4af37]">Menu</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#a2abb9]">
            Explore our mouthwatering selection of fresh wraps, crispy zinger fillets, gourmet patties, golden sides, and cold beverages.
          </p>
        </div>

        {/* Category Filter Pills (Scrollable on mobile) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#121417] shadow-lg shadow-[#d4af37]/25 font-bold scale-[1.03]'
                    : 'bg-[#151921] text-[#c2c8d2] hover:text-white hover:bg-[#1f242e] border border-[#262c37]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const currentSize = getSelectedSize(item);
            const currentPrice = getPriceForSelectedSize(item);

            return (
              <div
                key={item.id}
                id={`menu-card-${item.id}`}
                className="group flex flex-col rounded-2xl bg-[#12161d] border border-[#242b36] hover:border-[#d4af37]/50 shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Food Image Container */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#181d26]">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-[1.04]"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12161d] via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.popular && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#d4af37] text-[#121417] text-[11px] font-bold shadow-md">
                        <Star className="w-3 h-3 fill-current" />
                        Popular
                      </span>
                    )}
                    {item.spicy && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#b91c1c] text-white text-[11px] font-bold shadow-md">
                        <Flame className="w-3 h-3" />
                        Spicy
                      </span>
                    )}
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#0b0d10]/80 backdrop-blur-sm border border-white/10 text-[11px] text-[#f3e5ab] font-medium">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-heading font-bold text-lg sm:text-xl text-white group-hover:text-[#f3e5ab] transition-colors leading-snug">
                        {item.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="font-display font-extrabold text-lg text-[#d4af37]">
                          {RESTAURANT_INFO.currency} {currentPrice}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#9da6b4] leading-relaxed line-clamp-3 mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Controls: Size Selector & Order Button */}
                  <div className="pt-4 border-t border-[#202632] space-y-3">
                    {item.sizes.length > 1 && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-[#7c8696] uppercase tracking-wider block">
                          Select Size / Portion:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {item.sizes.map((s) => {
                            const isSizeActive = currentSize === s.name;
                            return (
                              <button
                                key={s.name}
                                type="button"
                                onClick={() => handleSizeChange(item.id, s.name)}
                                className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors cursor-pointer ${
                                  isSizeActive
                                    ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#f3e5ab] font-bold'
                                    : 'bg-[#181d26] border border-[#2c3442] text-[#a0aab8] hover:border-white/20'
                                }`}
                              >
                                {s.name} ({RESTAURANT_INFO.currency} {s.price})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      id={`order-item-btn-${item.id}`}
                      onClick={() => onSelectItemForOrder(item.id, currentSize)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1c222c] hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-[#c59b27] hover:text-[#121417] text-white border border-[#2f3847] hover:border-transparent text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all group/btn cursor-pointer shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37] group-hover/btn:text-[#121417] transition-colors" />
                      <span>Order Now</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on owner customizability */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[#717b8b]">
            * Prices and availability subject to change. Custom orders and special preparation notes can be submitted through our online order desk below.
          </p>
        </div>
      </div>
    </section>
  );
};
