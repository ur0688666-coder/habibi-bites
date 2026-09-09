import React, { useState, useEffect } from 'react';
import { Phone, Menu as MenuIcon, X, MapPin, ShoppingBag, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOrderClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOrderClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loginWithGoogle, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Our History', href: '#history' },
    { label: 'Menu', href: '#menu' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Location', href: '#location' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0d0f12]/95 backdrop-blur-md border-b border-[#252a33] shadow-xl py-3'
          : 'bg-gradient-to-b from-[#0b0d10]/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, '#home')}
          className="flex items-center gap-3 group focus:outline-none"
          id="nav-brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c6d17] p-0.5 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d0f12] rounded-[10px] flex items-center justify-center font-display font-black text-[#f3e5ab] text-lg tracking-wider">
              HB
            </div>
          </div>
          <div>
            <div className="font-display font-extrabold text-xl sm:text-2xl tracking-wide text-white group-hover:text-[#f3e5ab] transition-colors">
              Habibi <span className="text-[#d4af37]">Bites</span>
            </div>
            <div className="text-[10px] text-[#a1a8b5] tracking-wider uppercase font-medium -mt-1 hidden sm:block">
              Pakistani Kitchen & Wraps
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="px-3 py-2 text-sm font-medium text-[#c8ced8] hover:text-[#f3e5ab] hover:bg-white/5 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Google Sign-in / User Profile (Desktop) */}
          {user ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                id="user-profile-menu-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171b22] hover:bg-[#202630] border border-[#2b323d] text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full border border-[#d4af37]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center text-xs font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="max-w-[100px] truncate text-[#f3e5ab]">
                  {user.displayName?.split(' ')[0] || 'Diner'}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#11151c] border border-[#262f3f] shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-[#1f2735]">
                    <p className="text-xs font-bold text-white truncate">{user.displayName || 'Habibi Diner'}</p>
                    <p className="text-[10px] text-[#8e99a8] truncate">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full mt-1 px-3 py-2 text-left text-xs text-[#f87171] hover:bg-[#1d1618] rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              id="nav-google-login-btn"
              onClick={() => loginWithGoogle()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171b22] hover:bg-[#202630] border border-[#2b323d] text-xs font-semibold text-[#f3e5ab] hover:border-[#d4af37]/40 transition-colors shadow-sm cursor-pointer"
              title="Sign in with Google"
            >
              <LogIn className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Quick Call Button (Desktop) */}
          <a
            href={RESTAURANT_INFO.phoneTel}
            id="nav-phone-call-btn"
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#171b22] hover:bg-[#202630] border border-[#2b323d] text-xs font-semibold text-[#f3e5ab] transition-colors shadow-sm"
            title="Call to Order"
          >
            <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{RESTAURANT_INFO.phone}</span>
          </a>

          {/* Primary Order Now Button */}
          <button
            type="button"
            id="nav-order-now-btn"
            onClick={onOrderClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#c59b27] text-[#121417] text-xs sm:text-sm font-bold shadow-md shadow-[#d4af37]/25 hover:shadow-lg hover:shadow-[#d4af37]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#121417]" />
            <span>Order Now</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            id="nav-mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#171b22] border border-[#2b323d] text-[#c8ced8] hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden bg-[#0d0f12]/98 border-b border-[#252a33] px-5 py-6 mt-2 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-200"
        >
          {/* User status in mobile drawer */}
          <div className="mb-4 pb-4 border-b border-[#252a33]">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-10 h-10 rounded-full border border-[#d4af37]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center font-bold">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white">{user.displayName || 'Habibi Diner'}</p>
                    <p className="text-xs text-[#8e99a8]">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#1f1618] border border-[#f87171]/30 text-xs text-[#f87171] font-semibold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  loginWithGoogle();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#171b22] border border-[#d4af37]/40 text-sm font-semibold text-[#f3e5ab]"
              >
                <LogIn className="w-4 h-4 text-[#d4af37]" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-4 py-3 text-base font-semibold text-[#eae7e1] hover:text-[#f3e5ab] hover:bg-white/5 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-[#d4af37]/60">→</span>
              </a>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-[#252a33] space-y-3">
            <a
              href={RESTAURANT_INFO.phoneTel}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#171b22] border border-[#2b323d] text-sm font-semibold text-[#f3e5ab]"
            >
              <Phone className="w-4 h-4 text-[#d4af37]" />
              <span>Call Us: {RESTAURANT_INFO.phone}</span>
            </a>

            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-transparent border border-[#2b323d] text-xs font-medium text-[#a1a8b5] hover:text-white"
            >
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Open in Google Maps</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOrderClick();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#121417] text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Start Online Order</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
