import React, { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { MenuSection } from './components/MenuSection';
import { OrderSection } from './components/OrderSection';
import { ReviewsSection } from './components/ReviewsSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { LocationSection } from './components/LocationSection';
import { SocialSection } from './components/SocialSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { GeminiChatbot } from './components/GeminiChatbot';
import { AuthProvider } from './context/AuthContext';
import { Phone, ShoppingBag } from 'lucide-react';
import { RESTAURANT_INFO } from './data/restaurantData';

export default function App() {
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [selectedItemSize, setSelectedItemSize] = useState<string | undefined>();

  const scrollToOrder = useCallback(() => {
    const orderElem = document.getElementById('order');
    if (orderElem) {
      orderElem.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToMenu = useCallback(() => {
    const menuElem = document.getElementById('menu');
    if (menuElem) {
      menuElem.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSelectItemForOrder = useCallback((itemId: string, sizeName: string) => {
    setSelectedItemId(itemId);
    setSelectedItemSize(sizeName);
    scrollToOrder();
  }, [scrollToOrder]);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0b0d10] text-[#eae7e1] font-sans relative selection:bg-[#c59b27]/30 selection:text-[#f3e5ab]">
        
        {/* Sticky Modern Navbar */}
        <Navbar onOrderClick={scrollToOrder} />

        {/* Main Content Sections */}
        <main id="main-content">
          {/* 1. Hero Section */}
          <Hero onOrderClick={scrollToOrder} onMenuClick={scrollToMenu} />

          {/* 2. Our History / About Us */}
          <AboutSection />

          {/* 3. Menu Section */}
          <MenuSection onSelectItemForOrder={handleSelectItemForOrder} />

          {/* 4. Online Order Section */}
          <OrderSection
            preselectedItemId={selectedItemId}
            preselectedSize={selectedItemSize}
          />

          {/* 5. Customer Reviews */}
          <ReviewsSection />

          {/* 6. Why Choose Habibi Bites */}
          <WhyChooseSection />

          {/* 7. Location (Find Us) */}
          <LocationSection />

          {/* 8. Social Media (Follow Habibi Bites) */}
          <SocialSection />

          {/* 9. Basic Q&A / FAQ */}
          <FAQSection />
        </main>

        {/* 10. Contact / Footer */}
        <Footer onOrderClick={scrollToOrder} />

        {/* Multi-turn Gemini AI Chatbot with Search & Maps Grounding */}
        <GeminiChatbot />

        {/* Mobile Sticky Quick Order Action Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f12]/95 backdrop-blur-lg border-t border-[#222936] p-3 flex items-center gap-3">
          <a
            href={RESTAURANT_INFO.phoneTel}
            className="flex-1 py-3 px-3 rounded-xl bg-[#171b22] border border-[#2b3341] text-xs font-bold text-[#f3e5ab] flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Call Us</span>
          </a>

          <button
            type="button"
            onClick={scrollToOrder}
            className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#121417] text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </AuthProvider>
  );
}
