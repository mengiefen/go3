import { Box, Button, TextField, Typography } from '@mui/material';
import { Camera, Shield, User } from 'lucide-react';
import { useState } from 'react';

export function ProfileSection() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@go2.net',
    username: 'johndoe',
    bio: 'Cyberpunk enthusiast and developer.',
  });

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 700,
            }}
          >
            Profile
          </Typography>
          <Typography
            variant="body2"
            color="var(--md-sys-color-on-surface-variant)"
          >
            Manage your public profile and personal details
          </Typography>
        </Box>
      </Box>

      {/* Profile Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          p: 3,
          mb: 4,
          bgcolor: 'var(--md-sys-color-surface-container)',
          borderRadius: '16px',
          border: '1px solid var(--md-sys-color-outline-variant)',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'var(--md-sys-color-tertiary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--md-sys-color-background)',
            }}
          >
            <User size={32} color="var(--md-sys-color-on-tertiary-container)" />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: 'var(--md-sys-color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid var(--md-sys-color-background)',
            }}
          >
            <Camera size={14} color="var(--md-sys-color-on-primary)" />
          </Box>
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {formData.firstName} {formData.lastName}
          </Typography>
          <Typography
            variant="body2"
            color="var(--md-sys-color-on-surface-variant)"
          >
            user_id: {formData.username}
          </Typography>
        </Box>
      </Box>

      {/* Profile Form */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            fullWidth
            slotProps={{ input: { sx: { borderRadius: '8px' } } }}
          />
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            fullWidth
            slotProps={{ input: { sx: { borderRadius: '8px' } } }}
          />
        </Box>

        <TextField
          label="Email Address"
          value={formData.email}
          fullWidth
          disabled
          slotProps={{
            input: {
              endAdornment: (
                <Shield
                  size={16}
                  color="var(--md-sys-color-on-surface-variant)"
                />
              ),
              sx: { borderRadius: '8px' },
            },
          }}
          helperText="Email cannot be changed directly for security reasons."
        />

        <TextField
          label="Bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          fullWidth
          multiline
          rows={4}
          slotProps={{ input: { sx: { borderRadius: '8px' } } }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
