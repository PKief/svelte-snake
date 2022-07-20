import { Position } from './position';

export class Food {
  position: Position;
  image: CanvasImageSource;

  constructor(position: Position) {
    this.position = position;

    this.loadFoodImage();
  }

  private loadFoodImage() {
    const foodApple = require('../img/food-apple.svg');
    const img = new Image();
    img.src = foodApple;
    this.image = img;
  }
}
