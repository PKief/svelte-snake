import { Path } from '../types';

export class TranslationService<T> {
  private readonly placeholder = '%';

  private currentTranslation: T;
  private fallbackTranslation: T;

  async init() {
    try {
      this.currentTranslation = await this.loadTranslation(
        this.getBrowserLanguage()
      );
      this.fallbackTranslation = await this.loadTranslation('en');
    } catch (error) {
      throw new Error('Could not load translations');
    }
  }

  private async loadTranslation(language: string) {
    try {
      return await this.getTranslationObject(language);
    } catch (error) {
      return await this.getTranslationObject('en');
    }
  }

  private async getTranslationObject(language: string) {
    const lang = await import(
      /* webpackMode: "eager" */ `./../../i18n/${language}`
    );
    return lang.translation as T;
  }

  private getTranslationValue(key: Path<T>): string | undefined {
    return (
      this.resolveKeyAsPath(this.currentTranslation, key) ??
      this.resolveKeyAsPath(this.fallbackTranslation, key)
    );
  }

  translate(key: Path<T>, ...variables: string[]): string {
    const translation = this.getTranslationValue(key);

    if (variables.length === 0) return translation ?? (key as string);
    return this.replace(translation, ...variables);
  }

  private replace(value: string = '', ...variables: string[]) {
    let translation: string = value;
    variables.forEach((variable, i) => {
      translation = translation.replace(`${this.placeholder}${i}`, variable);
    });

    return translation;
  }

  private getBrowserLanguage(): string {
    return navigator.language.slice(0, 2);
  }

  private resolveKeyAsPath(translation: T, path: Path<T>) {
    const pathArray = (path as string)
      .replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
      .replace(/^\./, '') // strip a leading dot
      .split('.'); // separate paths in array

    /** Avoid errors in the getValue function. */
    const isObject = (object: unknown) => {
      return object === Object(object);
    };

    let result: string | object;
    try {
      result = JSON.parse(JSON.stringify(translation));
    } catch (error) {
      throw new Error(
        `Error: Could not find translation for key "${String(path)}".`
      );
    }

    for (let i = 0; i < pathArray.length; ++i) {
      const k = pathArray[i];
      if (isObject(result) && k in (result as object)) {
        result = result[k];
      } else {
        return;
      }
    }
    return result as string;
  }
}
