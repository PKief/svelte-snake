export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameConfig = {
  gridSize: number;
};

export type GameState = {
  fields: GameField[][];
  score: number;
  highScore: number;
  gameOver: boolean;
  status: 'playing' | 'stopped' | 'paused' | 'initial';
};

export type GameField = {
  id: string;
  type: GameFieldType;
};

export type GameFieldType =
  | 'Field'
  | 'Food'
  | 'SnakeHead'
  | 'SnakeBody'
  | 'SnakeTail';

export type ContextPath2D = CanvasRenderingContext2D & {
  // According to specification https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-roundrect
  roundRect: (
    x: number,
    y: number,
    w: number,
    h: number,
    radii: number[]
  ) => void;
};
