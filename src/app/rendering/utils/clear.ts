import { ContextPath2D } from 'src/app/types';

export const clearCanvas = (ctx: ContextPath2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
};
