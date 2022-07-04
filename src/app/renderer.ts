import { Game } from './game';
import { Position } from './position';
import { Direction } from './types';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private game: Game;

  constructor(game: Game, ctx: CanvasRenderingContext2D) {
    this.game = game;
    this.ctx = ctx;
  }

  getRenderingContext(fps: number) {
    const fieldWidth = this.ctx.canvas.width / this.game.config.gridSize;
    const fieldHeight = this.ctx.canvas.height / this.game.config.gridSize;

    const tickMovementX = fieldWidth / fps;
    const tickMovementY = fieldHeight / fps;

    let tickCount = 0;
    let snakeDirection;
    let snakeParts: Position[];

    return () => {
      if (tickCount === 0) {
        tickCount = fps;
        snakeParts = this.game.snake.parts;
        snakeDirection = this.game.snake.direction;
        this.game.moveSnake();
      }
      tickCount--;
      this.clearCanvas();
      this.render(
        fieldWidth,
        fieldHeight,
        tickMovementX,
        tickMovementY,
        fps - tickCount,
        snakeDirection,
        snakeParts
      );
    };
  }

  private render(
    fieldWidth: number,
    fieldHeight: number,
    tickMovementX: number,
    tickMovementY: number,
    tickCount: number,
    snakeDirection: Direction,
    snakeParts: Position[]
  ) {
    this.drawSnake(
      fieldWidth,
      fieldHeight,
      tickMovementX,
      tickMovementY,
      tickCount,
      snakeDirection,
      snakeParts
    );

    this.drawFood(fieldWidth, fieldHeight);
  }

  private drawFood(fieldWidth: number, fieldHeight: number) {
    this.ctx.fillStyle = 'black';
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
    tickMovementX: number,
    tickMovementY: number,
    tickCount: number,
    snakeDirection: Direction,
    snakeParts: Position[]
  ) {
    this.drawSnakePart(
      snakeParts[0],
      fieldWidth,
      snakeDirection,
      tickMovementX,
      tickCount,
      tickMovementY,
      fieldHeight
    );

    this.game.snake.parts
      .slice(1, this.game.snake.parts.length)
      .forEach((part) => {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(
          part.x * fieldWidth,
          part.y * fieldHeight,
          fieldWidth,
          fieldHeight
        );
      });

    const prevPart = snakeParts[snakeParts.length - 2];
    const curPart = snakeParts[snakeParts.length - 1];

    let penultimatePartDirection: Direction;
    if (curPart.x === prevPart.x && curPart.y < prevPart.y) {
      penultimatePartDirection = 'down';
    } else if (curPart.x === prevPart.x && curPart.y > prevPart.y) {
      penultimatePartDirection = 'up';
    } else if (curPart.x < prevPart.x && curPart.y === prevPart.y) {
      penultimatePartDirection = 'right';
    } else if (curPart.x > prevPart.x && curPart.y === prevPart.y) {
      penultimatePartDirection = 'left';
    }

    this.drawSnakePart(
      curPart,
      fieldWidth,
      penultimatePartDirection,
      tickMovementX,
      tickCount,
      tickMovementY,
      fieldHeight
    );
  }

  private drawSnakePart(
    snakePart: Position,
    fieldWidth: number,
    snakeDirection: string,
    tickMovementX: number,
    tickCount: number,
    tickMovementY: number,
    fieldHeight: number
  ) {
    this.ctx.fillStyle = 'red';
    const xCurrentPosition = snakePart.x * fieldWidth;
    const yCurrentPosition = snakePart.y * fieldWidth;
    let x;
    let y;
    switch (snakeDirection) {
      case 'right': {
        x = xCurrentPosition + tickMovementX * tickCount;
        y = yCurrentPosition;
        break;
      }
      case 'down': {
        x = xCurrentPosition;
        y = yCurrentPosition + tickMovementY * tickCount;
        break;
      }
      case 'left': {
        x = xCurrentPosition - tickMovementX * tickCount;
        y = yCurrentPosition;
        break;
      }
      case 'up': {
        x = xCurrentPosition;
        y = yCurrentPosition - tickMovementY * tickCount;
        break;
      }
    }

    this.ctx.fillRect(x, y, fieldWidth, fieldHeight);
    this.ctx.fillText(
      `xS: ${this.game.snake.head.x} yS: ${this.game.snake.head.y}`,
      x,
      y
    );
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
