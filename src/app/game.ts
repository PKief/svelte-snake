import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Food } from './food';
import { Position } from './position';
import { Snake } from './snake';
import { gameState } from './stores';
import { Direction, GameConfig, GameField } from './types';

export class Game {
  config: GameConfig;
  food: Food;
  snake: Snake;
  paused = new BehaviorSubject<boolean>(false);
  ctx: CanvasRenderingContext2D;

  private intervalSubscription: Subscription | undefined;
  private readonly keyPress$ = fromEvent<KeyboardEvent>(document, 'keyup');

  constructor(config: GameConfig) {
    this.snake = new Snake(new Position(1, 1), 3);
    this.food = new Food(new Position(0, 0));
    this.config = config;
    this.ctx = config.ctx;

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
    this.paused.next(true);
    gameState.update((state) => ({
      ...state,
      status: 'paused',
    }));
  }

  endPause(): void {
    this.paused.next(false);
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

  getRenderingContet(fps: number) {
    const fieldWidth = this.ctx.canvas.width / this.config.gridSize;
    const fieldHeight = this.ctx.canvas.height / this.config.gridSize;

    const tickMovementX = fieldWidth / fps;
    const tickMovementY = fieldHeight / fps;
    let tickCount = 0;
    let snakeDirection;
    let snakeHeadPosition: Position;

    return () => {
      if (tickCount === 0) {
        tickCount = fps;
        snakeHeadPosition = { x: this.snake.head.x, y: this.snake.head.y };
        snakeDirection = this.snake.direction;
        this.moveSnake();
      }
      tickCount--;
      this.clearCanvas();
      this.render(
        fieldWidth,
        fieldHeight,
        tickMovementX,
        tickMovementY,
        fps - tickCount,
        snakeDirection,
        snakeHeadPosition
      );
    };
  }

  private render(
    fieldWidth: number,
    fieldHeight: number,
    tickMovementX: number,
    tickMovementY: number,
    tickCount: number,
    snakeDirection: Direction,
    snakePosition: Position
  ) {
    this.drawSnake(
      fieldWidth,
      fieldHeight,
      tickMovementX,
      tickMovementY,
      tickCount,
      snakeDirection,
      snakePosition
    );
  }

  private drawSnake(
    fieldWidth: number,
    fieldHeight: number,
    tickMovementX: number,
    tickMovementY: number,
    tickCount: number,
    snakeDirection: Direction,
    snakePosition: Position
  ) {
    this.ctx.fillStyle = 'red';
    const xCurrentPosition = snakePosition.x * fieldWidth;
    const yCurrentPosition = snakePosition.y * fieldWidth;
    let x;
    let y;
    switch (snakeDirection) {
      case 'right': {
        x = xCurrentPosition + tickMovementX * tickCount;
        y = yCurrentPosition;
        break;
      }
      case 'down': {
        x = xCurrentPosition;
        y = yCurrentPosition + tickMovementY * tickCount;
        break;
      }
      case 'left': {
        x = xCurrentPosition - tickMovementX * tickCount;
        y = yCurrentPosition;
        break;
      }
      case 'up': {
        x = xCurrentPosition;
        y = yCurrentPosition - tickMovementY * tickCount;
        break;
      }
    }
    this.ctx.fillRect(x, y, fieldWidth, fieldHeight);
    this.ctx.fillText(
      `xS: ${this.snake.head.x} yS: ${this.snake.head.y}`,
      x,
      y
    );

    // this.snake.parts.forEach((part) => {
    //   this.ctx.fillStyle = 'red';
    //   this.ctx.fillRect(
    //     part.x * fieldWidth,
    //     part.y * fieldHeight,
    //     fieldWidth,
    //     fieldHeight
    //   );
    // });
  }

  private moveSnake() {
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

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(
      0,
      0,
      this.ctx.canvas.clientWidth,
      this.ctx.canvas.clientHeight
    );
  }

  private stop(): void {
    gameState.update((state) => ({
      ...state,
      status: 'stopped',
    }));
    this.intervalSubscription?.unsubscribe();
  }

  private rerender() {
    gameState.update((state) => ({
      ...state,
      fields: this.getGameFields(),
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

  private getGameFields(): GameField[][] {
    const gameFields: GameField[][] = [];
    for (let y = 0; y < this.config.gridSize; y++) {
      gameFields[y] = [];
      for (let x = 0; x < this.config.gridSize; x++) {
        const field: GameField = {
          id: uuidv4(),
          type: 'Field',
        };
        gameFields[y][x] = field;
      }
    }

    const foodField: GameField = {
      id: uuidv4(),
      type: 'Food',
    };
    gameFields[this.food.position.y][this.food.position.x] = foodField;

    for (let i = 0; i < this.snake.parts.length; i++) {
      const part = this.snake.parts[i];
      const type =
        i === 0
          ? 'SnakeHead'
          : i === this.snake.parts.length - 1
          ? 'SnakeTail'
          : 'SnakeBody';

      gameFields[part.y][part.x] = {
        id: uuidv4(),
        type,
      };
    }

    return gameFields;
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
