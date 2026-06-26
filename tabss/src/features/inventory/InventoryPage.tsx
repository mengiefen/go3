import { Box, Typography } from '@mui/material';
import { Package } from 'lucide-react';

export function InventoryPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Package size={32} color="var(--md-sys-color-primary)" />
        <Typography
          variant="h4"
          sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}
        >
          Inventory
        </Typography>
      </Box>
      <Box
        sx={{
          p: 4,
          border: '1px dashed var(--md-sys-color-outline-variant)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
        }}
      >
        <Typography variant="body1" color="var(--md-sys-color-on-surface-variant)">
          Inventory Module Placeholder
        </Typography>
      </Box>
    </Box>
  );
}
