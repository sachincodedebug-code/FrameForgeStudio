import React, { useState } from 'react';
import { Film, AdminPaymentConfig, PurchaseRecord } from '../types';
import { 
  Upload, Film as FilmIcon, Plus, DollarSign, Clock, 
  Trash2, QrCode, CheckCircle2, ShieldCheck, Play, 
  BarChart3, Image, Video, AlertCircle, Save, Sparkles, RefreshCw, ArrowLeft
} from 'lucide-react';
import { cinemaAudio } from '../utils/audio';

interface AdminPortalProps {
  films: Film[];
  purchases: PurchaseRecord[];
  adminPaymentConfig: AdminPaymentConfig;
  onAddFilm: (film: Film) => void;
  onDeleteFilm: (filmId: string) => void;
  onUpdateFilm: (film: Film) => void;
  onUpdatePaymentConfig: (config: AdminPaymentConfig) => void;
  onTestPlayFilm: (film: Film) => void;
  onResetCatalogue: () => void;
  onGoBack?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  films,
  purchases,
  adminPaymentConfig,
  onAddFilm,
  onDeleteFilm,
  onUpdateFilm,
  onUpdatePaymentConfig,
  onTestPlayFilm,
  onResetCatalogue,
  onGoBack
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'qr-settings' | 'repertory' | 'sales'>('upload');

  // New Film Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [runtime, setRuntime] = useState<number>(12);
  const [genre, setGenre] = useState('Sci-Fi');
  const [price, setPrice] = useState<number>(5.50);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [director, setDirector] = useState('');
  const [tagline, setTagline] = useState('');
  const [rating, setRating] = useState('PG-13');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Admin QR Code Form State
  const [qrCodeUrl, setQrCodeUrl] = useState(adminPaymentConfig.qrCodeUrl);
  const [paymentHandle, setPaymentHandle] = useState(adminPaymentConfig.paymentHandle);
  const [accountName, setAccountName] = useState(adminPaymentConfig.accountName);
  const [paymentInstructions, setPaymentInstructions] = useState(adminPaymentConfig.paymentInstructions);
  const [qrSaveSuccess, setQrSaveSuccess] = useState(false);

  // Genre preset options
  const genreOptions = ['Sci-Fi', 'Drama', 'Fantasy', 'Cyberpunk', 'Surreal', 'Mystery', 'Thriller', 'Animation', 'Action', 'Art House'];

