import React, { useState, useRef, useEffect } from 'react';
import { Film } from '../types';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, 
  Sparkles, ArrowLeft, Sun, Moon, Clock, Film as FilmIcon, 
  CheckCircle2, QrCode 
} from 'lucide-react';
import { cinemaAudio } from '../utils/audio';

interface ScreeningRoomProps {
  film: Film;
  isOwned: boolean;
  onExit: () => void;
  onBuyFilm: (film: Film) => void;
}

export const ScreeningRoom: React.FC<ScreeningRoomProps> = ({
  film,
  isOwned,
  onExit,
  onBuyFilm
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [lightsLevel, setLightsLevel] = useState<'dark' | 'ambient' | 'bright'>('ambient');
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Open curtains on room entrance
  useEffect(() => {
    cinemaAudio.playCurtainSwoosh();
    const timer = setTimeout(() => {
      setCurtainsOpen(true);
      // Auto dim lights once curtains open
      setLightsLevel('dark');
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Handle controls auto-hide in dark mode
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3500);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      cinemaAudio.playProjectorClick();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Escape key to exit screening room
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        cinemaAudio.playCurtainSwoosh();
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  return (
    <div 
      className={`min-h-screen relative flex flex-col transition-colors duration-700 select-none ${
        lightsLevel === 'dark' 
          ? 'bg-[#030304]' 
          : lightsLevel === 'ambient' 
            ? 'bg-[#09090d]' 
            : 'bg-[#121218]'
      }`}
      onMouseMove={handleMouseMove}
    >
      {/* Top Screening Bar */}
      <div className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-[#0a0a0f]/90 border-b border-[#d4af37]/20 backdrop-blur-md">
        <button
          onClick={() => {
            cinemaAudio.playCurtainSwoosh();
            onExit();
          }}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#20202c] text-amber-300 hover:text-amber-200 border border-[#d4af37]/40 hover:border-amber-400 text-xs font-serif font-semibold transition-all cursor-pointer group shadow"
          title="Exit and return to previous page (ESC)"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Previous Page</span>
        </button>

        {/* Film Title */}
        <div className="text-center">
          <h2 className="text-sm sm:text-base font-serif font-bold text-amber-100 truncate max-w-xs sm:max-w-md">
            {film.title}
          </h2>
          <div className="text-[10px] text-zinc-400">
            {film.genre || (film.genres && film.genres[0])} • {film.runtime || film.duration} mins
          </div>
        </div>

        {/* Ambience & Lighting Dimmer */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setLightsLevel(lightsLevel === 'dark' ? 'ambient' : lightsLevel === 'ambient' ? 'bright' : 'dark')}
            className="p-1.5 rounded-lg bg-[#14141c] text-amber-300 border border-zinc-700 hover:border-amber-400 text-xs flex items-center space-x-1 transition-colors cursor-pointer"
            title="Toggle Auditorium Lighting"
          >
            {lightsLevel === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden sm:inline capitalize text-[11px]">{lightsLevel}</span>
          </button>
        </div>
      </div>

      {/* Main Theatre Projection Stage */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 relative overflow-hidden">
        {/* Cinema Projector Light Cone Beam from Above */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-amber-200/10 via-amber-400/5 to-transparent blur-2xl pointer-events-none"></div>

        {/* Screen Proscenium & Frame */}
        <div 
          ref={playerContainerRef}
          className="relative w-full max-w-5xl aspect-video rounded-xl bg-black border-4 border-[#1a1a24] shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden flex items-center justify-center group"
        >
          {/* Actual Video Tag */}
          <video
            ref={videoRef}
            src={film.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Curtain Left */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 curtain-noir-left z-20 transition-transform duration-1000 ease-in-out pointer-events-none ${
              curtainsOpen ? '-translate-x-full' : 'translate-x-0'
            }`}
          />

          {/* Curtain Right */}
          <div
            className={`absolute top-0 bottom-0 right-0 w-1/2 curtain-noir-right z-20 transition-transform duration-1000 ease-in-out pointer-events-none ${
              curtainsOpen ? 'translate-x-full' : 'translate-x-0'
            }`}
          />

          {/* Big Play Overlay if paused */}
          {!isPlaying && curtainsOpen && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 cursor-pointer backdrop-blur-[2px]"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-black ml-1" />
              </div>
            </div>
          )}

          {/* In-Screen Control Bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-25 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-4 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Progress Slider */}
            <div className="mb-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-300">
              {/* Left Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full hover:bg-white/10 text-amber-300 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                    }
                  }}
                  className="p-1.5 hover:text-amber-300 text-zinc-400 transition-colors cursor-pointer"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <button onClick={toggleMute} className="text-zinc-400 hover:text-white cursor-pointer">
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-amber-400 hidden sm:block"
                  />
                </div>

                <span className="font-mono text-[11px] text-zinc-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-2">
                {isOwned && (
                  <span className="hidden sm:flex items-center space-x-1 text-[10px] text-emerald-400 font-serif font-semibold mr-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Permanent Ownership</span>
                  </span>
                )}

                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 hover:text-amber-300 text-zinc-400 transition-colors cursor-pointer"
                  title="Full Screen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projection Stage Trim Underneath */}
        <div className="w-full max-w-5xl h-3 bg-gradient-to-r from-transparent via-[#2a2318] to-transparent mt-1 border-t border-[#d4af37]/30"></div>
      </div>
    </div>
  );
};
