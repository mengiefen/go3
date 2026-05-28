import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/plus-jakarta-sans/300.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/700.css';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#6750A4',
          light: '#EADDFF',
          dark: '#21005D',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#625B71',
          light: '#E8DEF8',
          dark: '#1D192B',
          contrastText: '#FFFFFF',
        },
        background: {
          default: '#FDFBFF',
          paper: '#FDFBFF',
        },
        text: {
          primary: '#1C1B1F',
          secondary: '#49454F',
        },
        divider: '#E7E0EC', // Subtle divider
        action: {
          hover: 'rgba(103, 80, 164, 0.08)',
          selected: 'rgba(103, 80, 164, 0.12)',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#D0BCFF',
          light: '#EADDFF',
          dark: '#B49FE8', // lighter hover bg 
          contrastText: '#381E72',
        },
        secondary: {
          main: '#CCC2DC',
          light: '#E8DEF8',
          dark: '#AFA3BE', // lighter hover bg 
          contrastText: '#332D41',
        },
        background: {
          default: '#141218', // Deep dark
          paper: '#1D1B20', // Slightly lighter surface
        },
        text: {
          primary: '#E6E1E5',
          secondary: '#CAC4D0',
        },
        divider: '#49454F', // Stronger divider for dark mode contrast
        action: {
          hover: 'rgba(208, 188, 255, 0.08)',
          selected: 'rgba(208, 188, 255, 0.12)',
        },
      },
    },
  },
  shape: {
    borderRadius: 12, // More modern/premium feel
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--mui-palette-divider)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'var(--mui-palette-text-secondary)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 3px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: 'var(--mui-palette-divider)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid var(--mui-palette-divider)',
          boxShadow: '0px 1px 2px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: 'var(--mui-palette-divider)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--mui-palette-text-secondary)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--mui-palette-primary-main)',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 40,
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          borderRadius: '8px',
          transition: 'all 0.2s',
          margin: '0 4px',
          '&:hover': {
            backgroundColor: 'var(--mui-palette-action-hover)',
          },
          '&.Mui-selected': {
            color: 'var(--mui-palette-primary-main)',
            backgroundColor: 'var(--mui-palette-action-selected)',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 40,
        },
        indicator: {
          display: 'none', // creating a pill-style tab instead
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Standardize on 12px for list items
          '&.Mui-selected': {
            backgroundColor: 'var(--mui-palette-action-selected)',
            color: 'var(--mui-palette-primary-main)',
            '& .MuiListItemIcon-root': {
              color: 'var(--mui-palette-primary-main)',
            },
            '& .MuiListItemText-primary': {
              color: 'var(--mui-palette-primary-main)',
              fontWeight: 600,
            },
          },
          '&:active': {
            backgroundColor: 'var(--mui-palette-action-selected)',
            color: 'var(--mui-palette-text-primary)',
            '& .MuiListItemIcon-root': {
              color: 'var(--mui-palette-primary-main)',
            },
          },
          '&:hover': {
            backgroundColor: 'var(--mui-palette-action-hover)',
            color: 'var(--mui-palette-text-primary)',
            '& .MuiListItemIcon-root': {
              color: 'var(--mui-palette-primary-main)',
            },
          },
        },
      },
    },
  },
});

export default theme;
