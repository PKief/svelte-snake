import { Game } from 'src/app/logic/game';
import { Position } from '../../logic/position';
import { ContextPath2D, Direction } from '../../types';
import { addShadowToContext, resetShadow } from '../utils/shadow';
import { drawSnakeEyes } from './draw-snake-eyes';
import { drawSnakeBodyParts } from './draw-snake-fixed-parts';
import { drawSnakePart } from './draw-snake-moving-part';

export const drawSnake =
  (ctx: ContextPath2D) =>
  (
    game: Game,
    fieldWidth: number,
    fieldHeight: number,
    distancePerFrameX: number,
    distancePerFrameY: number,
    frameIndex: number,
    snakeDirection: Direction,
    snakeParts: Position[]
  ) => {
    const fieldCenter = {
      x: fieldWidth * 0.5,
      y: fieldHeight * 0.5,
    };
    ctx.beginPath();
    ctx.lineWidth = (fieldWidth + fieldHeight) / 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#42a5f5';
    addShadowToContext(ctx);

    drawSnakePart(ctx)(
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

    drawSnakeBodyParts(ctx)(
      fieldWidth,
      fieldHeight,
      fieldCenter,
      game.snake.parts
    );

    const lastPart = snakeParts[snakeParts.length - 1];
    const prevPartDirection: Direction = getPrevPartDirection(
      snakeParts,
      lastPart
    );

    drawSnakePart(ctx)(
      prevPartDirection,
      lastPart,
      fieldWidth,
      fieldHeight,
      distancePerFrameX,
      distancePerFrameY,
      frameIndex,
      fieldCenter
    );

    ctx.stroke();
    resetShadow(ctx);
    ctx.closePath();

    drawSnakeEyes(ctx)(
      snakeParts[0],
      fieldWidth,
      fieldHeight,
      distancePerFrameX,
      distancePerFrameY,
      frameIndex,
      snakeDirection,
      fieldCenter,
      game.currentGameState.gameOver
    );
  };

const getPrevPartDirection = (snakeParts: Position[], lastPart: Position) => {
  const nextToLastPart = snakeParts[snakeParts.length - 2];

  let prevPartDirection: Direction;
  if (lastPart.x === nextToLastPart.x && lastPart.y < nextToLastPart.y) {
    prevPartDirection = 'down';
  } else if (lastPart.x === nextToLastPart.x && lastPart.y > nextToLastPart.y) {
    prevPartDirection = 'up';
  } else if (lastPart.x < nextToLastPart.x && lastPart.y === nextToLastPart.y) {
    prevPartDirection = 'right';
  } else if (lastPart.x > nextToLastPart.x && lastPart.y === nextToLastPart.y) {
    prevPartDirection = 'left';
  }
  return prevPartDirection;
};
