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
      snakeParts
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
    snakeParts: Position[]
  ) {
    this.drawSnakePart(
      snakeParts[0],
      fieldWidth,
      snakeDirection,
      distancePerFrameX,
      distancePerFrameY,
      frameIndex,
      fieldHeight,
      true
    );

    snakeParts.forEach((part, index) => {
      if (index === 0) return;
      const prevPart = snakeParts[index - 1];
      const curPart = part;

      let prevPartDirection: Direction;
      if (curPart.x === prevPart.x && curPart.y < prevPart.y) {
        prevPartDirection = 'down';
      } else if (curPart.x === prevPart.x && curPart.y > prevPart.y) {
        prevPartDirection = 'up';
      } else if (curPart.x < prevPart.x && curPart.y === prevPart.y) {
        prevPartDirection = 'right';
      } else if (curPart.x > prevPart.x && curPart.y === prevPart.y) {
        prevPartDirection = 'left';
      }

      this.drawSnakePart(
        curPart,
        fieldWidth,
        prevPartDirection,
        distancePerFrameX,
        distancePerFrameY,
        frameIndex,
        fieldHeight
      );
    });
  }

  private drawSnakePart(
    snakePart: Position,
    fieldWidth: number,
    snakeDirection: string,
    distancePerFrameX: number,
    distancePerFrameY: number,
    frameIndex: number,
    fieldHeight: number,
    isHead = false
  ) {
    this.ctx.fillStyle = '#00695c';
    const xCurrentPosition = snakePart.x * fieldWidth;
    const yCurrentPosition = snakePart.y * fieldWidth;
    let x;
    let y;
    switch (snakeDirection) {
      case 'right': {
        x = xCurrentPosition + distancePerFrameX * frameIndex;
        y = yCurrentPosition;
        break;
      }
      case 'down': {
        x = xCurrentPosition;
        y = yCurrentPosition + distancePerFrameY * frameIndex;
        break;
      }
      case 'left': {
        x = xCurrentPosition - distancePerFrameX * frameIndex;
        y = yCurrentPosition;
        break;
      }
      case 'up': {
        x = xCurrentPosition;
        y = yCurrentPosition - distancePerFrameY * frameIndex;
        break;
      }
    }

    if (isHead) {
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, fieldWidth, fieldHeight, [0, 20, 20, 0]);
      this.ctx.fill();
    } else {
      this.ctx.fillRect(x, y, fieldWidth, fieldHeight);
    }
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
