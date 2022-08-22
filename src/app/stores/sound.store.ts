import { writable } from 'svelte/store';
import { SoundState } from '../types';

export const soundState = writable<SoundState>({
  muted: false,
});
