import {
  Alert,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material';
import { History, Key, RotateCcw, ShieldCheck } from 'lucide-react';

export function SecuritySection() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}
        >
          Security
        </Typography>
        <Typography
          variant="body2"
          color="var(--md-sys-color-on-surface-variant)"
        >
          Manage your password and security preferences
        </Typography>
      </Box>

      {/* MFA Section */}
      <Box
        sx={{
          bgcolor: 'var(--md-sys-color-surface-container)',
          borderRadius: '16px',
          border: '1px solid var(--md-sys-color-outline-variant)',
          mb: 4,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid var(--md-sys-color-outline-variant)',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                bgcolor: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
              }}
            >
              <ShieldCheck size={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Multi-Factor Authentication
              </Typography>
              <Typography
                variant="body2"
                color="var(--md-sys-color-on-surface-variant)"
              >
                Add an extra layer of security to your account
              </Typography>
            </Box>
          </Box>
        </Box>

        <List disablePadding>
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemText
              primary="Authenticator App"
              secondary="Use an app like Google Authenticator or Authy"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              >
                Setup
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider component="li" />
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemText
              primary="SMS Authentication"
              secondary="Receive a code via SMS"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
            <ListItemSecondaryAction>
              <Switch />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>

      {/* Password Section */}
      <Box
        sx={{
          bgcolor: 'var(--md-sys-color-surface-container)',
          borderRadius: '16px',
          border: '1px solid var(--md-sys-color-outline-variant)',
          mb: 4,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                bgcolor: 'var(--md-sys-color-secondary-container)',
                color: 'var(--md-sys-color-on-secondary-container)',
              }}
            >
              <Key size={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Password
              </Typography>
              <Typography
                variant="body2"
                color="var(--md-sys-color-on-surface-variant)"
              >
                Last changed 3 months ago
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            startIcon={<RotateCcw size={16} />}
            sx={{ borderRadius: '8px' }}
          >
            Change Password
          </Button>
        </Box>
      </Box>

      {/* Login History */}
      <Box>
        <Typography
          variant="h6"
          sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <History size={20} /> Login History
        </Typography>
        <Alert
          severity="info"
          icon={<History size={18} />}
          sx={{ borderRadius: '12px' }}
        >
          You are currently logged in from Chrome on macOS.
        </Alert>
      </Box>
    </Box>
  );
}
