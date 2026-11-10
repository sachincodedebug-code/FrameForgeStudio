import React, { useState } from 'react';
import { Film, PurchaseRecord } from '../types';
import { 
  Play, Film as FilmIcon, Clock, Calendar, CheckCircle2, 
  Search, ArrowRight, ShieldCheck, Sparkles, ArrowLeft
} from 'lucide-react';
import { cinemaAudio } from '../utils/audio';

interface MyFilmsVaultProps {
  purchases: PurchaseRecord[];
  films: Film[];
  onWatchFilm: (film: Film) => void;
  onBrowseCatalog: () => void;
  onGoBack?: () => void;
}

export const MyFilmsVault: React.FC<MyFilmsVaultProps> = ({
  purchases,
  films,
  onWatchFilm,
  onBrowseCatalog,
  onGoBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Map purchases to actual film objects
  const ownedFilmsData = purchases.map((p) => {
    const matchedFilm = films.find(f => f.id === p.filmId);
    return {
      purchase: p,
      film: matchedFilm || {
        id: p.filmId,
        title: p.filmTitle,
        description: 'Independent short film.',
        runtime: p.runtime,
        genre: p.genre,
        genres: [p.genre],
        thumbnail: p.thumbnail,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        price: p.pricePaid,
        createdAt: Date.now()
      } as Film
    };
  });

  const filteredOwnedFilms = ownedFilmsData.filter(({ film, purchase }) => {
    return film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           film.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
           purchase.transactionRef.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleBack = () => {
    cinemaAudio.playChime();
    if (onGoBack) {
      onGoBack();
    } else {
      onBrowseCatalog();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Back Navigation Bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#141420] hover:bg-[#202032] text-amber-300 hover:text-amber-200 border border-[#d4af37]/40 hover:border-amber-400 text-xs font-serif font-semibold shadow transition-all cursor-pointer group"
          title="Return to Film Catalog"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Film Catalog</span>
        </button>

        <span className="text-[11px] font-mono text-zinc-500">
          {purchases.length} {purchases.length === 1 ? 'Film' : 'Films'} Unlocked
        </span>
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#161620] border border-[#d4af37]/40 text-xs text-amber-300 font-serif uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Personal Film Vault & Ownership</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-serif text-amber-100 mb-3">
          My Unlocked Cinema Library
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
          Films you have unlocked via direct payment. You hold permanent streaming rights with no expiration date.
        </p>
      </div>

      {/* Vault Search Bar if films exist */}
      {purchases.length > 0 && (
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your unlocked films by title or genre..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111117] border border-zinc-700 text-amber-100 text-xs placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      )}

      {/* Empty State */}
      {purchases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f0f15] border border-zinc-800 max-w-lg mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#181822] border border-[#d4af37]/40 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <FilmIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-amber-100 mb-2">
            Your Film Vault is Empty
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6 leading-relaxed">
            Browse the cinema catalog, scan the Admin QR code to complete payment, and your unlocked movies will appear here permanently.
          </p>
          <button
            onClick={() => {
              cinemaAudio.playChime();
              onBrowseCatalog();
            }}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-serif font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
          >
            Browse Film Catalog
          </button>
        </div>
      ) : filteredOwnedFilms.length === 0 ? (
        <div className="p-8 text-center text-zinc-400 text-xs">
          No owned films match "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOwnedFilms.map(({ film, purchase }) => (
            <div
              key={purchase.id}
              className="rounded-xl bg-[#111117] border border-[#d4af37]/30 overflow-hidden shadow-xl hover:border-amber-400/60 transition-all flex flex-col justify-between group"
            >
              {/* Media Thumbnail */}
              <div
                className="relative aspect-video overflow-hidden bg-black cursor-pointer"
                onClick={() => {
                  cinemaAudio.playCurtainSwoosh();
                  onWatchFilm(film);
                }}
              >
                <img
                  src={film.thumbnail || film.posterUrl}
                  alt={film.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Ownership Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400/80 text-emerald-300 text-[10px] font-serif font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Owned & Unlocked</span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>

                {/* Runtime Badge */}
                <div className="absolute bottom-3 right-3 z-10 flex items-center space-x-1 px-2 py-0.5 rounded bg-black/80 text-zinc-300 text-[11px]">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{film.runtime || film.duration}m</span>
                </div>
              </div>

              {/* Information */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="text-amber-400 font-serif uppercase tracking-wider">
                      {film.genre || (film.genres && film.genres[0])}
                    </span>
                    <span className="flex items-center space-x-1 text-zinc-400">
                      <Calendar className="w-3 h-3" />
                      <span>{purchase.purchaseDate}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-amber-100 group-hover:text-amber-300 transition-colors mb-2 line-clamp-1">
                    {film.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                    {film.description || film.synopsis}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-zinc-400">
                    <div>Txn: <span className="text-zinc-300">{purchase.transactionRef}</span></div>
                  </div>

                  <button
                    onClick={() => {
                      cinemaAudio.playCurtainSwoosh();
                      onWatchFilm(film);
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-serif font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Watch Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
