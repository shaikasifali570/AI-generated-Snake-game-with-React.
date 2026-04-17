/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number; // in seconds
  cover: string;
}

export interface GameState {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}
