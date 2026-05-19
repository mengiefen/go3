import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { useTheme } from '@mui/material/styles';
import { locales, type LocaleCode } from '../constants/locales';

export const useLocale = (currentLocale?: LocaleCode) => {
  const { i18n } = useTranslation();
  
  // Use provided locale, or i18n.language, or default to 'en'
  const effectiveLocale = currentLocale || (i18n.language as LocaleCode) || 'en';

  useEffect(() => {
    // Only change language if different from current
    if (effectiveLocale !== i18n.language) {
      i18n.changeLanguage(effectiveLocale);
    }
    
    const selectedLocale = locales.find(loc => loc.code === effectiveLocale);
    if (selectedLocale) {
      document.body.dir = selectedLocale.direction;
      document.body.style.direction = selectedLocale.direction;
    }
  }, [effectiveLocale, i18n]);

  const localeDirection = (localeCode?: LocaleCode) => {
    const code = localeCode || effectiveLocale;
    return locales.find(loc => loc.code === code)?.direction || 'ltr';
  };

  return {
    localeDirection,
    locales,
    currentLocale: effectiveLocale,
  };
};