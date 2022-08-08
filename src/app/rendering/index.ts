import { Game } from '../logic/game';
import { Position } from '../logic/position';
import { ContextPath2D, Direction } from '../types';
import { drawFood } from './draw/draw-food';
import { drawGameFields } from './draw/draw-game-field';
import { drawSnake } from './draw/draw-snake';
import { clearCanvas } from './utils/clear';

export class GameRenderer {
  private ctx: ContextPath2D;
  private game: Game;
  private angleForAnimationScale = 0;
  private animationScale = 1;

  constructor(game: Game, ctx: ContextPath2D) {
    this.game = game;
    this.ctx = ctx;
  }

  getRenderingContext(fps: number) {
    let remainingFrames = 0;
    let snakeDirection: Direction;
    let snakeParts: Position[];

    return () => {
      this.updateAnimationScale();

      switch (this.game.currentGameState.status) {
        case 'initial': {
          remainingFrames = 0;
          snakeDirection = this.game.snake.direction;
          snakeParts = this.game.snake.parts;
          break;
        }
        case 'playing': {
          if (remainingFrames === 0) {
            remainingFrames = fps;
            snakeParts = this.game.snake.parts;
            snakeDirection = this.game.snake.direction;
            this.game.moveSnake();
          }
          remainingFrames--;
          break;
        }
      }

      this.renderGame(fps, remainingFrames, snakeDirection, snakeParts);
    };
  }

  private renderGame(
    fps: number,
    remainingFrames: number,
    snakeDirection: Direction,
    snakeParts: Position[]
  ) {
    const fieldWidth = this.ctx.canvas.width / this.game.config.gridSize;
    const fieldHeight = this.ctx.canvas.height / this.game.config.gridSize;

    const distancePerFrameX = fieldWidth / fps;
    const distancePerFrameY = fieldHeight / fps;
    const frameIndex =
      this.game.currentGameState.status === 'initial'
        ? 0
        : fps - remainingFrames;

    clearCanvas(this.ctx);
    drawGameFields(this.ctx)(
      fieldWidth,
      fieldHeight,
      this.game.config.gridSize
    );
    drawFood(this.ctx)(
      fieldWidth,
      fieldHeight,
      this.game.food,
      this.animationScale
    );
    drawSnake(this.ctx)(
      this.game,
      fieldWidth,
      fieldHeight,
      distancePerFrameX,
      distancePerFrameY,
      frameIndex,
      snakeDirection,
      snakeParts
    );
  }

  private updateAnimationScale() {
    this.angleForAnimationScale += Math.PI / 100;
    this.animationScale =
      0.75 + Math.abs(Math.cos(this.angleForAnimationScale)) * 0.25;
  }
}
