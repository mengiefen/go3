import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome to your dashboard. Select a tab to get started.
      </Typography>
    </Box>
  );
}
