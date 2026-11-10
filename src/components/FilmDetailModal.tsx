import React, { useState, useEffect } from 'react';
import { Film } from '../types';
import { X, Play, Clock, Sparkles, Volume2, ShieldCheck, CheckCircle2, QrCode, Film as FilmIcon, ArrowLeft } from 'lucide-react';
import { cinemaAudio } from '../utils/audio';

interface FilmDetailModalProps {
  film: Film | null;
  isOwned: boolean;
  onClose: () => void;
  onBuyFilm: (film: Film) => void;
  onWatchFilm: (film: Film) => void;
  onGoBack?: () => void;
}

export const FilmDetailModal: React.FC<FilmDetailModalProps> = ({
  film,
  isOwned,
  onClose,
  onBuyFilm,
  onWatchFilm,
  onGoBack
}) => {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  // Keyboard Escape listener to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onGoBack) onGoBack();
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onGoBack, onClose]);

  if (!film) return null;

  const handleBack = () => {
    cinemaAudio.playChime();
    if (onGoBack) onGoBack();
    else onClose();
  };

  const displayRuntime = film.runtime || film.duration || 10;
  const displayThumbnail = film.thumbnail || film.posterUrl || '';
  const displayPrice = (film.price !== undefined ? film.price : film.ticketPrice) || 5.00;
  const displayGenre = film.genre || (film.genres && film.genres[0]) || 'Cinema';
  const displayDescription = film.description || film.synopsis || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0c0c11] border border-[#d4af37]/40 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header with Back Button */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#121218] border-b border-[#d4af37]/20">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181824] hover:bg-[#232334] text-amber-300 hover:text-amber-200 border border-[#d4af37]/40 hover:border-amber-400 text-xs font-serif font-semibold transition-all cursor-pointer group shadow"
              title="Return to previous page / catalog"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to Catalog</span>
            </button>

            <div className="hidden md:flex items-center space-x-2 text-xs font-serif uppercase tracking-widest text-amber-300/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Film Details</span>
            </div>
          </div>

          <button
            onClick={handleBack}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-200 hover:bg-[#1a1a24] transition-colors cursor-pointer"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player or Poster Banner */}
        <div className="relative aspect-video w-full bg-black">
          {isPlayingTrailer && film.trailerUrl ? (
            <video
              src={film.trailerUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={displayThumbnail}
                alt={film.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c11] via-transparent to-black/70 flex flex-col justify-end p-6">
                {film.trailerUrl && (
                  <button
                    onClick={() => setIsPlayingTrailer(true)}
                    className="mx-auto my-auto px-6 py-3 rounded-full bg-amber-500/90 hover:bg-amber-400 text-black font-serif font-bold text-xs tracking-widest uppercase flex items-center space-x-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer hover:scale-105 transition-all"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Preview Teaser Trailer</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Film Information Body */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#181822] text-amber-300 border border-[#d4af37]/40 text-xs font-serif font-semibold">
                  {displayGenre}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#181822] text-zinc-300 border border-zinc-700 text-xs flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{displayRuntime} Minutes</span>
                </span>
                {film.rating && (
                  <span className="px-2 py-0.5 rounded bg-black/60 text-zinc-400 border border-zinc-800 text-xs font-mono">
                    {film.rating}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl font-black font-serif text-amber-100 mb-2">
                {film.title}
              </h2>

              {film.tagline && (
                <p className="text-sm sm:text-base text-amber-300/80 font-serif italic mb-3">
                  "{film.tagline}"
                </p>
              )}

              <div className="flex flex-wrap gap-1.5">
                {(film.genres && film.genres.length > 0 ? film.genres : [displayGenre]).map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded bg-[#161620] text-zinc-300 border border-zinc-800 text-xs font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Price / Ownership Card */}
            <div className="bg-[#121218] border border-[#d4af37]/30 rounded-xl p-5 min-w-[220px] text-center shadow-lg">
              <span className="text-xs uppercase tracking-wider text-zinc-400 block mb-1">
                Permanent Film Access
              </span>
              <div className="text-3xl font-extrabold text-amber-300 font-mono mb-1">
                ${displayPrice.toFixed(2)}
              </div>
              <span className="text-[11px] text-zinc-500 block mb-4">
                Unlimited stream • No expiry
              </span>

              {isOwned ? (
                <button
                  onClick={() => {
                    cinemaAudio.playCurtainSwoosh();
                    onClose();
                    onWatchFilm(film);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-serif font-bold text-xs uppercase tracking-wider border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Stream Film Now</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    cinemaAudio.playTicketPunch();
                    onClose();
                    onBuyFilm(film);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-serif font-bold text-xs uppercase tracking-wider border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.35)] flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-black" />
                  <span>Unlock via QR Code</span>
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xs font-serif uppercase tracking-widest text-amber-400 font-semibold mb-2">
              Synopsis & Screenplay Details
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {displayDescription}
            </p>
          </div>

          {/* Director & Additional Specs */}
          {film.director && (
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <div>
                <span className="text-zinc-500 uppercase font-serif">Director:</span>{' '}
                <span className="text-amber-200 font-medium">{film.director}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase font-serif">Release:</span>{' '}
                <span className="text-zinc-300">{film.releaseYear || 2024}</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="bg-[#09090d] px-6 py-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Direct Creator Settlement & Instant Ownership Unlock</span>
          </div>
          <span className="text-zinc-500 font-mono">Runtime: {displayRuntime} mins</span>
        </div>
      </div>
    </div>
  );
};
