type ImageName = 'apple' | 'trophy';

type ImageData = {
  path: string;
  altText: string;
};

export class ImageService {
  private readonly imageRegistry = new Map<ImageName, ImageData>();

  constructor() {
    this.imageRegistry.set('apple', {
      path: 'red_apple_color.svg',
      altText: 'Red apple icon',
    });
    this.imageRegistry.set('trophy', {
      path: 'trophy_color.svg',
      altText: 'Trophy icon',
    });
  }

  getImage(imageName: ImageName) {
    const imageData = this.imageRegistry.get(imageName);
    const imageFromPath = require(`../../img/${imageData.path}`);
    const imageElement = new Image();
    imageElement.src = imageFromPath;
    imageElement.alt = imageData.altText;
    return imageElement;
  }
}
