import { Game } from './game';
import { Position } from './position';
import { ContextPath2D, Direction } from './types';

export class GameRenderer {
  private ctx: ContextPath2D;
  private game: Game;
  private angle = 0;
  private scale = 1;

  constructor(game: Game, ctx: ContextPath2D) {
    this.game = game;
    this.ctx = ctx;
  }

  getRenderingContext(fps: number) {
    let remainingFrames = 0;
    let snakeDirection: Direction;
    let snakeParts: Position[];

    return () => {
      this.updateScale();

      switch (this.game.currentGameState.status) {
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
    this.ctx.beginPath();

    const foodApple = require('../img/food-apple.svg');
    const img = new Image();
    img.src = foodApple;

    const foodWidth = fieldWidth * 0.65;
    const foodHeight = fieldHeight * 0.65;

    const foodX =
      this.game.food.position.x * fieldWidth + fieldWidth / 2 - foodWidth / 2;
    const foodY =
      this.game.food.position.y * fieldHeight +
      fieldHeight / 2 -
      foodHeight / 2;

    const anchorX = foodX + foodWidth / 2,
      anchorY = foodY + foodHeight / 2;
    const scaledX = anchorX - anchorX * this.scale,
      scaledY = anchorY - anchorY * this.scale;

    this.ctx.setTransform(this.scale, 0, 0, this.scale, scaledX, scaledY);

    this.addShadowToContext();
    this.ctx.drawImage(img, foodX, foodY, foodWidth, foodHeight);
    this.ctx.closePath();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  private addShadowToContext() {
    this.ctx.shadowColor = '#7ba07d8f';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetY = 3;
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
    this.ctx.strokeStyle = '#42a5f5';
    this.addShadowToContext();

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

    this.drawSnakeEyes(
      snakeParts[0],
      fieldWidth,
      fieldHeight,
      distancePerFrameX,
      distancePerFrameY,
      frameIndex,
      snakeDirection,
      fieldCenter
    );
  }

  private drawSnakeEyes(
    snakePart: Position,
    fieldWidth: number,
    fieldHeight: number,
    distancePerFrameX: number,
    distancePerFrameY: number,
    frameIndex: number,
    snakeDirection: Direction,
    fieldCenter: Position
  ) {
    const eyeOffset = fieldWidth / 7;
    const radius = fieldWidth / 7;
    const pupilOffset = fieldWidth / 15;

    let x,
      y,
      eye1x,
      eye1y,
      eye2x,
      eye2y,
      eye1Pupilx,
      eye1Pupily,
      eye2Pupilx,
      eye2Pupily;

    let rotation: 1 | 2;
    switch (snakeDirection) {
      case 'right': {
        x =
          snakePart.x * fieldWidth +
          fieldCenter.x +
          distancePerFrameX * frameIndex;
        y = snakePart.y * fieldHeight + fieldCenter.y;
        eye1x = eye2x = x - eyeOffset;
        eye1Pupilx = eye2Pupilx = eye1x + pupilOffset;
        eye1y = eye1Pupily = y - eyeOffset;
        eye2y = eye2Pupily = y + eyeOffset;
        rotation = 1;
        break;
      }
      case 'left': {
        x =
          snakePart.x * fieldWidth +
          fieldCenter.x -
          distancePerFrameX * frameIndex;
        y = snakePart.y * fieldHeight + fieldCenter.y;
        eye1x = eye2x = x + eyeOffset;
        eye1Pupilx = eye2Pupilx = eye1x - pupilOffset;
        eye1y = eye1Pupily = y - eyeOffset;
        eye2y = eye2Pupily = y + eyeOffset;
        rotation = 1;
        break;
      }
      case 'up': {
        x = snakePart.x * fieldWidth + fieldCenter.x;
        y =
          snakePart.y * fieldHeight +
          fieldCenter.x -
          distancePerFrameY * frameIndex;
        eye1x = eye1Pupilx = x - eyeOffset;
        eye2x = eye2Pupilx = x + eyeOffset;
        eye1y = eye2y = y + eyeOffset;
        eye1Pupily = eye2Pupily = eye1y - pupilOffset;
        rotation = 2;
        break;
      }
      case 'down': {
        x = snakePart.x * fieldWidth + fieldCenter.x;
        y =
          snakePart.y * fieldHeight +
          fieldCenter.y +
          distancePerFrameY * frameIndex;
        eye1x = eye1Pupilx = x - eyeOffset;
        eye2x = eye2Pupilx = x + eyeOffset;
        eye1y = eye2y = y - eyeOffset;
        eye1Pupily = eye2Pupily = eye1y + pupilOffset;
        rotation = 2;
        break;
      }
    }

    if (this.game.currentGameState.gameOver) {
      const deadPupilsOffset = pupilOffset / 2;
      eye1Pupilx = eye1Pupilx - deadPupilsOffset;
      eye1Pupily = eye1Pupily - deadPupilsOffset;
      eye2Pupilx = eye2Pupilx + deadPupilsOffset;
      eye2Pupily = eye2Pupily + deadPupilsOffset;
    }

    this.ctx.beginPath();
    this.ctx.fillStyle = 'white';
    this.ctx.ellipse(
      eye1x,
      eye1y,
      radius,
      radius,
      Math.PI / rotation,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.strokeStyle = '#42a5f5';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.fillStyle = '#3f1103';
    this.ctx.ellipse(
      eye1Pupilx,
      eye1Pupily,
      radius / 2,
      radius / 2,
      Math.PI / rotation,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.fillStyle = 'white';
    this.ctx.ellipse(
      eye2x,
      eye2y,
      radius,
      radius,
      Math.PI / rotation,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.strokeStyle = '#42a5f5';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.fillStyle = '#3f1103';
    this.ctx.ellipse(
      eye2Pupilx,
      eye2Pupily,
      radius / 2,
      radius / 2,
      Math.PI / rotation,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
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
    fieldCenter: Position,
    isHead: boolean = false
  ) {
    const contextMethod: keyof ContextPath2D = isHead ? 'moveTo' : 'lineTo';
    let x, y;
    switch (snakeDirection) {
      case 'right': {
        x =
          snakePart.x * fieldWidth +
          fieldCenter.x +
          distancePerFrameX * frameIndex;
        y = snakePart.y * fieldHeight + fieldCenter.y;
        break;
      }
      case 'left': {
        x =
          snakePart.x * fieldWidth +
          fieldCenter.x -
          distancePerFrameX * frameIndex;
        y = snakePart.y * fieldHeight + fieldCenter.y;
        break;
      }
      case 'up': {
        x = snakePart.x * fieldWidth + fieldCenter.x;
        y =
          snakePart.y * fieldHeight +
          fieldCenter.x -
          distancePerFrameY * frameIndex;
        break;
      }
      case 'down': {
        x = snakePart.x * fieldWidth + fieldCenter.x;
        y =
          snakePart.y * fieldHeight +
          fieldCenter.y +
          distancePerFrameY * frameIndex;
        break;
      }
    }

    this.ctx[contextMethod](x, y);
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

  private updateScale() {
    this.angle += Math.PI / 100;
    this.scale = 0.75 + Math.abs(Math.cos(this.angle)) * 0.25;
  }
}
