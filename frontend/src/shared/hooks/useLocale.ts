import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { useTheme } from '@mui/material/styles';
import { locales, type LocaleCode } from '../constants/locales';

export const useLocale = (currentLocale: LocaleCode) => {
  const { i18n } = useTranslation();
  // const theme = useTheme();

  // Apply RTL/LTR direction and font when locale changes
  useEffect(() => {
    const selectedLocale = locales.find(loc => loc.code === currentLocale);
    if (selectedLocale) {
      document.body.dir = selectedLocale.direction;
      document.body.style.direction = selectedLocale.direction;
      i18n.changeLanguage(currentLocale);
      
      // MUI theme will re-render with new font via ThemeProvider
      // The ThemeProvider listens to i18n.language changes
    }
  }, [currentLocale, i18n]);

  const getLocaleDirection = (localeCode: LocaleCode) => {
    return locales.find(loc => loc.code === localeCode)?.direction || 'ltr';
  };

  return {
    getLocaleDirection,
    locales,
  };
};