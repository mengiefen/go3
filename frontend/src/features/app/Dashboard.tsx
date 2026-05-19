import { Typography, Box} from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useTranslation } from 'react-i18next';

export const Dashboard = () => {
  const { t } = useTranslation('organizations');
  const { currentOrganization } = useSelector((state: RootState) => state.organizations);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dashboard')}
      </Typography>
      
        "Woohooo, You are on your dashboard."

        <p>
          { JSON.stringify(currentOrganization) }
        </p>
    </Box>
  );
};