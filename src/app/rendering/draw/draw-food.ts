import { Food } from '../../logic/food';
import { ContextPath2D } from '../../types';
import { addShadowToContext } from '../utils/shadow';

export const drawFood =
  (ctx: ContextPath2D) =>
  (fieldWidth: number, fieldHeight: number, food: Food, scale: number) => {
    ctx.beginPath();

    const foodWidth = fieldWidth * 0.65;
    const foodHeight = fieldHeight * 0.65;

    const foodX = food.position.x * fieldWidth + fieldWidth / 2 - foodWidth / 2;
    const foodY =
      food.position.y * fieldHeight + fieldHeight / 2 - foodHeight / 2;

    const anchorX = foodX + foodWidth / 2,
      anchorY = foodY + foodHeight / 2;
    const scaledX = anchorX - anchorX * scale,
      scaledY = anchorY - anchorY * scale;

    ctx.setTransform(scale, 0, 0, scale, scaledX, scaledY);

    addShadowToContext(ctx);
    ctx.drawImage(food.image, foodX, foodY, foodWidth, foodHeight);
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
