import { Game } from './game';
import { Position } from './position';
import { ContextPath2D, Direction } from './types';

export class GameRenderer {
  private ctx: ContextPath2D;
  private game: Game;

  constructor(game: Game, ctx: ContextPath2D) {
    this.game = game;
    this.ctx = ctx;
  }

  getRenderingContext(fps: number) {
    let remainingFrames = 0;
    let snakeDirection: Direction;
    let snakeParts: Position[];

    return () => {
      switch (this.game.currentGameState.status) {
        case 'paused':
        case 'stopped': {
          return;
        }
        case 'initial': {
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

    this.clearCanvas();
    this.drawGameFields(fieldWidth, fieldHeight);
    this.drawFood(fieldWidth, fieldHeight);
    this.drawSnake(
      fieldWidth,
      fieldHeight,
      distancePerFrameX,
      distancePerFrameY,
      frameIndex,
      snakeDirection,
      snakeParts,
      remainingFrames / fps
    );
  }

  private drawGameFields(fieldWidth: number, fieldHeight: number) {
    for (let i = 0; i < this.game.config.gridSize; i++) {
      for (let j = 0; j < this.game.config.gridSize; j++) {
        this.ctx.beginPath();
        this.ctx.fillStyle = ['#a5d6a7', '#c8e6c9'][(i + j) % 2];
        this.ctx.fillRect(
          j * fieldWidth,
          i * fieldHeight,
          fieldWidth,
          fieldHeight
        );
        this.ctx.closePath();
      }
    }
  }

  private drawFood(fieldWidth: number, fieldHeight: number) {
    this.ctx.fillStyle = '#ef5350';
    this.ctx.fillRect(
      this.game.food.position.x * fieldWidth,
      this.game.food.position.y * fieldHeight,
      fieldWidth,
      fieldHeight
    );
  }

  private drawSnake(
    fieldWidth: number,
    fieldHeight: number,
    distancePerFrameX: number,
    distancePerFrameY: number,
    frameIndex: number,
    snakeDirection: Direction,
    snakeParts: Position[],
    percentage: number
  ) {
    this.ctx.beginPath(); // Start a new path.
    this.ctx.lineWidth = (fieldWidth + fieldHeight) / 3;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = 'green'; // This path is green.
    switch (snakeDirection) {
      case 'right': {
        this.ctx.moveTo(
          snakeParts[0].x * fieldWidth +
            fieldWidth * 0.5 +
            distancePerFrameX * frameIndex,
          snakeParts[0].y * fieldHeight + fieldHeight * 0.5
        );
        break;
      }
      case 'left': {
        this.ctx.moveTo(
          snakeParts[0].x * fieldWidth +
            fieldWidth * 0.5 -
            distancePerFrameX * frameIndex,
          snakeParts[0].y * fieldHeight + fieldHeight * 0.5
        );
        break;
      }
      case 'up': {
        this.ctx.moveTo(
          snakeParts[0].x * fieldWidth + fieldWidth * 0.5,
          snakeParts[0].y * fieldHeight +
            fieldWidth * 0.5 -
            distancePerFrameY * frameIndex
        );
        break;
      }
      case 'down': {
        this.ctx.moveTo(
          snakeParts[0].x * fieldWidth + fieldWidth * 0.5,
          snakeParts[0].y * fieldHeight +
            fieldHeight * 0.5 +
            distancePerFrameY * frameIndex
        );
        break;
      }
    }

    this.game.snake.parts.forEach((part, index) => {
      if (index === 0) return;

      this.ctx.lineTo(
        part.x * fieldWidth + fieldWidth * 0.5,
        part.y * fieldHeight + fieldHeight * 0.5
      );
    });

    const lastPart = snakeParts[snakeParts.length - 1];
    const nextToLastPart = snakeParts[snakeParts.length - 2];

    let prevPartDirection: Direction;
    if (lastPart.x === nextToLastPart.x && lastPart.y < nextToLastPart.y) {
      prevPartDirection = 'down';
    } else if (
      lastPart.x === nextToLastPart.x &&
      lastPart.y > nextToLastPart.y
    ) {
      prevPartDirection = 'up';
    } else if (
      lastPart.x < nextToLastPart.x &&
      lastPart.y === nextToLastPart.y
    ) {
      prevPartDirection = 'right';
    } else if (
      lastPart.x > nextToLastPart.x &&
      lastPart.y === nextToLastPart.y
    ) {
      prevPartDirection = 'left';
    }

    switch (prevPartDirection) {
      case 'right':
        this.ctx.lineTo(
          lastPart.x * fieldWidth +
            fieldWidth * 0.5 +
            distancePerFrameX * frameIndex,
          lastPart.y * fieldHeight + fieldHeight * 0.5
        );
        break;
      case 'left':
        this.ctx.lineTo(
          lastPart.x * fieldWidth +
            fieldWidth * 0.5 -
            distancePerFrameX * frameIndex,
          lastPart.y * fieldHeight + fieldHeight * 0.5
        );
        break;
      case 'up':
        this.ctx.lineTo(
          lastPart.x * fieldWidth + fieldWidth * 0.5,
          lastPart.y * fieldHeight +
            fieldHeight * 0.5 -
            distancePerFrameY * frameIndex
        );
        break;
      case 'down':
        this.ctx.lineTo(
          lastPart.x * fieldWidth + fieldWidth * 0.5,
          lastPart.y * fieldHeight +
            fieldHeight * 0.5 +
            distancePerFrameY * frameIndex
        );
        break;
    }

    this.ctx.stroke();
    this.ctx.closePath();
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(
      0,
      0,
      this.ctx.canvas.clientWidth,
      this.ctx.canvas.clientHeight
    );
  }
}
