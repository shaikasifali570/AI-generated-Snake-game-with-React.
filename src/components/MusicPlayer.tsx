/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Zap, Activity } from 'lucide-react';
import { SONGS } from '../constants';
import SnakeGame from './SnakeGame';

interface MusicPlayerProps {
  score: number;
  onScoreUpdate: (score: number) => void;
}

export default function MusicPlayer({ score, onScoreUpdate }: MusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = SONGS[currentSongIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("ERR_PB_FAIL", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    setIsPlaying(true);
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("ERR_PB_FAIL", e));
      }
    }
  }, [currentSongIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      nextSong();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full w-full relative z-10" id="glitch-root">
      <audio ref={audioRef} />

      {/* Header */}
      <header className="h-[80px] flex items-center justify-between px-12 border-b-2 border-glitch-cyan bg-glitch-black/90">
        <div className="flex items-center gap-4">
          <Zap size={24} className="text-glitch-magenta animate-pulse" />
          <div className="font-pixel text-2xl glitch-text tracking-tighter" id="app-logo">
            NEON_VOID.EXE
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="font-pixel text-[10px] text-glitch-magenta mb-1">RSRV_SCORE:</div>
          <div className="bg-glitch-magenta text-black px-4 py-1 font-pixel text-2xl font-bold glitch-border">
            {score.toString().padStart(6, '0')}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-[300px_1fr] overflow-hidden">
        {/* Sidebar / Data Stream */}
        <aside className="bg-glitch-black border-r-2 border-glitch-cyan/50 p-8 overflow-y-auto scrollbar-hide">
          <div className="font-pixel text-[12px] text-glitch-magenta mb-6 border-b border-glitch-magenta/30 pb-2">DATA_PACKETS</div>
          <div className="space-y-4">
            {SONGS.map((song, idx) => (
              <button
                key={song.id}
                id={`song-node-${idx}`}
                onClick={() => selectSong(idx)}
                className={`w-full text-left p-3 border-2 transition-all ${
                  currentSongIndex === idx 
                    ? 'border-glitch-cyan bg-glitch-cyan text-black' 
                    : 'border-glitch-cyan/20 hover:border-glitch-magenta text-glitch-cyan'
                }`}
              >
                <div className="font-pixel text-[11px] truncate uppercase">{song.title}</div>
                <div className="text-[10px] opacity-70 tracking-widest">{song.artist}</div>
              </button>
            ))}
          </div>
          
          <div className="mt-12 opacity-30">
            <Activity className="text-glitch-magenta mb-2" size={32} />
            <div className="text-[10px] leading-tight">
              S_STREAM: ONLINE<br/>
              B_RATE: 44.1KHZ<br/>
              P_STATE: NOMINAL
            </div>
          </div>
        </aside>

        {/* Game Chamber */}
        <section className="flex items-center justify-center p-12 bg-[#000] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 pointer-events-none p-4 overflow-hidden">
             {Array.from({length: 40}).map((_, i) => (
               <div key={i} className="font-pixel text-[8px] text-glitch-cyan">01001011_VOID</div>
             ))}
          </div>
          <SnakeGame onScoreUpdate={onScoreUpdate} />
        </section>
      </main>

      {/* Control Deck */}
      <footer className="h-[120px] bg-glitch-black border-t-2 border-glitch-magenta flex items-center justify-between px-12">
        <div className="flex items-center gap-6 w-[350px]">
          <div className="w-16 h-16 border-2 border-glitch-cyan flex-shrink-0 relative overflow-hidden bg-glitch-cyan/20">
             <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover mix-blend-screen" referrerPolicy="no-referrer" />
             <div className="absolute inset-0 bg-transparent mix-blend-color-dodge animate-pulse" />
          </div>
          <div className="truncate flex flex-col gap-1">
            <div className="font-pixel text-sm text-glitch-cyan truncate tracking-tighter uppercase">{currentSong.title}</div>
            <div className="font-pixel text-[10px] text-glitch-magenta uppercase">{formatTime(currentTime)} // {formatTime(currentSong.duration)}</div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <button onClick={prevSong} id="btn-prev" className="text-glitch-cyan hover:text-glitch-magenta hover:scale-110 active:-rotate-12 transition-all">
            <SkipBack size={28} />
          </button>
          <button 
            id="btn-play-toggle"
            onClick={togglePlay}
            className={`w-14 h-14 border-4 flex items-center justify-center transition-all ${
              isPlaying ? 'border-glitch-magenta bg-glitch-magenta text-black shadow-[0_0_20px_#ff00ff]' : 'border-glitch-cyan bg-glitch-black text-glitch-cyan'
            }`}
          >
            {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={nextSong} id="btn-next" className="text-glitch-cyan hover:text-glitch-magenta hover:scale-110 active:rotate-12 transition-all">
            <SkipForward size={28} />
          </button>
        </div>

        <div className="w-[350px] flex flex-col items-end gap-3">
          <div className="w-full h-4 bg-glitch-cyan/10 border border-glitch-cyan/50 relative">
            <motion.div 
              id="playback-progress-bar"
              className="absolute h-full bg-glitch-cyan shadow-[0_0_10px_#00ffff]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
          <div className="font-pixel text-[10px] text-glitch-cyan/40 tracking-[0.4em] uppercase">
             A_SIG: DETECTED // N_LINK: STABLE
          </div>
        </div>
      </footer>
    </div>
  );
}
