import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material';
import { Bell, Mail } from 'lucide-react';

export function NotificationSection() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}
        >
          Notifications
        </Typography>
        <Typography
          variant="body2"
          color="var(--md-sys-color-on-surface-variant)"
        >
          Choose how you receive updates
        </Typography>
      </Box>

      {/* Email Notifications */}
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
            bgcolor: 'var(--md-sys-color-surface-container-high)',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Mail size={20} color="var(--md-sys-color-primary)" />
            <Typography variant="subtitle1" fontWeight={600}>
              Email Notifications
            </Typography>
          </Box>
        </Box>

        <List disablePadding>
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemText
              primary="Security Alerts"
              secondary="Get notified about unusual activity"
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked disabled />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider component="li" />
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemText
              primary="Product Updates"
              secondary="News about new features and improvements"
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider component="li" />
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemText
              primary="Tips & Tutorials"
              secondary="Learn how to get the most out of GO2"
            />
            <ListItemSecondaryAction>
              <Switch />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>

      {/* Push Notifications */}
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
            bgcolor: 'var(--md-sys-color-surface-container-high)',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Bell size={20} color="var(--md-sys-color-primary)" />
            <Typography variant="subtitle1" fontWeight={600}>
              Push Notifications
            </Typography>
          </Box>
        </Box>

        <List disablePadding>
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemText
              primary="New Mentions"
              secondary="When someone mentions you in a comment"
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider component="li" />
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemText
              primary="Task Assignments"
              secondary="When you are assigned a new task"
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
