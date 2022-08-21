import { getAppContext } from '../core';
import { ImageService } from '../services';
import { Position } from './position';

export class Food {
  position: Position;
  image: HTMLImageElement;
  private readonly imageService: ImageService;

  constructor(position: Position) {
    this.position = position;
    this.imageService = getAppContext('imageService');

    this.loadFoodImage();
  }

  private loadFoodImage() {
    this.image = this.imageService.getImage('apple');
  }
}
