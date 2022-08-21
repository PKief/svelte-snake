import { getContext, setContext } from 'svelte';
import { Game } from '../logic/game';
import {
  ControlService,
  ImageService,
  SoundService,
  StorageService,
} from '../services';

export type AppContext = {
  game: Game;
  soundService: SoundService;
  storageService: StorageService;
  controlService: ControlService;
  imageService: ImageService;
};

type ContextMethodPrefix = 'get';
type ContextGetMethodName<S extends keyof AppContext> =
  `${ContextMethodPrefix}${Capitalize<S>}`;
type ContextMethod<S extends keyof AppContext> = () => AppContext[S];
type ContextValue<S extends keyof AppContext> = Record<
  ContextGetMethodName<S>,
  ContextMethod<S>
>;

const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const getAppContext = <S extends keyof AppContext>(key: S) => {
  const prefix: ContextMethodPrefix = 'get';
  return (getContext(key) as ContextValue<S>)[
    prefix + capitalizeFirstLetter(key)
  ]() as AppContext[S];
};

export const setAppContext = <S extends keyof AppContext>(
  key: S,
  contextValue: ContextValue<S>
) => setContext(key, contextValue);
