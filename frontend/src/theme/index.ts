import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { getFontFamily } from './fonts';

export const createAppTheme = (locale: string = 'en'): Theme => {
  const fontFamily = getFontFamily(locale);
  
  return createTheme({
    typography: {
      fontFamily,
      // Adjust font sizes for Persian (usually needs slightly larger)
      ...(locale === 'fa' && {
        fontSize: 14, // Slightly larger base font for Persian
        h4: { fontSize: '2rem', fontWeight: 600 },
        body1: { fontSize: '1rem', lineHeight: 1.8 }, // Better line height for Persian
      }),
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-input': {
              fontFamily,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily,
            textTransform: 'none', // Persian looks better without uppercase
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily,
          },
        },
      },
    },
  });
};

// Default English theme
export const defaultTheme = createAppTheme('en');