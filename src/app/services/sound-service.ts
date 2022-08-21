type SoundName = 'eat' | 'bump';

export class SoundService {
  private readonly soundTracks = new Map<SoundName, string>();
  private readonly players = new Map<SoundName, HTMLAudioElement>();

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

  playSound(audio: SoundName) {
    this.players.get(audio).play();
  }
}
