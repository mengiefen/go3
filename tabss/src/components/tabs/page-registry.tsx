import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';

const DashboardPlaceholder = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Dashboard
    </Typography>
    <Typography color="text.secondary">
      Dashboard content will be loaded here.
    </Typography>
  </Box>
);

import { CalendarPage } from '@/routes/_dashboard.calendar';
import { ChatPage } from '@/routes/_dashboard.chat';
import { InventoryPage } from '@/routes/_dashboard.inventory';
import { SalesPage } from '@/routes/_dashboard.sales';
import { SettingsPage } from '@/routes/_dashboard.settings';
import { ShopsPage } from '@/routes/_dashboard.shops';
import { TablesPage } from '@/routes/_dashboard.tables';

export const PAGE_REGISTRY: Record<string, React.ComponentType> = {
  dashboard: DashboardPlaceholder,
  inventory: InventoryPage,
  sales: SalesPage,
  calendar: CalendarPage,
  shops: ShopsPage,
  settings: SettingsPage,
  tables: TablesPage,
  chat: ChatPage,
};

export function PageContent({ pageId }: { pageId: string }) {
  const Component = PAGE_REGISTRY[pageId];

  if (!Component) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'text.secondary',
          p: 2,
        }}
      >
        <Typography>Page not found: {pageId}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'auto',
        bgcolor: 'background.default',
      }}
    >
      <Component />
    </Box>
  );
}
