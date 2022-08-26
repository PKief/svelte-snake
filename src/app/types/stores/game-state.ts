import { GameField } from '../game';

export type GameState = {
  fields: GameField[][];
  score: number;
  highScore: number;
  gameOver: boolean;
  status: 'playing' | 'stopped' | 'paused' | 'initial';
};
