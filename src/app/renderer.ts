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
    const fieldCenter = {
      x: fieldWidth * 0.5,
      y: fieldHeight * 0.5,
    };
    this.ctx.beginPath();

    this.ctx.lineWidth = (fieldWidth + fieldHeight) / 5;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.shadowColor = 'rgb(33,33,33)';
    this.ctx.shadowBlur = 5;
    this.ctx.shadowOffsetY = 1;
    this.ctx.strokeStyle = 'green';

    this.drawSnakePart(
      snakeDirection,
      snakeParts[0],
      fieldWidth,
      fieldHeight,
      distancePerFrameX,
      distancePerFrameY,
      frameIndex,
      fieldCenter,
      true
    );

    this.drawSnakeBodyParts(fieldWidth, fieldHeight, fieldCenter);

    const lastPart = snakeParts[snakeParts.length - 1];
    const prevPartDirection: Direction = this.getPrevPartDirection(
      snakeParts,
      lastPart
    );

    this.drawSnakePart(
      prevPartDirection,
      lastPart,
      fieldWidth,
      fieldHeight,
      distancePerFrameX,
      distancePerFrameY,
      frameIndex,
      fieldCenter
    );

    this.ctx.stroke();
    this.resetShadow();
    this.ctx.closePath();
  }

  private drawSnakeBodyParts(
    fieldWidth: number,
    fieldHeight: number,
    fieldCenter: { x: number; y: number }
  ) {
    this.game.snake.parts.forEach((part, index) => {
      if (index === 0) return;

      this.ctx.lineTo(
        part.x * fieldWidth + fieldCenter.x,
        part.y * fieldHeight + fieldCenter.y
      );
    });
  }

  private getPrevPartDirection(snakeParts: Position[], lastPart: Position) {
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
    return prevPartDirection;
  }

  private drawSnakePart(
    snakeDirection: string,
    snakePart: Position,
    fieldWidth: number,
    fieldHeight: number,
    distancePerFrameX: number,
    distancePerFrameY: number,
    frameIndex: number,
    fieldCenter: { x: number; y: number },
    isHead: boolean = false
  ) {
    const contextMethod: keyof ContextPath2D = isHead ? 'moveTo' : 'lineTo';
    switch (snakeDirection) {
      case 'right': {
        this.ctx[contextMethod](
          snakePart.x * fieldWidth +
            fieldCenter.x +
            distancePerFrameX * frameIndex,
          snakePart.y * fieldHeight + fieldCenter.y
        );
        break;
      }
      case 'left': {
        this.ctx[contextMethod](
          snakePart.x * fieldWidth +
            fieldCenter.x -
            distancePerFrameX * frameIndex,
          snakePart.y * fieldHeight + fieldCenter.y
        );
        break;
      }
      case 'up': {
        this.ctx[contextMethod](
          snakePart.x * fieldWidth + fieldCenter.x,
          snakePart.y * fieldHeight +
            fieldCenter.x -
            distancePerFrameY * frameIndex
        );
        break;
      }
      case 'down': {
        this.ctx[contextMethod](
          snakePart.x * fieldWidth + fieldCenter.x,
          snakePart.y * fieldHeight +
            fieldCenter.y +
            distancePerFrameY * frameIndex
        );
        break;
      }
    }
  }

  private resetShadow() {
    this.ctx.shadowColor = 'rgba(0,0,0,0)';
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
