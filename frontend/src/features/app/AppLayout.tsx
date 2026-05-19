import { Outlet, useParams } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar';
import { useGetOrganizationQuery } from '../organizations/organizationsApi';
import { setCurrentOrganization } from '../organizations/organizationsSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';


const drawerWidth = 280;

export const AppLayout = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const orgId = parseInt(organizationId || '0', 10)
  const { data: currentOrganization, isLoading } = useGetOrganizationQuery(orgId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && currentOrganization) {
      dispatch(setCurrentOrganization(currentOrganization));
    }
  }, [isLoading, currentOrganization, dispatch])

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          maxHeight: '100px ',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};