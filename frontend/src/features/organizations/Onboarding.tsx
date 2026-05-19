import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCreateTrialOrganizationMutation } from './organizationsApi';
import { setCurrentOrganization, setOrganizations } from './organizationsSlice';

export const Onboarding = () => {
  const { t } = useTranslation('organizations');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orgName, setOrgName] = useState('');
  const [createOrganization, { isLoading, error }] = useCreateTrialOrganizationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orgName.trim()) {
      return;
    }
    
    try {
      const newOrganization = await createOrganization({ name: orgName }).unwrap();
      
      // Update Redux store with the new organization
      dispatch(setOrganizations([newOrganization]));
      dispatch(setCurrentOrganization(newOrganization));
      
      // Redirect to the organization home page
      navigate(`/app/organizations/${newOrganization.id}`, { replace: true });
    } catch (err) {
      console.error('Failed to create organization:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t('createYourOrganization')}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {t('onboardingSubtitle')}
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('organizationName')}
              name="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              margin="normal"
              required
              autoFocus
              placeholder={t('organizationNamePlaceholder')}
            />
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {t('organizationCreationFailed')}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading || !orgName.trim()}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : t('createOrganization')}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};