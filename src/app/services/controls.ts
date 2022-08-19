import { Game } from './../logic/game';

type SwipeEvent = {
  direction: 'top' | 'right' | 'bottom' | 'left';
  target: EventTarget;
};

type SwipeDirection = 'top' | 'right' | 'bottom' | 'left';
type KeyboardDirection = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft';
type KeyboardDirection2 = 'w' | 'a' | 's' | 'd';

export class Controls {
  constructor(private game: Game) {}

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
    this.initiallyStartGame();

    switch (input) {
      case 'ArrowUp':
      case 'w':
      case 'top':
        this.game.snake.switchDirection('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'bottom':
        this.game.snake.switchDirection('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'left':
        this.game.snake.switchDirection('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'right':
        this.game.snake.switchDirection('right');
        break;
    }
  }
}
