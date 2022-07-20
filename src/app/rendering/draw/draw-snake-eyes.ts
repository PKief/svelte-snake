import { Position } from '../../logic/position';
import { ContextPath2D, Direction } from '../../types';

export const drawSnakeEyes =
  (ctx: ContextPath2D) =>
  (
    snakePart: Position,
    fieldWidth: number,
    fieldHeight: number,
    distancePerFrameX: number,
    distancePerFrameY: number,
    frameIndex: number,
    snakeDirection: Direction,
    fieldCenter: Position,
    gameOver = false
  ) => {
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

    if (gameOver) {
      const deadPupilsOffset = pupilOffset / 2;
      eye1Pupilx = eye1Pupilx - deadPupilsOffset;
      eye1Pupily = eye1Pupily - deadPupilsOffset;
      eye2Pupilx = eye2Pupilx + deadPupilsOffset;
      eye2Pupily = eye2Pupily + deadPupilsOffset;
    }

    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.ellipse(
      eye1x,
      eye1y,
      radius,
      radius,
      Math.PI / rotation,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.strokeStyle = '#42a5f5';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = '#3f1103';
    ctx.ellipse(
      eye1Pupilx,
      eye1Pupily,
      radius / 2,
      radius / 2,
      Math.PI / rotation,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.ellipse(
      eye2x,
      eye2y,
      radius,
      radius,
      Math.PI / rotation,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.strokeStyle = '#42a5f5';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = '#3f1103';
    ctx.ellipse(
      eye2Pupilx,
      eye2Pupily,
      radius / 2,
      radius / 2,
      Math.PI / rotation,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();
  };
