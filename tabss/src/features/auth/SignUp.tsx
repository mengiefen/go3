import { useState, useMemo } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Snackbar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from '@tanstack/react-router';
import { useSignUpMutation } from './authApi';
import { timezones, locales } from '@/constants';
import { useLocale } from '@/hooks/shared/useLocale';
import { useDispatch } from 'react-redux';
import { setUser } from './authSlice';

function useQueryParam(paramName: string): string | null {
  return useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get(paramName);
  }, [paramName]);
}

export const SignUp = () => {
  const { t } = useTranslation('auth');
  const { t: tShared } = useTranslation('shared');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const invitationEmail = useQueryParam('email');
  const [formData, setFormData] = useState({
    email: invitationEmail || '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirmation: '',
    timezone: 'UTC',
    locale: useQueryParam('locale') || 'en',
    invitation_key: useQueryParam('invitation_key') || null,
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [signUp, { isLoading, error }] = useSignUpMutation();
  const [validationError, setValidationError] = useState<string | null>(null);

  useLocale(formData.locale as any);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      setValidationError(t('validation.passwordsDoNotMatch'));
      return;
    }

    try {
      const { password_confirmation, ...userData } = formData;
      const result = await signUp(userData).unwrap();
      if (result.confirmed_at != null) {
        dispatch(setUser({
          id: result.id,
          email: result.email,
          first_name: result.first_name || '',
          last_name: result.last_name || '',
        }));
        navigate({ to: '/' });
      }
      setIsSuccess(true);
    } catch (err) {
      console.error('Sign up failed:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setValidationError(null);
  };

  if (isSuccess) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              ✓ {t('signUpSuccess')}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {t('checkYourEmail')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              {t('confirmationLinkSent')}
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {tShared('signUp')}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={tShared('firstName')}
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label={tShared('lastName')}
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label={tShared('email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              dir="ltr"
              required
              disabled={!!invitationEmail}
            />

            <TextField
              fullWidth
              label={tShared('password')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              dir="ltr"
            />

            <TextField
              fullWidth
              label={tShared('confirmPassword')}
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              margin="normal"
              required
              dir="ltr"
            />

            <TextField
              fullWidth
              select
              label={tShared('timezone')}
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              margin="normal"
            >
              {timezones.map((tz) => (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label={tShared('locale')}
              name="locale"
              value={formData.locale}
              onChange={handleChange}
              margin="normal"
            >
              {locales.map((loc) => (
                <MenuItem key={loc.code} value={loc.code}>
                  {loc.label}
                </MenuItem>
              ))}
            </TextField>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {t('signUpFailed')}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : tShared('signUp')}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                {t('alreadyHaveAccount')}{' '}
                <RouterLink to="/login">
                  {t('signInHere')}
                </RouterLink>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>

      <Snackbar
        open={!!validationError}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {validationError}
        </Alert>
      </Snackbar>
    </Container>
  );
};
