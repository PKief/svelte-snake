import { Game } from './game';

type SwipeEvent = {
  direction: 'top' | 'right' | 'bottom' | 'left';
  target: EventTarget;
};

type SwipeDirection = 'top' | 'right' | 'bottom' | 'left';
type KeyboardDirection = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft';

export class Controls {
  constructor(private game: Game) {}

  handleKeydown() {
    return (event: KeyboardEvent) => {
      if (event.key.startsWith('Arrow')) {
        this.initiallyStartGame();
      }
      this.handleControlInput(event.key as KeyboardDirection);
    };
  }

  handleSwipe() {
    return (event: CustomEvent<SwipeEvent>) => {
      this.initiallyStartGame();
      this.handleControlInput(event.detail.direction);
    };
  }

  private initiallyStartGame() {
    if (this.game.currentGameState.status === 'initial') {
      this.game.start();
    }
  }

  private handleControlInput(input: KeyboardDirection | SwipeDirection) {
    switch (input) {
      case 'ArrowUp':
      case 'top':
        this.game.snake.switchDirection('up');
        break;
      case 'ArrowDown':
      case 'bottom':
        this.game.snake.switchDirection('down');
        break;
      case 'ArrowLeft':
      case 'left':
        this.game.snake.switchDirection('left');
        break;
      case 'ArrowRight':
      case 'right':
        this.game.snake.switchDirection('right');
        break;
    }
  }
}
