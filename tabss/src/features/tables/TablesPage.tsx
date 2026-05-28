import { Box, Typography } from '@mui/material';
import { DataTableDemo } from '@/features/tables/DataTableDemo';

export function TablesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Table Component Showcase
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        This page demonstrates the maximum flexibility of the compound Table
        architecture. Notice how the toolbars, checkboxes, avatars, and
        pagination are freely assembled.
      </Typography>

      <DataTableDemo />
    </Box>
  );
}
