import React, { useState, useMemo } from 'react';
import { Film } from '../types';
import { FilmCard } from './FilmCard';
import { 
  Search, Filter, Clock, Sparkles, SlidersHorizontal, 
  RotateCcw, Film as FilmIcon, Check 
} from 'lucide-react';
import { cinemaAudio } from '../utils/audio';

interface FilmCatalogProps {
  films: Film[];
  ownedFilmIds: string[];
  onSelectFilm: (film: Film) => void;
  onBuyFilm: (film: Film) => void;
  onWatchFilm: (film: Film) => void;
  onTrailerClick: (film: Film) => void;
}

export const FilmCatalog: React.FC<FilmCatalogProps> = ({
  films,
  ownedFilmIds,
  onSelectFilm,
  onBuyFilm,
  onWatchFilm,
  onTrailerClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [runtimeFilter, setRuntimeFilter] = useState<'all' | 'under10' | '10to15' | 'over15'>('all');
  const [maxRuntimeSlider, setMaxRuntimeSlider] = useState<number>(30);
  const [sortBy, setSortBy] = useState<'featured' | 'runtime-asc' | 'runtime-desc' | 'price-asc' | 'price-desc'>('featured');

  // Extract all distinct genres from existing films
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    films.forEach(f => {
      if (f.genre) genreSet.add(f.genre);
      if (f.genres && Array.isArray(f.genres)) {
        f.genres.forEach(g => genreSet.add(g));
      }
    });
    return ['All', ...Array.from(genreSet)];
  }, [films]);

  // Filter & sort logic
  const filteredFilms = useMemo(() => {
    return films.filter(film => {
      const q = searchQuery.toLowerCase().trim();
      const filmRuntime = film.runtime || film.duration || 10;
      const filmTitle = film.title.toLowerCase();
      const filmGenre = (film.genre || '').toLowerCase();
      const filmGenres = (film.genres || []).map(g => g.toLowerCase());
      const filmDesc = (film.description || film.synopsis || '').toLowerCase();

      // Search matching title, genre, or description
      const matchesSearch = !q || 
        filmTitle.includes(q) || 
        filmGenre.includes(q) || 
        filmGenres.some(g => g.includes(q)) ||
        filmDesc.includes(q);

      // Genre filter
      const matchesGenre = selectedGenre === 'All' || 
        film.genre === selectedGenre || 
        (film.genres && film.genres.includes(selectedGenre));

      // Runtime filter
      let matchesRuntime = true;
      if (runtimeFilter === 'under10') {
        matchesRuntime = filmRuntime < 10;
      } else if (runtimeFilter === '10to15') {
        matchesRuntime = filmRuntime >= 10 && filmRuntime <= 15;
      } else if (runtimeFilter === 'over15') {
        matchesRuntime = filmRuntime > 15;
      }

      const matchesMaxSlider = filmRuntime <= maxRuntimeSlider;

      return matchesSearch && matchesGenre && matchesRuntime && matchesMaxSlider;
    }).sort((a, b) => {
      const runtimeA = a.runtime || a.duration || 0;
      const runtimeB = b.runtime || b.duration || 0;
      const priceA = a.price || a.ticketPrice || 0;
      const priceB = b.price || b.ticketPrice || 0;

      if (sortBy === 'runtime-asc') return runtimeA - runtimeB;
      if (sortBy === 'runtime-desc') return runtimeB - runtimeA;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [films, searchQuery, selectedGenre, runtimeFilter, maxRuntimeSlider, sortBy]);

  const handleResetFilters = () => {
    cinemaAudio.playChime();
    setSearchQuery('');
    setSelectedGenre('All');
    setRuntimeFilter('all');
    setMaxRuntimeSlider(30);
    setSortBy('featured');
  };

  return (
    <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-widest text-amber-400 mb-2">
            <FilmIcon className="w-4 h-4" />
            <span>Short Film Repertory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-amber-100">
            Cinema Catalog & Screenings
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-light max-w-xl">
            Browse our curated repertory. Filter by runtime, genre, or title. Buy via direct QR code payment to stream anytime.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center space-x-2 text-xs text-zinc-400">
          <span className="px-3 py-1.5 rounded-lg bg-[#12121a] border border-[#d4af37]/30 text-amber-300 font-mono">
            Showing {filteredFilms.length} of {films.length} Films
          </span>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="rounded-2xl bg-[#0f0f15] border border-zinc-800/90 p-4 sm:p-6 mb-8 shadow-2xl space-y-5">
        {/* Row 1: Search Input & Sort Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search films by title, genre, or synopsis..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14141d] border border-zinc-700 text-amber-100 text-xs placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-serif text-zinc-400 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#14141d] border border-zinc-700 text-amber-200 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="featured">Featured / Newest</option>
              <option value="runtime-asc">Runtime: Short to Long</option>
              <option value="runtime-desc">Runtime: Long to Short</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Row 2: Genre Filter Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-serif uppercase tracking-wider text-zinc-400 font-semibold">
              Filter by Genre:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allGenres.map((g) => (
              <button
                key={g}
                onClick={() => {
                  cinemaAudio.playChime();
                  setSelectedGenre(g);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                  selectedGenre === g
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-[#14141e] text-zinc-400 hover:text-amber-200 hover:bg-[#1c1c28] border border-zinc-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Filter by Runtime (Explicit User Requirement) */}
        <div className="pt-3 border-t border-zinc-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-serif uppercase tracking-wider text-zinc-300 font-semibold">
                Filter by Runtime:
              </span>
            </div>

            {/* Runtime preset buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => {
                  cinemaAudio.playChime();
                  setRuntimeFilter('all');
                }}
                className={`px-3 py-1 rounded-md font-serif text-xs transition-colors cursor-pointer ${
                  runtimeFilter === 'all'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/80 font-semibold'
                    : 'bg-[#14141e] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                All Lengths
              </button>

              <button
                onClick={() => {
                  cinemaAudio.playChime();
                  setRuntimeFilter('under10');
                }}
                className={`px-3 py-1 rounded-md font-serif text-xs transition-colors cursor-pointer ${
                  runtimeFilter === 'under10'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/80 font-semibold'
                    : 'bg-[#14141e] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                Under 10 mins (Quick)
              </button>

              <button
                onClick={() => {
                  cinemaAudio.playChime();
                  setRuntimeFilter('10to15');
                }}
                className={`px-3 py-1 rounded-md font-serif text-xs transition-colors cursor-pointer ${
                  runtimeFilter === '10to15'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/80 font-semibold'
                    : 'bg-[#14141e] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                10 – 15 mins (Standard)
              </button>

              <button
                onClick={() => {
                  cinemaAudio.playChime();
                  setRuntimeFilter('over15');
                }}
                className={`px-3 py-1 rounded-md font-serif text-xs transition-colors cursor-pointer ${
                  runtimeFilter === 'over15'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/80 font-semibold'
                    : 'bg-[#14141e] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                15+ mins (Extended)
              </button>
            </div>

            {/* Active filter reset */}
            {(searchQuery || selectedGenre !== 'All' || runtimeFilter !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-400 hover:text-amber-300 underline flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FILMS GRID */}
      {filteredFilms.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-[#0f0f15] border border-zinc-800 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#181822] text-amber-400 flex items-center justify-center mx-auto mb-3">
            <FilmIcon className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-serif font-bold text-amber-100 mb-1">
            No Films Found
          </h3>
          <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
            No films matched your search or runtime/genre filters. Try resetting the filters or broadening your search.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-serif font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFilms.map((film) => (
            <FilmCard
              key={film.id}
              film={film}
              isOwned={ownedFilmIds.includes(film.id)}
              onSelectFilm={onSelectFilm}
              onBuyFilm={onBuyFilm}
              onWatchFilm={onWatchFilm}
              onTrailerClick={onTrailerClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
