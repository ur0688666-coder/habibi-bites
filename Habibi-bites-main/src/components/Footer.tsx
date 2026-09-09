import React from 'react';
import { Phone, MapPin, ShoppingBag, ArrowUp } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface FooterProps {
  onOrderClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOrderClick }) => {
  const footerLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Our History', href: '#history' },
    { label: 'Menu', href: '#menu' },
    { label: 'Order Now', href: '#order' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Location', href: '#location' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-[#07080a] border-t border-[#1a1f29] pt-16 pb-12 relative overflow-hidden">
      
      {/* Final Call To Action Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#171c26] via-[#1f2633] to-[#171c26] border border-[#d4af37]/30 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          {/* Subtle gold glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              Hungry? Order Your Favorite Bites Today.
            </h3>
            <p className="text-sm sm:text-base text-[#a0aab8]">
              Hot, crunchy, authentic Pakistani burgers, succulent wraps, and seasoned fries are just a click or phone call away.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                id="footer-cta-order-btn"
                onClick={onOrderClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#c59b27] text-[#121417] text-sm sm:text-base font-bold shadow-xl shadow-[#d4af37]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#121417]" />
                <span>Order Now</span>
              </button>

              <a
                href={RESTAURANT_INFO.phoneTel}
                id="footer-cta-call-btn"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#12161e] hover:bg-[#1a202b] border border-[#2f3847] text-[#f3e5ab] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>Call: {RESTAURANT_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1b202a]">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c6d17] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d0f12] rounded-[10px] flex items-center justify-center font-display font-black text-[#f3e5ab] text-base">
                  HB
                </div>
              </div>
              <span className="font-display font-extrabold text-2xl text-white">
                Habibi <span className="text-[#d4af37]">Bites</span>
              </span>
            </div>

            <p className="text-sm text-[#8f9aa9] leading-relaxed max-w-sm">
              Authentic Pakistani kitchen serving freshly handcrafted zinger wraps, spicy burgers, loaded fries, and signature coolers. Made fresh for every craving.
            </p>

            <div className="pt-2">
              <div className="text-xs text-[#737f90] uppercase tracking-wider font-semibold mb-1">
                Direct Restaurant Hotline
              </div>
              <a
                href={RESTAURANT_INFO.phoneTel}
                className="text-lg font-bold text-[#f3e5ab] hover:text-white transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>{RESTAURANT_INFO.phone}</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[#9ea8b7] hover:text-[#f3e5ab] transition-colors py-1 block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Maps Presence (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              Connect & Locate
            </h4>
            <div className="space-y-3">
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#a0aab8] hover:text-[#f3e5ab] transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>View on Google Maps</span>
              </a>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                {/* Facebook Icon */}
                <a
                  href={RESTAURANT_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Habibi Bites on Facebook"
                  className="w-10 h-10 rounded-xl bg-[#141821] border border-[#232a35] hover:border-[#1877f2] flex items-center justify-center text-[#9ea8b7] hover:text-[#1877f2] transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram Icon */}
                <a
                  href={RESTAURANT_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Habibi Bites on Instagram"
                  className="w-10 h-10 rounded-xl bg-[#141821] border border-[#232a35] hover:border-[#e1306c] flex items-center justify-center text-[#9ea8b7] hover:text-[#e1306c] transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6e7887]">
          <div>
            © {new Date().getFullYear()} Habibi Bites. All rights reserved. Authentic Pakistani Fast Food.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#9ea8b7] hover:text-[#f3e5ab] transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </footer>
  );
};
