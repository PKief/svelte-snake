import { ContextPath2D } from '../../types';

export const addShadowToContext = (ctx: ContextPath2D) => {
  ctx.shadowColor = '#7ba07d8f';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 3;
};

export const resetShadow = (ctx: ContextPath2D) => {
  ctx.shadowColor = 'rgba(0,0,0,0)';
};
