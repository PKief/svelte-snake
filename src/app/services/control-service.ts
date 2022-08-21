import { getAppContext } from '../core';
import { Game } from '../logic/game';
import { Direction } from '../types';

type SwipeEvent = {
  direction: 'top' | 'right' | 'bottom' | 'left';
  target: EventTarget;
};

type SwipeDirection = 'top' | 'right' | 'bottom' | 'left';
type KeyboardDirection = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft';
type KeyboardDirection2 = 'w' | 'a' | 's' | 'd';

export class ControlService {
  private readonly game: Game;

  constructor() {
    this.game = getAppContext('game');
  }

  handleKeydown() {
    return (event: KeyboardEvent) => {
      this.handleControlInput(event.key as KeyboardDirection);
    };
  }

  handleSwipe() {
    return (event: CustomEvent<SwipeEvent>) => {
      this.handleControlInput(event.detail.direction);
    };
  }

  private initiallyStartGame() {
    if (this.game.currentGameState.status === 'initial') {
      this.game.start();
    }
  }

  private handleControlInput(
    input: KeyboardDirection | KeyboardDirection2 | SwipeDirection
  ) {
    switch (input) {
      case 'ArrowUp':
      case 'w':
      case 'top':
        this.switchDirection('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'bottom':
        this.switchDirection('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'left':
        this.switchDirection('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'right':
        this.switchDirection('right');
        break;
    }
  }

  private switchDirection(direction: Direction) {
    this.initiallyStartGame();
    this.game.snake.switchDirection(direction);
  }
}
