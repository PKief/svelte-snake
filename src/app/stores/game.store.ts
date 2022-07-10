import { writable } from 'svelte/store';
import { GameState } from '../types';

export const gameState = writable<GameState>({
  fields: [],
  gameOver: false,
  score: 0,
  highScore: 0,
  status: 'initial',
});
