import React, { useState } from 'react';
import { Film as FilmIcon, Sparkles, Shield, Volume2, VolumeX, Library, QrCode, ArrowLeft } from 'lucide-react';
import { cinemaAudio } from '../utils/audio';

interface NavbarProps {
  activeTab: 'catalog' | 'vault' | 'admin';
  setActiveTab: (tab: 'catalog' | 'vault' | 'admin') => void;
  ownedCount: number;
  canGoBack?: boolean;
  previousPageLabel?: string;
  onGoBack?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  ownedCount,
  canGoBack,
  previousPageLabel,
  onGoBack
}) => {
  const [isMuted, setIsMuted] = useState(cinemaAudio.isMuted);

  const toggleSound = () => {
    cinemaAudio.isMuted = !cinemaAudio.isMuted;
    setIsMuted(cinemaAudio.isMuted);
    if (!cinemaAudio.isMuted) {
      cinemaAudio.playChime();
    }
  };

  const handleTabClick = (tab: 'catalog' | 'vault' | 'admin') => {
    cinemaAudio.playChime();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0e]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
      {/* Dark Theatre Marquee Header Strip */}
      <div className="flex justify-between items-center px-4 py-1 bg-[#07070a] border-b border-zinc-800/80 text-[11px] font-medium tracking-widest text-[#d4af37]/80">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 bulb-blink shadow-[0_0_8px_#f59e0b]"></span>
          <span className="hidden sm:inline">SHORT FILM CINEMA VAULT • DIRECT CREATOR QR PAYMENTS • LIFETIME ACCESS</span>
          <span className="sm:hidden">CINEMA SHORT FILM VAULT</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSound}
            className="flex items-center space-x-1 hover:text-amber-300 transition-colors cursor-pointer text-xs"
            title={isMuted ? 'Turn Sound On' : 'Mute Cinema Ambience'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
            <span className="hidden md:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>
          <span className="text-zinc-700">|</span>
          <span className="text-amber-300/80 font-serif">4K CINEMA PROJECTION</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left section: Optional Back Button + Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {canGoBack && onGoBack && (
              <button
                onClick={onGoBack}
                className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#141420] hover:bg-[#202030] text-amber-300 hover:text-amber-200 border border-[#d4af37]/50 hover:border-amber-400 text-xs font-serif font-semibold shadow-[0_0_12px_rgba(212,175,55,0.15)] hover:shadow-[0_0_18px_rgba(212,175,55,0.3)] transition-all cursor-pointer group"
                title={`Return to ${previousPageLabel || 'previous page'}`}
              >
                <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
                {previousPageLabel && (
                  <span className="hidden xl:inline text-zinc-400 font-normal">
                    to {previousPageLabel}
                  </span>
                )}
              </button>
            )}

            {/* Logo / Cinema Title */}
            <div
              onClick={() => handleTabClick('catalog')}
              className="cursor-pointer flex items-center space-x-3 group"
            >
              <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-[#1c1c24] via-[#121218] to-[#0a0a0e] border-2 border-[#d4af37]/70 p-2 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all">
                <FilmIcon className="w-6 h-6 text-amber-400" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 bulb-blink"></div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">The Historic</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#181822] text-amber-200 border border-[#d4af37]/40">Est. 1928</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-amber-100 font-serif-cinema tracking-wider leading-none">
                  GRAND MAJESTIC
                </h1>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400">Palace of Independent Short Films</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => handleTabClick('catalog')}
              className={`px-4 py-2 rounded-lg font-serif text-xs uppercase tracking-wider font-semibold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[#181824] text-amber-300 border border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'text-zinc-300 hover:text-amber-200 hover:bg-[#14141c]'
              }`}
            >
              <FilmIcon className="w-4 h-4 text-amber-400" />
              <span>Film Catalog</span>
            </button>

            <button
              onClick={() => handleTabClick('vault')}
              className={`relative px-4 py-2 rounded-lg font-serif text-xs uppercase tracking-wider font-semibold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-[#181824] text-amber-300 border border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'text-zinc-300 hover:text-amber-200 hover:bg-[#14141c]'
              }`}
            >
              <Library className="w-4 h-4 text-amber-400" />
              <span>My Films</span>
              {ownedCount > 0 && (
                <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-black shadow-[0_0_8px_#f59e0b]">
                  {ownedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('admin')}
              className={`px-4 py-2 rounded-lg font-serif text-xs uppercase tracking-wider font-semibold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-[#12121a] text-amber-300 border border-[#d4af37]/40 hover:border-amber-400 hover:bg-[#181824]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin & QR</span>
            </button>
          </nav>

          {/* Mobile Navigation Icons */}
          <div className="flex md:hidden items-center space-x-1">
            <button
              onClick={() => handleTabClick('catalog')}
              className={`p-2 rounded-lg text-xs font-serif ${
                activeTab === 'catalog' ? 'bg-[#181824] text-amber-300 border border-amber-400' : 'text-zinc-400'
              }`}
              title="Catalog"
            >
              <FilmIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleTabClick('vault')}
              className={`relative p-2 rounded-lg text-xs font-serif ${
                activeTab === 'vault' ? 'bg-[#181824] text-amber-300 border border-amber-400' : 'text-zinc-400'
              }`}
              title="My Films"
            >
              <Library className="w-5 h-5" />
              {ownedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black font-bold text-[9px] flex items-center justify-center">
                  {ownedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('admin')}
              className={`p-2 rounded-lg text-xs font-serif ${
                activeTab === 'admin' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400'
              }`}
              title="Admin"
            >
              <Shield className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
