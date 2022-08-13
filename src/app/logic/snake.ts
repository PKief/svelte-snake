import { Direction } from '../types';
import { Position } from './position';

export class Snake {
  size: number = 2;
  parts: Position[] = [];
  direction: Direction = 'right';

  get head(): Position {
    return this.parts[0];
  }

  get tail(): Position {
    return this.parts[this.parts.length - 1];
  }

  constructor(startPosition: Position, size?: number) {
    this.size = size;
    this.generateParts(startPosition);
  }

  eatFood(): void {
    this.size++;
    this.parts.push(this.parts[this.parts.length - 1]);
  }

  switchDirection(nextDirection: Direction): void {
    const isNotOppositeDirection =
      (nextDirection === 'down' && this.direction !== 'up') ||
      (nextDirection === 'up' && this.direction !== 'down') ||
      (nextDirection === 'left' && this.direction !== 'right') ||
      (nextDirection === 'right' && this.direction !== 'left');

    if (isNotOppositeDirection) {
      this.direction = nextDirection;
    }
  }

  move(): void {
    this.parts = this.parts.map((part, index) => {
      if (index === 0) {
        if (this.direction === 'up') {
          return new Position(part.x, part.y - 1);
        } else if (this.direction === 'down') {
          return new Position(part.x, part.y + 1);
        } else if (this.direction === 'left') {
          return new Position(part.x - 1, part.y);
        } else if (this.direction === 'right') {
          return new Position(part.x + 1, part.y);
        }
      } else {
        return this.parts[index - 1];
      }
    });
  }

  private generateParts(startPosition: Position): void {
    for (let i = 0; i < this.size; i++) {
      if (this.direction === 'up') {
        this.parts.push(new Position(startPosition.x, startPosition.y + i));
      } else if (this.direction === 'down') {
        this.parts.push(new Position(startPosition.x, startPosition.y - i));
      } else if (this.direction === 'left') {
        this.parts.push(new Position(startPosition.x + i, startPosition.y));
      } else if (this.direction === 'right') {
        this.parts.push(new Position(startPosition.x - i, startPosition.y));
      }
    }
  }
}
