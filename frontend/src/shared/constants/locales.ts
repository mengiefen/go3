export const locales = [
  { code: 'en', label: 'English', direction: 'ltr' as const },
  { code: 'fa', label: 'فارسی', direction: 'rtl' as const },
] as const;

export type LocaleCode = typeof locales[number]['code'];
export type Direction = typeof locales[number]['direction'];