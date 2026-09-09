import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  MapPin,
  Search,
  Zap,
  Brain,
  Compass,
  RotateCcw,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage, GroundingChunk } from '../types';

interface GeminiChatbotProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const DEFAULT_PROMPTS = [
  { label: '🌶️ Spiciest Dish', text: 'Which item is the spiciest on your menu and what makes it special?' },
  { label: '🍔 Meal for Two', text: 'What is the best combo or deal for 2 friends under Rs. 1,500?' },
  { label: '📍 Find Location', text: 'Where is Habibi Bites located in Lahore and what are directions from Model Town?', mode: 'maps' as const },
  { label: '🔍 Pakistani Food Trends', text: 'What are the most popular burger & zinger wrap food trends in Pakistan right now?', mode: 'search' as const },
];

export const GeminiChatbot: React.FC<GeminiChatbotProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [mode, setMode] = useState<'general' | 'search' | 'maps'>('general');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: 'Assalam-o-Alaikum! Welcome to Habibi Bites. I am your AI Culinary Concierge. How can I help you choose your next favorite bite, check branch locations, or explore our authentic Pakistani spice blends today?',
      timestamp: 'Just now',
      modelUsed: 'gemini-3.5-flash',
      mode: 'general',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Attempt to read user location for Maps Grounding
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          // Default to Lahore coordinates if denied or unavailable
          setUserLocation({ latitude: 31.4826, longitude: 74.3168 });
        },
        { timeout: 5000 }
      );
    }
  }, []);

  // Auto-scroll chat thread
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string, overrideMode?: 'general' | 'search' | 'maps') => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const activeMode = overrideMode || mode;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: query,
      timestamp: now,
      mode: activeMode,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Send conversation history to backend proxy
      const historyPayload = newMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          model: selectedModel,
          mode: activeMode,
          userLocation: activeMode === 'maps' ? userLocation : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isQuotaExceeded) {
          throw new Error('Search/Grounding quota reached for this key. You can switch to Chat mode or select a billing-enabled API key in Settings > Secrets.');
        }
        throw new Error(data.error || 'Failed to get response');
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        text: data.text || 'I could not generate a response at this moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model,
        mode: data.mode,
        groundingChunks: data.groundingChunks || [],
        webSearchQueries: data.webSearchQueries || [],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        role: 'assistant',
        text: `We could not retrieve an AI response right now: ${err.message || 'Please check your connection'}. You can always place an order directly or call our hotline at 0343 4100089!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        text: 'Assalam-o-Alaikum! Welcome back. What craving can I assist you with right now?',
        timestamp: 'Just now',
        modelUsed: 'gemini-3.5-flash',
        mode: 'general',
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          type="button"
          id="open-gemini-chat-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Habibi AI Assistant"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#c59b27] text-[#121417] font-bold text-sm shadow-xl shadow-[#d4af37]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#f5de8a]"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-[#121417]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#121417] animate-ping" />
          </div>
          <span className="hidden sm:inline font-heading tracking-wide">Ask Habibi AI</span>
          <span className="sm:hidden font-heading">AI Concierge</span>
        </button>
      </div>

      {/* Slide-in / Modal Chat Dialog */}
      {isOpen && (
        <div
          id="gemini-chat-modal"
          className="fixed inset-y-0 right-0 sm:inset-auto sm:bottom-20 sm:right-6 sm:w-[480px] sm:h-[650px] w-full h-full z-50 flex flex-col bg-[#0e1218] border border-[#262f3f] shadow-2xl sm:rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="bg-[#141923] p-4 border-b border-[#252f40] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8c6d17] p-0.5 flex items-center justify-center shadow-md shadow-[#d4af37]/20">
                <div className="w-full h-full bg-[#0d0f12] rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#d4af37]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-sm text-white">
                    Habibi AI Concierge
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/30">
                    Gemini
                  </span>
                </div>
                <p className="text-[11px] text-[#8e99a8]">
                  Pakistani Fast-Food Guide & Real-Time Grounding
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="reset-chat-btn"
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-2 rounded-xl text-[#8e98a7] hover:text-white hover:bg-[#1e2533] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="close-gemini-chat-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-2 rounded-xl text-[#8e98a7] hover:text-white hover:bg-[#1e2533] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode & Model Control Bar */}
          <div className="bg-[#10141c] px-3 py-2 border-b border-[#1f2735] flex items-center justify-between gap-2 text-xs shrink-0">
            {/* Grounding Mode Selector */}
            <div className="flex items-center gap-1 bg-[#161c26] p-1 rounded-xl border border-[#263142]">
              <button
                type="button"
                id="mode-general-btn"
                onClick={() => setMode('general')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] flex items-center gap-1 cursor-pointer ${
                  mode === 'general'
                    ? 'bg-[#d4af37] text-[#121417] font-bold shadow'
                    : 'text-[#9ea8b7] hover:text-white'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Chat</span>
              </button>

              <button
                type="button"
                id="mode-search-btn"
                onClick={() => setMode('search')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] flex items-center gap-1 cursor-pointer ${
                  mode === 'search'
                    ? 'bg-[#3b82f6] text-white font-bold shadow'
                    : 'text-[#9ea8b7] hover:text-white'
                }`}
                title="Google Search Grounding (gemini-3.5-flash)"
              >
                <Search className="w-3 h-3" />
                <span>Search Data</span>
              </button>

              <button
                type="button"
                id="mode-maps-btn"
                onClick={() => setMode('maps')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] flex items-center gap-1 cursor-pointer ${
                  mode === 'maps'
                    ? 'bg-[#10b981] text-white font-bold shadow'
                    : 'text-[#9ea8b7] hover:text-white'
                }`}
                title="Google Maps Grounding (gemini-3.5-flash)"
              >
                <MapPin className="w-3 h-3" />
                <span>Maps Data</span>
              </button>
            </div>

            {/* Model Selector (When in general mode) */}
            {mode === 'general' ? (
              <select
                id="gemini-model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as any)}
                aria-label="Select Gemini AI Model"
                className="bg-[#161c26] border border-[#283344] text-[#d2dae6] text-[11px] rounded-xl px-2 py-1 focus:outline-none focus:border-[#d4af37] cursor-pointer"
              >
                <option value="gemini-3.5-flash">Flash (Balanced)</option>
                <option value="gemini-3.1-pro-preview">Pro (Complex Tasks)</option>
                <option value="gemini-3.1-flash-lite">Flash Lite (Fast Tasks)</option>
              </select>
            ) : (
              <span className="text-[10px] font-mono text-[#a0abbb] bg-[#161c26] px-2 py-1 rounded-lg border border-[#283344]">
                gemini-3.5-flash
              </span>
            )}
          </div>

          {/* Messages Scrollable Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-[#1a212d] border border-[#2b3648] text-[#d4af37] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#111317] font-medium shadow-md'
                      : 'bg-[#141923] text-[#e3e7ee] border border-[#242e3f] shadow'
                  }`}
                >
                  {/* Markdown text body */}
                  <div className="markdown-body prose prose-invert max-w-none text-xs sm:text-sm space-y-2">
                    <Markdown>{msg.text}</Markdown>
                  </div>

                  {/* Grounding Source Citations (Maps & Search Links) */}
                  {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#252f40] space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1">
                        {msg.mode === 'maps' ? (
                          <>
                            <MapPin className="w-3 h-3 text-[#10b981]" />
                            <span>Verified Places & Maps Grounding</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-3 h-3 text-[#3b82f6]" />
                            <span>Google Search Grounding Sources</span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {msg.groundingChunks.map((chunk, cIdx) => {
                          if (chunk.maps?.uri) {
                            return (
                              <a
                                key={`map-${cIdx}`}
                                href={chunk.maps.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0e1a14] border border-[#1b4329] text-[#4ade80] hover:text-white hover:bg-[#13331f] text-[11px] font-medium transition-colors"
                              >
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="max-w-[180px] truncate">
                                  {chunk.maps.title || 'View on Google Maps'}
                                </span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                              </a>
                            );
                          }

                          if (chunk.web?.uri) {
                            return (
                              <a
                                key={`web-${cIdx}`}
                                href={chunk.web.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0d1627] border border-[#1b3156] text-[#60a5fa] hover:text-white hover:bg-[#152744] text-[11px] font-medium transition-colors"
                              >
                                <Search className="w-3 h-3 shrink-0" />
                                <span className="max-w-[180px] truncate">
                                  {chunk.web.title || chunk.web.uri}
                                </span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                              </a>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[10px] flex items-center justify-between ${
                      msg.role === 'user' ? 'text-[#383321]' : 'text-[#6b7685]'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && (
                      <span className="font-mono text-[9px] opacity-75">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-7 h-7 rounded-xl bg-[#1a212d] border border-[#2b3648] text-[#d4af37] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#141923] border border-[#242e3f] rounded-2xl px-4 py-3 text-xs text-[#a0abbb] flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
                  <span>
                    {mode === 'maps'
                      ? 'Consulting Google Maps data...'
                      : mode === 'search'
                      ? 'Grounding with Google Search...'
                      : selectedModel === 'gemini-3.1-pro-preview'
                      ? 'Thinking deeply with Gemini Pro...'
                      : 'Habibi AI is typing...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-[#1a212d] bg-[#0c0f15] shrink-0">
              <div className="text-[10px] uppercase font-bold text-[#6a7585] mb-1.5">
                Suggested Prompts
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (p.mode) setMode(p.mode);
                      handleSendMessage(p.text, p.mode);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#151a23] hover:bg-[#202734] border border-[#252f3f] text-[#cfd6e1] text-[11px] transition-colors cursor-pointer text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Field */}
          <div className="p-3 bg-[#12161f] border-t border-[#232c3c] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                id="gemini-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'maps'
                    ? 'Ask for locations or directions with Google Maps...'
                    : mode === 'search'
                    ? 'Ask questions with live Google Search data...'
                    : 'Ask about spice levels, burgers, wraps, combos...'
                }
                className="flex-1 bg-[#0b0e14] border border-[#242e3f] focus:border-[#d4af37] text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors"
                disabled={loading}
              />

              <button
                type="submit"
                id="gemini-chat-send-btn"
                disabled={!input.trim() || loading}
                aria-label="Send Message"
                className="p-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c05b] disabled:opacity-40 disabled:cursor-not-allowed text-[#111317] transition-all cursor-pointer shadow-md shadow-[#d4af37]/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
