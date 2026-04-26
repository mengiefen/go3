import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSignInMutation } from './authApi';

export const SignIn = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [signIn, { isLoading, error }] = useSignInMutation();
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailNotConfirmed(false);
    
    try {
      const result = await signIn({
        user: {
          email: formData.email,
          password: formData.password,
        },
      }).unwrap();
      
      console.log('Sign in successful:', result);
      navigate('/app/organization-resolver');
    } catch (err: any) {
      console.error('Sign in failed:', err);
      
      if (err.status === 401 && err.data?.error === 'unconfirmed') {
        setIsEmailNotConfirmed(true);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t('signIn')}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {t('signInSubtitle')}
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="email"
            />
            
            <TextField
              fullWidth
              label={t('password')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="current-password"
            />
            
            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Link 
                href="#" 
                variant="body2" 
                onClick={(e) => { e.preventDefault(); }}
              >
                {t('forgotPassword')}
              </Link>
            </Box>
            
            {error && !isEmailNotConfirmed && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {t('signInFailed')}
              </Alert>
            )}
            
            {isEmailNotConfirmed && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {t('emailNotConfirmed')}
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
              {isLoading ? <CircularProgress size={24} /> : t('signInButton')}
            </Button>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Consistent link style - same as SignUp component */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                { t('dontHaveAccount') }{' '}
                <Link 
                  component={RouterLink} 
                  to="/app/signup"
                  underline="hover"
                >
                  {t('signUpHere')}
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};