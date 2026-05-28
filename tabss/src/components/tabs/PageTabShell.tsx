'use client';

import { Box, Typography } from '@mui/material';
import { useRouter } from '@tanstack/react-router';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageTabShellProps {
  title: string;
  children: ReactNode;
  onClose?: () => void; // Optional close handler if we want to simulate closing
}

export function PageTabShell({ title, children, onClose }: PageTabShellProps) {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        bgcolor: 'background.default',
      }}
    >
      {/* Tab Bar Area mimicking TabGroup */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          px: 1,
          display: 'flex',
          alignItems: 'flex-end',
          height: 33, // Match TabGroup height + border
        }}
      >
        {/* Active Tab Look-alike */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            bgcolor: 'background.default',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            border: 1,
            borderColor: 'divider',
            borderBottom: 'none',
            mb: -1, // Overlap border
            position: 'relative',
            zIndex: 1,
            minWidth: 120,
            maxWidth: 200,
            height: 32,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: '13px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              flex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>

          {/* Close Button Simulation (navigates back or to home?) */}
          {/* For now, maybe just a visual close button that does nothing or goes to dashboard? */}
          {/* Default behavior: go to dashboard? */}
          <Box
            onClick={() => (onClose ? onClose() : router.navigate({ to: '/' }))}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 16,
              height: 16,
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'text.primary',
              },
            }}
          >
            <X size={12} />
          </Box>
        </Box>
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {children}
      </Box>
    </Box>
  );
}
