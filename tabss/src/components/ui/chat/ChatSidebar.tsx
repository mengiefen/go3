import { Add, DeleteOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import type { ChatThread } from './chat-types';

interface ChatSidebarProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onCreateThread: () => void;
  onDeleteThread: (id: string) => void;
}

export function ChatSidebar({
  threads,
  activeThreadId,
  onSelectThread,
  onCreateThread,
  onDeleteThread,
}: ChatSidebarProps) {
  return (
    <Box
      sx={{
        width: 260,
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="inherit"
          startIcon={<Add />}
          onClick={onCreateThread}
          sx={{
            bgcolor: 'action.hover',
            color: 'text.primary',
            boxShadow: 'none',
            border: 'none',
            borderRadius: 2,
            justifyContent: 'flex-start',
            px: 2,
            py: 1.5,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'action.selected',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          New chat
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List sx={{ px: 2, pt: 0 }}>
          {threads.length === 0 && (
            <Typography
              variant="body2"
              color="text.disabled"
              sx={{ p: 1, textAlign: 'center' }}
            >
              No recent chats
            </Typography>
          )}
          {threads.map((thread) => (
            <ListItem
              key={thread.id}
              disablePadding
              sx={{ mb: 0.5 }}
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteThread(thread.id);
                  }}
                  sx={{
                    opacity: activeThreadId === thread.id ? 1 : 0,
                    transition: 'opacity 0.2s',
                    '&:hover': { color: 'error.main' },
                  }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              }
            >
              <ListItemButton
                selected={activeThreadId === thread.id}
                onClick={() => onSelectThread(thread.id)}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 1.5,
                  '&:hover': {
                    bgcolor: 'action.hover',
                    '& .MuiListItemSecondaryAction-root .MuiIconButton-root': {
                      opacity: 1,
                    },
                  },
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                    '&:hover': { bgcolor: 'action.selected' },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: activeThreadId === thread.id ? 500 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {thread.title}
                    </Typography>
                  </Box>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
