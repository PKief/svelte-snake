export class Sounds {
  private readonly library = new Map<string, unknown>();
  private player = new Audio();

  constructor() {
    const eat = require('./../sounds/eat.wav');
    const bump = require('./../sounds/bump.wav');

    this.library.set('eat', eat);
    this.library.set('bump', bump);
  }

  eat() {
    this.playSound(this.library.get('eat'));
  }

  bump() {
    this.playSound(this.library.get('bump'));
  }

  private playSound(audio) {
    this.player.src = audio;
    this.player.play();
  }
}
