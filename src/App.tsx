/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-glitch-black select-none cursor-crosshair">
      {/* Visual Artifacts */}
      <div className="noise-bg absolute inset-0 pointer-events-none z-50" />
      <div className="scanline pointer-events-none" />
      
      {/* Glithy border wrapper */}
      <div className="absolute inset-4 border-2 border-glitch-cyan/30 pointer-events-none z-40" />
      <div className="absolute inset-6 border border-glitch-magenta/20 pointer-events-none z-40" />

      <MusicPlayer onScoreUpdate={setScore} score={score} />
      
      {/* Cryptic background text */}
      <div className="absolute bottom-4 left-4 font-pixel text-[8px] opacity-20 pointer-events-none z-50">
        SYS_LOG: LINK_SUCCESS // SECTOR_88 // TERMINAL_ACTIVE
      </div>
    </div>
  );
}
