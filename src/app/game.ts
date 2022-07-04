import { fromEvent } from 'rxjs';
import { Food } from './food';
import { Position } from './position';
import { Snake } from './snake';
import { gameState } from './stores';
import { GameConfig } from './types';

export class Game {
  config: GameConfig;
  food: Food;
  snake: Snake;

  private readonly keyPress$ = fromEvent<KeyboardEvent>(document, 'keyup');

  constructor(config: GameConfig) {
    this.snake = new Snake(new Position(1, 1), 3);
    this.food = new Food(new Position(0, 0));
    this.config = config;

    this.keyPress$.subscribe((event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          this.snake.switchDirection('up');
          break;
        case 'ArrowDown':
          this.snake.switchDirection('down');
          break;
        case 'ArrowLeft':
          this.snake.switchDirection('left');
          break;
        case 'ArrowRight':
          this.snake.switchDirection('right');
          break;
      }
    });
  }

  start(): void {
    gameState.update((state) => ({
      ...state,
      status: 'playing',
      gameOver: false,
    }));
    this.generateRandomFoodPosition();
  }

  pause(): void {
    gameState.update((state) => ({
      ...state,
      status: 'paused',
    }));
  }

  endPause(): void {
    gameState.update((state) => ({
      ...state,
      status: 'playing',
    }));
  }

  restart(): void {
    this.stop();
    this.snake = new Snake(new Position(1, 1), 3);
    this.food = new Food(new Position(0, 0));
    this.updateScore(0);
    this.start();
  }

  moveSnake() {
    this.snake.move();

    const snakeHitsWall =
      this.snake.head.x < 0 ||
      this.snake.head.x >= this.config.gridSize ||
      this.snake.head.y < 0 ||
      this.snake.head.y >= this.config.gridSize;

    const snakeBitesItself = this.snake.parts.some(
      (part, index) =>
        part.x === this.snake.head.x &&
        part.y === this.snake.head.y &&
        index > 0
    );

    if (snakeHitsWall || snakeBitesItself) {
      this.endGame();
    }

    const snakeHitsFood =
      this.snake.head.x === this.food.position.x &&
      this.snake.head.y === this.food.position.y;

    if (snakeHitsFood) {
      this.snake.eatFood();
      this.updateScore(1);
      this.generateRandomFoodPosition();
    }
  }

  private stop(): void {
    gameState.update((state) => ({
      ...state,
      status: 'stopped',
    }));
  }

  private updateScore(update: number) {
    gameState.update((state) => ({
      ...state,
      score: state.score + update,
    }));
  }

  private endGame() {
    this.stop();
    gameState.update((state) => ({
      ...state,
      gameOver: true,
    }));
  }

  private generateRandomFoodPosition() {
    const lastFoodPosition = this.food.position;
    while (true) {
      const x = Math.floor(Math.random() * this.config.gridSize);
      const y = Math.floor(Math.random() * this.config.gridSize);
      const noPositionConflictsWithSnake = this.snake.parts.every(
        (part) => part.x !== x || part.y !== y
      );
      const notLastFoodPosition =
        lastFoodPosition.x !== x || lastFoodPosition.y !== y;

      if (noPositionConflictsWithSnake && notLastFoodPosition) {
        this.food.position = new Position(x, y);
        break;
      }
    }
  }
}
