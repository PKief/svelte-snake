import { Translation } from 'src/i18n/translation';
import { setAppContext } from '.';
import {
  ControlService,
  ImageService,
  SoundService,
  StorageService,
  TranslationService,
} from '../services';

export const registerServices = () => {
  const soundService = new SoundService();
  const storageService = new StorageService();
  const controlService = new ControlService();
  const imageService = new ImageService();
  const translationService = new TranslationService<Translation>();

  setAppContext('soundService', {
    getSoundService: () => soundService,
  });
  setAppContext('storageService', {
    getStorageService: () => storageService,
  });
  setAppContext('controlService', {
    getControlService: () => controlService,
  });
  setAppContext('imageService', {
    getImageService: () => imageService,
  });
  setAppContext('translationService', {
    getTranslationService: () => translationService,
  });
};
