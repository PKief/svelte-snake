import { soundState } from '../stores';

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

    this.addPlayersMuteSubscription();
  }

  private addPlayersMuteSubscription() {
    soundState.subscribe((state) => {
      this.players.forEach((player) => {
        player.muted = state.muted;
      });
    });
  }

  playSound(audio: SoundName) {
    this.players.get(audio).play();
  }

  muteAllPlayers() {
    soundState.update((state) => ({ ...state, muted: true }));
  }

  unmuteAllPlayers() {
    soundState.update((state) => ({ ...state, muted: false }));
  }
}
