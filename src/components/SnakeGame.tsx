/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { GameState } from '../types';
import { RefreshCcw, Play } from 'lucide-react';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export default function SnakeGame({ onScoreUpdate }: SnakeGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 5, y: 5 },
    direction: 'UP',
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const gameLoopRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((snake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      food: generateFood([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]),
      direction: 'UP',
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
    onScoreUpdate(0);
  };

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState(prev => {
      const head = { ...prev.snake[0] };
      switch (prev.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check walls
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prev, isGameOver: true };
      }

      // Check self-collision
      if (prev.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      let newScore = prev.score;
      let newFood = prev.food;

      // Check food
      if (head.x === prev.food.x && head.y === prev.food.y) {
        newScore += 10;
        newFood = generateFood(newSnake);
        onScoreUpdate(newScore);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
      };
    });
  }, [gameState.isGameOver, gameState.isPaused, generateFood, onScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setGameState(prev => {
        if (prev.isGameOver) return prev;
        
        const key = e.key;
        if (key === 'ArrowUp' && prev.direction !== 'DOWN') return { ...prev, direction: 'UP' };
        if (key === 'ArrowDown' && prev.direction !== 'UP') return { ...prev, direction: 'DOWN' };
        if (key === 'ArrowLeft' && prev.direction !== 'RIGHT') return { ...prev, direction: 'LEFT' };
        if (key === 'ArrowRight' && prev.direction !== 'LEFT') return { ...prev, direction: 'RIGHT' };
        if (key === ' ') return { ...prev, isPaused: !prev.isPaused };
        
        return prev;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - gameState.score * SPEED_INCREMENT);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, gameState.score]);

  return (
    <div className="flex flex-col items-center gap-6" id="game-container">
      <div 
        ref={containerRef}
        className="relative bg-black w-[500px] h-[500px] border-4 border-glitch-cyan shadow-[8px_8px_0px_#ff00ff] overflow-hidden"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* CRT Scanlines Mockup */}
        <div className="absolute inset-0 pointer-events-none z-30 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

        {/* Binary Dust */}
        <div className="absolute inset-0 grid pointer-events-none opacity-[0.08] font-pixel text-[6px] text-glitch-cyan p-1" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">{Math.random() > 0.5 ? '1' : '0'}</div>
          ))}
        </div>

        {/* Data Packet (Food) */}
        <motion.div 
          id="game-food"
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0.8, 1.1, 0.8],
            x: [0, 1, -1, 0],
            y: [0, -1, 1, 0]
          }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="bg-glitch-magenta glitch-border m-1"
          style={{ 
            gridColumn: gameState.food.x + 1, 
            gridRow: gameState.food.y + 1,
            zIndex: 10
          }}
        />

        {/* Snake Logic Nodes */}
        {gameState.snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <motion.div 
              key={`${index}-${segment.x}-${segment.y}`}
              id={isHead ? 'snake-head' : `snake-segment-${index}`}
              className={`${isHead ? 'bg-glitch-cyan' : 'bg-transparent border border-glitch-cyan/60'}`}
              style={{ 
                gridColumn: segment.x + 1, 
                gridRow: segment.y + 1,
                zIndex: isHead ? 20 : 15 - index,
              }}
              initial={isHead ? false : { scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.05 }}
            />
          );
        })}

        {/* Terminal Death Overlay */}
        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-noise-bg"
            >
              <div className="flex flex-col items-center animate-bounce">
                 <h3 className="font-pixel text-4xl text-glitch-magenta mb-2 glitch-text tracking-tighter uppercase underline decoration-glitch-cyan">SYS_CRITICAL</h3>
                 <p className="font-pixel text-[12px] text-glitch-cyan uppercase tracking-[0.4em] mb-12">Err: Link_Severed // Final_S: {gameState.score}</p>
              </div>
              
              <button 
                id="btn-reboot"
                onClick={resetGame}
                className="px-12 py-5 bg-glitch-cyan text-black font-pixel text-xl glitch-border hover:bg-glitch-magenta transition-all active:translate-y-1 uppercase tracking-tighter"
              >
                REBOOT_CORE
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Node */}
        <AnimatePresence>
          {gameState.isPaused && !gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-glitch-black/80 backdrop-grayscale pointer-events-auto cursor-pointer"
              onClick={() => setGameState(p => ({ ...p, isPaused: false }))}
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 border-4 border-glitch-cyan flex items-center justify-center mb-6 glitch-border animate-pulse bg-glitch-cyan/10">
                  <Play size={40} className="text-glitch-magenta ml-1" fill="currentColor" />
                </div>
                <span className="text-glitch-cyan font-pixel text-[11px] uppercase tracking-[0.6em] animate-pulse">Waiting for Link</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-12 font-pixel text-[10px] text-glitch-cyan/40 uppercase tracking-[0.2em]" id="game-status-bar">
          <button onClick={resetGame} className="lowercase hover:text-glitch-magenta transition-colors flex items-center gap-2">
            <RefreshCcw size={12} /> rm -rf /game
          </button>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-glitch-cyan" /> NODE_0
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-glitch-cyan" /> NODE_N
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-glitch-magenta" /> PKT_LOST
          </div>
      </div>
    </div>
  );
}