  // Preset thumbnails for quick selection
  const thumbnailPresets = [
    { name: 'Noir Detective', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
    { name: 'Fantasy Forest', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80' },
    { name: 'Space Void', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
    { name: 'Vintage Projector', url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Gothic Castle', url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80' }
  ];

  // Preset videos
  const videoPresets = [
    { name: 'Tears of Steel (4K Sci-Fi)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
    { name: 'Sintel (Fantasy Adventure)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
    { name: 'Big Buck Bunny (Animation)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { name: 'Elephants Dream (Sci-Fi / Drama)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }
  ];

  // Handle local thumbnail image upload
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setThumbnailUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local QR code image upload
  const handleQRCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setQrCodeUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local video file upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setVideoUrl(localUrl);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  // Submit new film
  const handleFilmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Film title is required');
      return;
    }
    if (!description.trim()) {
      setFormError('Film description is required');
      return;
    }
    if (!runtime || runtime <= 0) {
      setFormError('Please enter a valid runtime in minutes');
      return;
    }

    setFormError('');

    const newFilm: Film = {
      id: 'film-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      synopsis: description.trim(),
      runtime: Number(runtime),
      duration: Number(runtime),
      genre: genre.trim() || 'Indie',
      genres: [genre.trim() || 'Indie'],
      thumbnail: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      posterUrl: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      videoUrl: videoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      trailerUrl: videoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      price: Number(price) || 5.00,
      ticketPrice: Number(price) || 5.00,
      director: director.trim() || 'Independent Director',
      tagline: tagline.trim() || 'An independent cinematic creation.',
      rating: rating,
      releaseYear: new Date().getFullYear(),
      createdAt: Date.now()
    };

    onAddFilm(newFilm);
    cinemaAudio.playTicketPunch();
    setUploadSuccess(true);

    // Reset form
    setTitle('');
    setDescription('');
    setRuntime(12);
    setThumbnailUrl('');
    setVideoUrl('');
    setDirector('');
    setTagline('');

    setTimeout(() => {
      setUploadSuccess(false);
    }, 4000);
  };

  // Save Admin QR Code Settings
  const handleSaveQRSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminPaymentConfig = {
      qrCodeUrl: qrCodeUrl.trim() || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentHandle.trim())}`,
      paymentHandle: paymentHandle.trim() || 'admin@upi',
      accountName: accountName.trim() || 'Film Studio Admin',
      paymentInstructions: paymentInstructions.trim() || 'Scan QR code and confirm transaction reference.',
      currencySymbol: '$'
    };

    onUpdatePaymentConfig(updated);
    cinemaAudio.playChime();
    setQrSaveSuccess(true);
    setTimeout(() => setQrSaveSuccess(false), 3000);
  };

  // Analytics totals
  const totalRevenue = purchases.reduce((acc, p) => acc + (p.pricePaid || 0), 0);
  const totalFilmsSold = purchases.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Back Navigation Bar */}
      {onGoBack && (
        <div className="mb-6 flex items-center justify-between bg-[#101017] border border-zinc-800/80 px-4 py-2.5 rounded-xl shadow-lg">
          <button
            onClick={() => {
              cinemaAudio.playChime();
              onGoBack();
            }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#181824] hover:bg-[#222234] text-amber-300 hover:text-amber-200 border border-[#d4af37]/40 hover:border-amber-400 text-xs font-serif font-semibold shadow transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Film Catalog</span>
          </button>
          <div className="text-[11px] font-mono text-zinc-500 hidden sm:block">
            Cinema Management Mode
          </div>
        </div>
      )}

      {/* Admin Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#181822] border border-[#d4af37]/40 text-xs text-amber-300 font-serif uppercase tracking-widest mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin & Creator Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-amber-100">
            Cinema Management & Payment Portal
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Upload new films to the catalog, configure your direct payment QR code, and oversee film distribution.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#101016] p-1.5 rounded-xl border border-zinc-800 text-xs font-serif">
          <button
            onClick={() => setActiveSubTab('upload')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer transition-all ${
              activeSubTab === 'upload'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Film</span>
          </button>

          <button
            onClick={() => setActiveSubTab('qr-settings')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer transition-all ${
              activeSubTab === 'qr-settings'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Payment QR Code</span>
          </button>

          <button
            onClick={() => setActiveSubTab('repertory')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer transition-all ${
              activeSubTab === 'repertory'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FilmIcon className="w-3.5 h-3.5" />
            <span>Catalog ({films.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sales')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer transition-all ${
              activeSubTab === 'sales'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Sales & Ledger</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: UPLOAD FILM DETAILS */}
      {activeSubTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 rounded-2xl bg-[#101016] border border-zinc-800 p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-1 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Add Film Details to Catalog</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Enter title, description, runtime, genre, and upload thumbnail image.
            </p>

            {uploadSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/70 text-emerald-200 text-xs flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Film details successfully published to the active cinema catalog!</span>
              </div>
            )}

            {formError && (
              <div className="mb-6 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFilmSubmit} className="space-y-5 text-xs">
              {/* Title & Runtime */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                    Film Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Chronicles of the Nebula"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#161620] border border-zinc-700 text-amber-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                    Runtime (Minutes) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={runtime}
                    onChange={(e) => setRuntime(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#161620] border border-zinc-700 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Genre & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                    Genre *
                  </label>
                  <div className="flex items-center space-x-2">
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#161620] border border-zinc-700 text-amber-200 focus:outline-none focus:border-amber-400"
                    >
                      {genreOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                    Purchase Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#161620] border border-zinc-700 text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              {/* Description (synopsis) */}
              <div>
                <label className="font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                  Film Description / Synopsis *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the story, premise, and cinematic mood of the film..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#161620] border border-zinc-700 text-amber-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Thumbnail / Poster Image Upload */}
              <div>
                <label className="font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                  Thumbnail Image * (Upload File or Enter URL)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or upload below"
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#161620] border border-zinc-700 text-amber-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                  <label className="px-4 py-2.5 rounded-lg bg-[#20202e] hover:bg-[#2c2c3e] border border-zinc-600 text-amber-200 flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 transition-colors">
                    <Image className="w-4 h-4 text-amber-400" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset thumbnail choices */}
                <div className="mt-2 flex items-center space-x-2 overflow-x-auto pb-1">
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap">Presets:</span>
                  {thumbnailPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setThumbnailUrl(preset.url)}
                      className="px-2 py-0.5 rounded bg-[#171722] hover:bg-[#252536] text-[10px] text-zinc-400 hover:text-amber-300 border border-zinc-800 whitespace-nowrap cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Stream or File */}
              <div>
                <label className="font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                  Video File or Stream URL (for Screening Room)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://commondatastorage.googleapis.com/... or upload"
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#161620] border border-zinc-700 text-amber-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                  <label className="px-4 py-2.5 rounded-lg bg-[#20202e] hover:bg-[#2c2c3e] border border-zinc-600 text-amber-200 flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 transition-colors">
                    <Video className="w-4 h-4 text-amber-400" />
                    <span>Upload Video File</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Video presets */}
                <div className="mt-2 flex items-center space-x-2 overflow-x-auto pb-1">
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap">Sample Videos:</span>
                  {videoPresets.map((vp) => (
                    <button
                      key={vp.name}
                      type="button"
                      onClick={() => setVideoUrl(vp.url)}
                      className="px-2 py-0.5 rounded bg-[#171722] hover:bg-[#252536] text-[10px] text-zinc-400 hover:text-amber-300 border border-zinc-800 whitespace-nowrap cursor-pointer"
                    >
                      {vp.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Director & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-800">
                <div>
                  <label className="font-serif uppercase tracking-wider text-zinc-400 block mb-1">
                    Director Name
                  </label>
                  <input
                    type="text"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    placeholder="e.g. Christopher Nolan"
                    className="w-full px-3 py-2 rounded-lg bg-[#161620] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-serif uppercase tracking-wider text-zinc-400 block mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Love is the remnant."
                    className="w-full px-3 py-2 rounded-lg bg-[#161620] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-serif uppercase tracking-wider text-zinc-400 block mb-1">
                    Age Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#161620] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="G">G - General</option>
                    <option value="PG">PG - Parental Guidance</option>
                    <option value="PG-13">PG-13 - Teens</option>
                    <option value="R">R - Mature</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-serif font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center space-x-2 cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4 text-black" />
                  <span>Publish Film Details to Catalog</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Card Preview */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#101016] border border-zinc-800 p-5 shadow-xl">
              <span className="text-[11px] font-serif uppercase tracking-widest text-amber-400 block mb-3 font-semibold">
                Live Catalog Card Preview
              </span>

              <div className="rounded-xl bg-[#0a0a0d] border border-[#d4af37]/30 overflow-hidden shadow-lg">
                <div className="relative aspect-[16/10] bg-zinc-900">
                  <img
                    src={thumbnailUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-amber-300 font-serif font-bold uppercase">
                    {genre}
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[11px] text-zinc-300 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{runtime} mins</span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-serif font-bold text-amber-100 truncate text-sm mb-1">
                    {title || 'Untitled Film'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                    {description || 'Film synopsis will appear here for patrons to read before unlocking.'}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="font-mono text-sm text-amber-300 font-bold">
                      ${Number(price).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-amber-400 font-serif">
                      QR Unlock
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin QR Code Shortcut */}
            <div className="rounded-2xl bg-[#101016] border border-zinc-800 p-5">
              <div className="flex items-center space-x-2.5 mb-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-serif font-bold text-amber-200 uppercase tracking-wider">
                  Active Payment Recipient
                </h4>
              </div>
              <p className="text-[11px] text-zinc-400 mb-3 leading-snug">
                Patrons will scan your QR code to purchase films. Your current handle is:
              </p>
              <div className="p-2.5 rounded-lg bg-[#161622] border border-zinc-700 font-mono text-xs text-amber-300 truncate">
                {adminPaymentConfig.paymentHandle}
              </div>
              <button
                onClick={() => setActiveSubTab('qr-settings')}
                className="mt-3 text-xs text-amber-400 hover:text-amber-300 underline font-serif cursor-pointer block"
              >
                Change QR Code or Payment Handle →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ADMIN PAYMENT QR CODE SETTINGS */}
      {activeSubTab === 'qr-settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 rounded-2xl bg-[#101016] border border-zinc-800 p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-1 flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-amber-400" />
              <span>Admin Payment QR Code & Instructions</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Upload your own QR code image (UPI / PayPal / Venmo / Bank / Crypto) or provide a QR image link so users can pay you directly for movies.
            </p>

            {qrSaveSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/70 text-emerald-200 text-xs flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Payment QR Code settings updated and saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveQRSettings} className="space-y-5 text-xs">
              {/* QR Code Upload / URL */}
              <div>
                <label className="font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                  Payment QR Code * (Upload Screenshot or Enter Image URL)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={qrCodeUrl}
                    onChange={(e) => setQrCodeUrl(e.target.value)}
                    placeholder="Image URL or upload file below"
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#161620] border border-zinc-700 text-amber-100 font-mono text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                  <label className="px-4 py-2.5 rounded-lg bg-[#20202e] hover:bg-[#2c2c3e] border border-zinc-600 text-amber-200 flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload QR Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQRCodeUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  You can upload a screenshot of your Google Pay, PhonePe, Paytm, CashApp, or Banking QR code.
                </p>
              </div>

              {/* Payment Handle / UPI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                    UPI ID / Payment Handle / Username *
                  </label>
                  <input
                    type="text"
                    value={paymentHandle}
                    onChange={(e) => setPaymentHandle(e.target.value)}
                    placeholder="e.g. director.creator@upi"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#161620] border border-zinc-700 text-amber-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                    Account / Creator Name *
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g. The Grand Majestic Studio"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#161620] border border-zinc-700 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="font-serif uppercase tracking-wider text-zinc-300 block mb-1.5 font-medium">
                  Payment Instructions for Patrons *
                </label>
                <textarea
                  rows={3}
                  value={paymentInstructions}
                  onChange={(e) => setPaymentInstructions(e.target.value)}
                  placeholder="Instructions displayed next to the QR code during checkout..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#161620] border border-zinc-700 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Save Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-serif font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center space-x-2 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4 text-black" />
                  <span>Save Payment QR Code & Settings</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live QR Preview */}
          <div className="rounded-2xl bg-[#101016] border border-zinc-800 p-6 shadow-xl text-center">
            <span className="text-[11px] font-serif uppercase tracking-widest text-amber-400 block mb-3 font-semibold">
              Live Patron View Preview
            </span>

            <div className="bg-[#14141d] rounded-xl border border-[#d4af37]/30 p-5 flex flex-col items-center">
              <div className="p-2.5 bg-white rounded-xl shadow-lg mb-3 max-w-[190px] w-full aspect-square flex items-center justify-center border-2 border-amber-400">
                <img
                  src={qrCodeUrl}
                  alt="Admin QR Code Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paymentHandle)}`;
                  }}
                />
              </div>

