import { AppearanceSection } from '@/components/settings/AppearanceSection';
import { NotificationSection } from '@/components/settings/NotificationSection';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import {
  Bell,
  Building,
  CreditCard,
  Globe,
  Palette,
  Shield,
  User,
} from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_dashboard/settings')({
  component: SettingsPage,
});

const SETTINGS_SECTIONS = [
  {
    category: 'Account',
    items: [
      {
        label: 'Profile Settings',
        icon: User,
        id: 'profile',
      },
      {
        label: 'Security & Access',
        icon: Shield,
        id: 'security',
      },
      {
        label: 'Notifications',
        icon: Bell,
        id: 'notifications',
      },
    ],
  },
  {
    category: 'Preferences',
    items: [
      {
        label: 'Appearance',
        icon: Palette,
        id: 'appearance',
      },
      {
        label: 'Language & Region',
        icon: Globe,
        id: 'localization',
      },
    ],
  },
  {
    category: 'Workspace',
    items: [
      {
        label: 'Organization',
        icon: Building,
        id: 'organization',
      },
      {
        label: 'Billing & Usage',
        icon: CreditCard,
        id: 'billing',
      },
    ],
  },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  // const theme = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      case 'notifications':
        return <NotificationSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'localization':
        // Redirect or show appearance since we moved language there?
        // Or duplicate for now. User asked for Appearance tab.
        // Let's just render Appearance for localization too or keep separate?
        // The AppearanceSection includes Language.
        return <AppearanceSection />;
      default:
        return (
          <Box
            sx={{
              p: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              This section is coming soon.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100%',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* Vertical Navigation Sidebar */}
      <Box
        sx={{
          width: 280,
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          pt: 4,
          pb: 4,
        }}
      >
        <Box sx={{ px: 3, mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 700,
            }}
          >
            Settings
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {SETTINGS_SECTIONS.map((section) => (
            <Box key={section.category} sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                sx={{
                  px: 3,
                  mb: 1,
                  display: 'block',
                  fontWeight: 600,
                  color: 'primary.main',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {section.category}
              </Typography>
              <List disablePadding>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <ListItem key={item.id} disablePadding sx={{ px: 1.5 }}>
                      <ListItemButton
                        onClick={() => setActiveTab(item.id)}
                        selected={isActive}
                        sx={{
                          mb: 0.5,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: 'text.secondary',
                          }}
                        >
                          <Icon size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: '0.9375rem',
                              }}
                            >
                              {item.label}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, p: 4, overflowY: 'auto', height: '100vh' }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>{renderContent()}</Box>
      </Box>
    </Box>
  );
}
