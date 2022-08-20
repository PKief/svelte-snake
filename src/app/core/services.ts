import { ControlService, SoundService, StorageService } from '../services';
import { setAppContext } from './context';

export const provideServicesForContext = () => {
  setAppContext('soundService', {
    getSoundService: () => new SoundService(),
  });
  setAppContext('storageService', {
    getStorageService: () => new StorageService(),
  });
  setAppContext('controlService', {
    getControlService: () => new ControlService(),
  });
};
