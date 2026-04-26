import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '../theme';
import { useTranslation } from 'react-i18next';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const theme = createAppTheme(currentLocale);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};