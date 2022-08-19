import { getContext, setContext } from 'svelte';
import { Game } from '../logic/game';

export type AppContext = {
  game: Game;
};

type ContextGetMethodName<S extends keyof AppContext> = `get${Capitalize<S>}`;
type ContextMethod<S extends keyof AppContext> = () => AppContext[S];
type ContextValue<S extends keyof AppContext> = Record<
  ContextGetMethodName<S>,
  ContextMethod<S>
>;

const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const getAppContext = <S extends keyof AppContext>(key: S) =>
  (getContext(key) as ContextValue<S>)[
    'get' + capitalizeFirstLetter(key)
  ]() as AppContext[S];

export const setAppContext = <S extends keyof AppContext>(
  key: S,
  contextValue: ContextValue<S>
) => setContext(key, contextValue);
