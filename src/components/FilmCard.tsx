import React from 'react';
import { Film } from '../types';
import { Play, Clock, Sparkles, Film as FilmIcon, CheckCircle2, QrCode } from 'lucide-react';
import { cinemaAudio } from '../utils/audio';

interface FilmCardProps {
  film: Film;
  isOwned: boolean;
  onSelectFilm: (film: Film) => void;
  onBuyFilm: (film: Film) => void;
  onWatchFilm: (film: Film) => void;
  onTrailerClick: (film: Film) => void;
}

export const FilmCard: React.FC<FilmCardProps> = ({
  film,
  isOwned,
  onSelectFilm,
  onBuyFilm,
  onWatchFilm,
  onTrailerClick
}) => {
  const displayRuntime = film.runtime || film.duration || 10;
  const displayThumbnail = film.thumbnail || film.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
  const displayPrice = (film.price !== undefined ? film.price : film.ticketPrice) || 5.00;
  const displayGenre = film.genre || (film.genres && film.genres[0]) || 'Cinema';
  const displayDescription = film.description || film.synopsis || '';

  return (
    <div className="group relative rounded-xl bg-[#0f0f14] border border-[#d4af37]/25 hover:border-amber-400/60 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.85)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.2)] flex flex-col overflow-hidden">
      {/* Brass Corner Decors */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400/70 z-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400/70 z-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400/70 z-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400/70 z-20 pointer-events-none"></div>

      {/* Thumbnail Frame */}
      <div 
        className="relative aspect-[16/10] overflow-hidden bg-black cursor-pointer" 
        onClick={() => onSelectFilm(film)}
      >
        <img
          src={displayThumbnail}
          alt={film.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-transparent to-black/60 pointer-events-none"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5 z-10">
          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-amber-300 border border-[#d4af37]/40 text-[10px] font-serif uppercase tracking-wider font-semibold">
            {displayGenre}
          </span>
          {film.rating && (
            <span className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-zinc-300 border border-zinc-700 text-[10px] font-mono">
              {film.rating}
            </span>
          )}
        </div>

        {/* Owned Status Badge */}
        {isOwned && (
          <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-[10px] font-serif font-bold shadow-lg">
            <CheckCircle2 className="w-3 h-3" />
            <span>Owned</span>
          </div>
        )}

        {/* Quick Trailer Button Overlay */}
        {film.trailerUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              cinemaAudio.playChime();
              onTrailerClick(film);
            }}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-black/75 hover:bg-amber-500 hover:text-black text-amber-300 border border-[#d4af37]/50 backdrop-blur-md transition-all group-hover:scale-110 shadow-lg cursor-pointer"
            title="Preview Teaser"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        {/* Runtime pill */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1 px-2 py-0.5 rounded bg-black/80 text-zinc-300 text-xs backdrop-blur-md border border-zinc-800">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{displayRuntime} mins</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3
            onClick={() => onSelectFilm(film)}
            className="text-lg font-bold font-serif text-amber-100 group-hover:text-amber-300 transition-colors line-clamp-1 cursor-pointer mb-1"
          >
            {film.title}
          </h3>

          {film.director && (
            <p className="text-[11px] text-[#c59b27] font-serif italic mb-2">
              Directed by {film.director} {film.releaseYear ? `• ${film.releaseYear}` : ''}
            </p>
          )}

          {/* Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
            {displayDescription}
          </p>

          {/* Genre Chips */}
          <div className="flex flex-wrap gap-1 mb-3">
            {(film.genres && film.genres.length > 0 ? film.genres : [displayGenre]).slice(0, 3).map((g) => (
              <span
                key={g}
                className="text-[10px] px-2 py-0.5 rounded bg-[#171720] text-zinc-300 border border-zinc-800"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Footer with Price & Actions */}
        <div className="pt-3 border-t border-zinc-800/80 mt-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase text-zinc-500 tracking-wider block">
                Digital Ownership
              </span>
              <span className="text-lg font-bold text-amber-300 font-mono">
                ${displayPrice.toFixed(2)}
              </span>
              <span className="text-[10px] text-zinc-500 ml-1 font-serif">/ lifetime</span>
            </div>

            <button
              onClick={() => onSelectFilm(film)}
              className="text-xs text-amber-400/90 hover:text-amber-300 font-serif underline underline-offset-2 cursor-pointer"
            >
              Film Details
            </button>
          </div>

          {/* Action Button: Watch Film if owned, or Buy via QR Code */}
          {isOwned ? (
            <button
              onClick={() => {
                cinemaAudio.playCurtainSwoosh();
                onWatchFilm(film);
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-serif font-bold text-xs tracking-wider uppercase border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-101"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Owned • Stream Film</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  cinemaAudio.playChime();
                  onSelectFilm(film);
                }}
                className="py-2.5 px-3 rounded-lg bg-[#181822] hover:bg-[#232332] text-zinc-300 hover:text-amber-200 border border-zinc-700 font-serif text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center space-x-1"
              >
                <FilmIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span>Synopsis</span>
              </button>

              <button
                onClick={() => {
                  cinemaAudio.playTicketPunch();
                  onBuyFilm(film);
                }}
                className="py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-serif font-bold text-xs tracking-wider uppercase border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:shadow-[0_0_18px_rgba(245,158,11,0.5)] transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-black" />
                <span>Buy via QR</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
