import * as datefnsLocale from 'date-fns/locale';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './en';
import { ru } from './ru';

const LNG_KEY = 'lng';

const getLng = () => {
  if (typeof window !== 'undefined') {
    if (localStorage) {
      const lng = localStorage.getItem(LNG_KEY);
      if (lng) {
        return lng;
      }

      localStorage.setItem(LNG_KEY, 'ru');
      return 'ru';
    }
  }
};

export function initI18n() {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en,
        ru,
      },
      lng: getLng(),
      interpolation: {
        escapeValue: false,
      },
    })
    .catch(console.error);
}

export const locale = {
  ru: datefnsLocale.ru,
  en: datefnsLocale.enUS,
};
