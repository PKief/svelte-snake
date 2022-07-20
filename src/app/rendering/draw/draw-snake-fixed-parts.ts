import { Position } from '../../logic/position';
import { ContextPath2D } from '../../types';

export const drawSnakeBodyParts =
  (ctx: ContextPath2D) =>
  (
    fieldWidth: number,
    fieldHeight: number,
    fieldCenter: { x: number; y: number },
    snakeParts: Position[]
  ) => {
    snakeParts.forEach((part, index) => {
      if (index === 0) return;

      ctx.lineTo(
        part.x * fieldWidth + fieldCenter.x,
        part.y * fieldHeight + fieldCenter.y
      );
    });
  };
