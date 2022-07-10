import { BehaviorSubject } from 'rxjs';
import { Food } from './food';
import { Position } from './position';
import { Snake } from './snake';
import { Sounds } from './sounds';
import { gameState } from './stores';
import { GameConfig, GameState } from './types';

export class Game {
  config: GameConfig;
  food: Food;
  snake: Snake;
  sounds: Sounds;

  private readonly snakeStartPosition = new Position(1, 1);

  private readonly snakeStartSize = 3;

  private readonly gameState$ = new BehaviorSubject<GameState>(undefined);

  get currentGameState() {
    return this.gameState$.value;
  }

  constructor(config: GameConfig) {
    this.snake = new Snake(this.snakeStartPosition, this.snakeStartSize);
    this.food = new Food(new Position(0, 0));
    this.config = config;
    this.sounds = new Sounds();

    gameState.subscribe((gameState) => {
      this.gameState$.next(gameState);
    });

    this.generateRandomFoodPosition();
  }

  start(): void {
    gameState.update((state) => ({
      ...state,
      status: 'playing',
      gameOver: false,
    }));
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
    this.snake = new Snake(this.snakeStartPosition, this.snakeStartSize);
    this.food = new Food(new Position(0, 0));
    this.generateRandomFoodPosition();
    const currentScore = this.gameState$.value.score;
    this.updateHighScore(currentScore);
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
      this.sounds.bump();
      this.endGame();
    }

    const snakeHitsFood =
      this.snake.head.x === this.food.position.x &&
      this.snake.head.y === this.food.position.y;

    if (snakeHitsFood) {
      this.sounds.eat();
      this.snake.eatFood();
      const currentScore = this.gameState$.value.score;
      this.updateScore(currentScore + 1);
      this.generateRandomFoodPosition();
    }
  }

  private stop(): void {
    gameState.update((state) => ({
      ...state,
      status: 'stopped',
    }));
  }

  private updateScore(score: number) {
    gameState.update((state) => ({
      ...state,
      score,
    }));
    const highScore = this.gameState$.value.highScore;
    if (score > highScore) {
      this.updateHighScore(score);
    }
  }

  private updateHighScore(highScore: number) {
    gameState.update((state) => ({
      ...state,
      highScore,
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
