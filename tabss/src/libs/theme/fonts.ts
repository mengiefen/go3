export const getFontFamily = (locale: string) => {
  switch (locale) {
    case 'fa':
      return 'Yekan, "Roboto", "Noto Sans Arabic", "Tahoma", sans-serif';
    case 'en':
    default:
      return '"Roboto", Yekan, "Helvetica", "Arial", sans-serif';
  }
};

export const getFontConfig = (locale: string) => {
  const fontFamily = getFontFamily(locale);
  
  return {
    fontFamily,
    h1: { fontFamily },
    h2: { fontFamily },
    h3: { fontFamily },
    h4: { fontFamily },
    h5: { fontFamily },
    h6: { fontFamily },
    subtitle1: { fontFamily },
    subtitle2: { fontFamily },
    body1: { fontFamily },
    body2: { fontFamily },
    button: { fontFamily },
    caption: { fontFamily },
    overline: { fontFamily },
  };
};