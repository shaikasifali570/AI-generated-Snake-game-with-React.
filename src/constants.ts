/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Song } from './types';

export const SONGS: Song[] = [
  {
    id: '1',
    title: 'Synthwave Sunset',
    artist: 'AI Gen - VibeOne',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    cover: 'https://picsum.photos/seed/synthwave/400/400',
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'AI Gen - CyberByte',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
    cover: 'https://picsum.photos/seed/neon/400/400',
  },
  {
    id: '3',
    title: 'Cyber Dreams',
    artist: 'AI Gen - DreamStack',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 310,
    cover: 'https://picsum.photos/seed/cyber/400/400',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 50;
export const SPEED_INCREMENT = 2;
