import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const SocialSection: React.FC = () => {
  return (
    <section id="social" className="py-16 sm:py-24 bg-[#0e1116] relative border-t border-b border-[#1f2530]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181d26] border border-[#d4af37]/30 text-xs font-bold text-[#f3e5ab] uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Stay Connected</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
          Follow <span className="text-[#d4af37]">Habibi Bites</span>
        </h2>

        <p className="mt-3 text-sm sm:text-base text-[#a2abb9] max-w-xl mx-auto mb-10">
          Join our food community online for daily behind-the-scenes stories, limited seasonal deals, and mouth-watering sneak peeks!
        </p>

        {/* Social Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {/* Facebook Link */}
          <a
            href={RESTAURANT_INFO.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="social-facebook-link"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#1877f2]/10 hover:bg-[#1877f2]/20 border border-[#1877f2]/40 hover:border-[#1877f2] text-white font-bold flex items-center justify-center gap-3 transition-all duration-300 group shadow-lg hover:scale-[1.02] cursor-pointer"
          >
            {/* Facebook SVG */}
            <div className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white shadow-md">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div className="text-left">
              <span className="block text-xs text-[#a0aab8]">Connect on</span>
              <span className="block text-sm sm:text-base font-bold text-white group-hover:text-[#93c5fd] transition-colors">
                Facebook Page
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#a0aab8] group-hover:text-white transition-colors ml-2" />
          </a>

          {/* Instagram Link */}
          <a
            href={RESTAURANT_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="social-instagram-link"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#e1306c]/10 to-[#fd1d1d]/10 hover:from-[#e1306c]/20 hover:to-[#fd1d1d]/20 border border-[#e1306c]/40 hover:border-[#e1306c] text-white font-bold flex items-center justify-center gap-3 transition-all duration-300 group shadow-lg hover:scale-[1.02] cursor-pointer"
          >
            {/* Instagram SVG */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] flex items-center justify-center text-white shadow-md">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div className="text-left">
              <span className="block text-xs text-[#a0aab8]">Follow on</span>
              <span className="block text-sm sm:text-base font-bold text-white group-hover:text-[#f472b6] transition-colors">
                @habibi_bites_qds
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#a0aab8] group-hover:text-white transition-colors ml-2" />
          </a>

        </div>

      </div>
    </section>
  );
};
