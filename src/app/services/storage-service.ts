type StorageData = {
  highScore: number;
};

export class StorageService {
  private readonly storageKey = 'svelte-snake-game';
  private storageData: StorageData | undefined;

  get highScore() {
    return this.storageData.highScore;
  }

  set highScore(highScore: number) {
    this.storageData.highScore = highScore;
    this.save();
  }

  constructor() {
    this.readData();
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.storageData));
  }

  private readData() {
    try {
      const localStorageString = localStorage.getItem(this.storageKey);
      if (localStorageString) {
        this.storageData = JSON.parse(localStorageString) as StorageData;
      } else {
        this.storageData = {
          highScore: 0,
        };
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
      throw new Error(
        'Could not read out and parse localStorage. It has been cleaned up. Please reload the page.'
      );
    }
  }
}
