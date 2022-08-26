import { Translation } from 'src/i18n/translation';
import { readable } from 'svelte/store';
import { getAppContext } from '../core';
import { Path } from '../types';

export const i18n = readable((key: Path<Translation>) => {
  const translateService = getAppContext('translationService');
  return translateService.translate(key);
});
