import { ContextPath2D } from '../../types';

export const drawGameFields =
  (ctx: ContextPath2D) =>
  (fieldWidth: number, fieldHeight: number, gridSize: number) => {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        ctx.beginPath();
        ctx.fillStyle = ['#a5d6a7', '#c8e6c9'][(i + j) % 2];
        ctx.fillRect(j * fieldWidth, i * fieldHeight, fieldWidth, fieldHeight);
        ctx.closePath();
      }
    }
  };