              <div className="text-xs text-amber-200 font-mono font-medium truncate max-w-full mb-1">
                {paymentHandle}
              </div>
              <div className="text-[10px] text-zinc-400 mb-3">
                Payee: {accountName}
              </div>
              <div className="text-[11px] text-zinc-400 bg-[#0d0d12] p-2.5 rounded border border-zinc-800 leading-snug">
                {paymentInstructions}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: FILM CATALOG REPERTORY */}
      {activeSubTab === 'repertory' && (
        <div className="rounded-2xl bg-[#101016] border border-zinc-800 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-amber-100">
                Active Film Repertory ({films.length})
              </h3>
              <p className="text-xs text-zinc-400">
                Manage films currently active in the catalog.
              </p>
            </div>

            <button
              onClick={onResetCatalogue}
              className="px-3.5 py-1.5 rounded-lg bg-[#181824] hover:bg-[#252538] text-zinc-300 text-xs font-serif border border-zinc-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-serif uppercase tracking-wider">
                  <th className="py-3 px-3">Film</th>
                  <th className="py-3 px-3">Runtime</th>
                  <th className="py-3 px-3">Genre</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {films.map((f) => (
                  <tr key={f.id} className="hover:bg-[#151520] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={f.thumbnail || f.posterUrl}
                          alt={f.title}
                          className="w-10 h-10 object-cover rounded border border-zinc-700 shrink-0"
                        />
                        <div>
                          <span className="font-serif font-bold text-amber-100 block">
                            {f.title}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {f.director || 'Independent'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-zinc-300">
                      <span className="flex items-center space-x-1 font-mono">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{f.runtime || f.duration}m</span>
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#1c1c28] text-amber-300/90 text-[10px] border border-zinc-800">
                        {f.genre || (f.genres && f.genres[0])}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-amber-300">
                      ${(f.price || f.ticketPrice || 0).toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            cinemaAudio.playCurtainSwoosh();
                            onTestPlayFilm(f);
                          }}
                          className="p-1.5 rounded bg-[#181824] hover:bg-[#28283a] text-amber-400 border border-zinc-700 cursor-pointer transition-colors"
                          title="Test Play in Screening Room"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <button
                          onClick={() => onDeleteFilm(f.id)}
                          className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/60 cursor-pointer transition-colors"
                          title="Remove from Catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SALES & LEDGER */}
      {activeSubTab === 'sales' && (
        <div className="space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#101016] border border-zinc-800 p-5">
              <span className="text-[10px] uppercase font-serif tracking-wider text-zinc-400 block mb-1">
                Total Revenue Collected via QR
              </span>
              <div className="text-3xl font-black font-mono text-amber-300">
                ${totalRevenue.toFixed(2)}
              </div>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Direct P2P settlement to your wallet
              </span>
            </div>

            <div className="rounded-xl bg-[#101016] border border-zinc-800 p-5">
              <span className="text-[10px] uppercase font-serif tracking-wider text-zinc-400 block mb-1">
                Total Film Copies Unlocked
              </span>
              <div className="text-3xl font-black font-mono text-amber-100">
                {totalFilmsSold}
              </div>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Patrons with permanent access
              </span>
            </div>
          </div>

          {/* Purchase transaction ledger */}
          <div className="rounded-2xl bg-[#101016] border border-zinc-800 p-6 shadow-xl">
            <h3 className="text-base font-serif font-bold text-amber-100 mb-4">
              Recent QR Payment Transactions
            </h3>

            {purchases.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                No purchases recorded yet. When patrons scan your QR code and confirm payment, receipts will appear here.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {purchases.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-serif font-bold text-amber-200 block">
                        {p.filmTitle}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Buyer: {p.buyerName} • Ref: {p.transactionRef} • {p.purchaseDate}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400 block">
                        +${p.pricePaid.toFixed(2)}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-emerald-500">
                        Confirmed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
