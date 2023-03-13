import es from './locale/es';

const texts = {
  es: () => es,
};

export const getText = (locale) => texts[locale]();