import React from 'react';
import { Film, Sparkles, Clock, Star, QrCode } from 'lucide-react';
import { cinemaAudio } from '../utils/audio';

interface MarqueeHeaderProps {
  onExploreClick: () => void;
  featuredFilmTitle?: string;
}

export const MarqueeHeader: React.FC<MarqueeHeaderProps> = ({ 
  onExploreClick, 
  featuredFilmTitle = 'Tears of Steel' 
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#0d0d14] to-[#07070a] border-b border-[#d4af37]/30 py-8 sm:py-12 px-4 sm:px-6 shadow-[inset_0_-20px_40px_rgba(0,0,0,0.9)]">
      {/* Subtle Art Deco Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Dark smoked velvet drape top border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-[#242018] to-transparent border-b border-[#d4af37]/20"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* The Vintage Cinema Marquee Box */}
        <div className="relative rounded-2xl p-1 bg-gradient-to-r from-[#8c6d1d] via-[#d4af37] to-[#8c6d1d] shadow-[0_0_35px_rgba(212,175,55,0.25)]">
          {/* Inner illuminated dark board */}
          <div className="rounded-[14px] bg-[#0c0c12] border-4 border-[#181822] px-6 py-8 text-center relative overflow-hidden">
            {/* Top row incandescent bulbs */}
            <div className="flex justify-between items-center max-w-4xl mx-auto mb-4 px-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border border-amber-300/60 ${
                    i % 2 === 0
                      ? 'bg-amber-300 bulb-blink shadow-[0_0_10px_#fde047]'
                      : 'bg-amber-500 bulb-blink-delayed shadow-[0_0_10px_#f59e0b]'
                  }`}
                />
              ))}
            </div>

            {/* Marquee Header Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#161622] border border-[#d4af37]/40 text-xs text-amber-300 tracking-[0.2em] font-serif uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>INDEPENDENT SHORT FILM REPERTORY & VAULT</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-marquee text-amber-100 tracking-wider mb-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              THE AUDITORIUM OF SHORT CINEMA
            </h2>

            <p className="max-w-2xl mx-auto text-zinc-300 text-xs sm:text-sm font-light mb-6 tracking-wide leading-relaxed">
              Step past the velvet drape into our digital cinema hall. Browse visionary independent short films, unlock lifetime streaming with direct creator QR code payment, and stream in the high-fidelity screening room.
            </p>

            {/* Marquee Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-zinc-300 border-t border-b border-[#d4af37]/20 py-3 max-w-3xl mx-auto mb-6 bg-[#08080c]/80">
              <div className="flex items-center space-x-1.5 text-amber-300 font-medium font-serif">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Festival-Honored Shorts</span>
              </div>
              <span className="text-zinc-700">♦</span>
              <div className="flex items-center space-x-1.5 text-amber-300 font-medium font-serif">
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Direct Admin QR Payment</span>
              </div>
              <span className="text-zinc-700">♦</span>
              <div className="flex items-center space-x-1.5 text-amber-300 font-medium font-serif">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>Permanent Unlocked Access</span>
              </div>
            </div>

            {/* Bottom action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  cinemaAudio.playChime();
                  onExploreClick();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-serif font-bold text-xs tracking-wider uppercase border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
              >
                Browse Film Catalog
              </button>
              <div className="text-xs text-zinc-400 font-serif italic">
                Spotlight Short: <span className="text-amber-200 font-semibold underline decoration-amber-500/50">{featuredFilmTitle}</span>
              </div>
            </div>

            {/* Bottom row bulbs */}
            <div className="flex justify-between items-center max-w-4xl mx-auto mt-6 px-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border border-amber-300/60 ${
                    i % 2 === 0
                      ? 'bg-amber-500 bulb-blink-delayed shadow-[0_0_10px_#f59e0b]'
                      : 'bg-amber-300 bulb-blink shadow-[0_0_10px_#fde047]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
