import { Position } from '../../logic/position';
import { ContextPath2D } from '../../types';

export const drawSnakePart =
  (ctx: ContextPath2D) =>
  (
    snakeDirection: string,
    snakePart: Position,
    fieldWidth: number,
    fieldHeight: number,
    distancePerFrameX: number,
    distancePerFrameY: number,
    frameIndex: number,
    fieldCenter: Position,
    isHead: boolean = false
  ) => {
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

    ctx[contextMethod](x, y);
  };
