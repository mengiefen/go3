import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useConfirmEmailMutation } from './authApi';

export const EmailConfirmation = () => {
  const { t } = useTranslation('auth');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [confirmEmail] = useConfirmEmailMutation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const executed = useRef(false);

  const token = searchParams.get('confirmation_token');

  useEffect(() => {
    if (executed.current) return;
    executed.current = true;
    
    if (!token) {
      setStatus('error');
      setErrorMessage(t('noConfirmationToken'));
      return;
    }

    const confirm = async () => {
      try {
        console.log("sending token")
        const result = await confirmEmail({ confirmation_token: token }).unwrap();
        console.log('Email confirmed:', result);
        setStatus('success');
      } catch (error: any) {
        console.error('Confirmation failed:', error);
        setStatus('error');
        
        // Handle different error cases
        if (error.status === 404) {
          setErrorMessage(t('invalidToken'));
        } else if (error.status === 422) {
          setErrorMessage(t('alreadyConfirmed'));
        } else {
          setErrorMessage(t('confirmationFailed'));
        }
      }
    };

    confirm();
  }, []);

  const handleSignIn = () => {
    navigate('/app/signin');
  };

  if (status === 'loading') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>
              {t('confirmingEmail')}
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  if (status === 'success') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              ✓ {t('emailConfirmedSuccessfully')}
            </Alert>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {t('youCanNowSignIn')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignIn}
            >
              {t('goToSignIn')}
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {t('confirmationFailedTitle')}
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {errorMessage || t('confirmationFailed')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/app/signup')}
          >
            {t('tryAgain')}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};