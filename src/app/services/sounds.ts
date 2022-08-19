export class Sounds {
  private readonly soundTracks = new Map<string, string>();
  private readonly players = new Map<string, HTMLAudioElement>();

  constructor() {
    this.soundTracks.set('eat', 'eat.wav');
    this.soundTracks.set('bump', 'bump.wav');

    this.soundTracks.forEach((fileName, track) => {
      const player = new Audio();
      const audio = require(`./../../sounds/${fileName}`);
      player.src = audio;
      player.muted = false;
      this.players.set(track, player);
    });
  }

  eat() {
    this.playSound('eat');
  }

  bump() {
    this.playSound('bump');
  }

  private playSound(audio) {
    this.players.get(audio).play();
  }
}
