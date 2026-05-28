import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Link, useLocation } from '@tanstack/react-router';
import {
  Banknote,
  Calendar,
  Hexagon,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  Store,
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

export function TabSidebar() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const { t } = useTranslation();

  const items = [
    { title: 'Dashboard', pageId: 'dashboard', icon: LayoutDashboard },
    { title: 'Inventory', pageId: 'inventory', icon: Package },
    { title: 'Sales', pageId: 'sales', icon: Banknote },
    { title: 'Calendar', pageId: 'calendar', icon: Calendar },
    { title: 'Shops', pageId: 'shops', icon: Store },
    { title: 'Settings', pageId: 'settings', icon: Settings },
    { title: 'Chat', pageId: 'chat', icon: MessageSquare },
  ];

  return (
    <Box
      sx={{
        width: 48,
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 2,
      }}
    >
      <Box sx={{ color: 'primary.main', mb: 2 }}>
        <Hexagon size={24} strokeWidth={2.5} />
      </Box>

      {items.map((item) => {
        const Icon = item.icon;
        const href = item.pageId === 'dashboard' ? '/' : `/${item.pageId}`;
        const isActive =
          pathname === href || (href !== '/' && pathname.startsWith(href));

        // Translate title
        const title = t(`pages.${item.pageId}`, item.title);

        return (
          <Tooltip key={item.pageId} title={title} placement="right" arrow>
            <div style={{ display: 'block' }}>
              <Link to={href} style={{ display: 'block' }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1, // 12px to match theme
                    cursor: 'pointer',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: isActive ? 'action.selected' : 'action.hover', // Keep selected bg if active
                      color: isActive ? 'primary.main' : 'text.primary',
                    },
                    '&:active': {
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                      transform: 'scale(0.95)',
                    },
                  }}
                >
                  <Icon size={20} />
                </Box>
              </Link>
            </div>
          </Tooltip>
        );
      })}
    </Box>
  );
}
