import {
  AddCircleOutline,
  ArrowUpward,
  Code,
  Image,
  InsertDriveFile,
  SmartToy,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Container,
  IconButton,
  InputBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import { ChatMessage } from './ChatMessage';
import { ChatSidebar } from './ChatSidebar';
import { useChat } from './use-chat';

export function ChatLayout() {
  const {
    threads,
    activeThreadId,
    activeThread,
    setActiveThreadId,
    createNewThread,
    deleteThread,
    sendMessage,
  } = useChat();

  const [inputVal, setInputVal] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePlusClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // Scroll to bottom on new message or thread change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeThread?.messages.length, activeThreadId]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Left Sidebar */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, flexShrink: 0 }}>
        <ChatSidebar
          threads={threads}
          activeThreadId={activeThreadId}
          onSelectThread={setActiveThreadId}
          onCreateThread={createNewThread}
          onDeleteThread={deleteThread}
        />
      </Box>

      {/* Main Chat Area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          bgcolor: 'background.default',
          position: 'relative',
        }}
      >
        {/* Messages Area */}
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            py: 4,
            px: { xs: 2, md: 0 },
            scrollBehavior: 'smooth',
          }}
        >
          <Container
            maxWidth="md"
            sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
          >
            {!activeThread || activeThread.messages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 10,
                  opacity: 0.5,
                }}
              >
                <Avatar
                  sx={{ width: 64, height: 64, bgcolor: 'primary.main', mb: 3 }}
                >
                  <SmartToy sx={{ fontSize: 36 }} />
                </Avatar>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                  How can I help you today?
                </Typography>
              </Box>
            ) : (
              activeThread.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))
            )}
          </Container>
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 3,
            pt: 0,
            display: 'flex',
            justifyContent: 'center',
            bgcolor: 'transparent',
          }}
        >
          <Container maxWidth="md" disableGutters>
            <Paper
              elevation={0}
              sx={{
                p: '8px 12px',
                display: 'flex',
                alignItems: 'flex-end', // align bottom for multi-line
                width: '100%',
                borderRadius: 6,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.2s',
                '&:focus-within': {
                  boxShadow:
                    '0 6px 32px rgba(var(--mui-palette-primary-mainChannel), 0.15)',
                  borderColor: 'primary.light',
                },
              }}
            >
              <IconButton
                sx={{ color: 'text.secondary', p: 1, mb: 0.5 }}
                onClick={handlePlusClick}
              >
                <AddCircleOutline sx={{ fontSize: 24 }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      borderRadius: 2,
                      mt: -1,
                      minWidth: 180,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  },
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <Image fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Upload Image</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <InsertDriveFile fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Attach File</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <Code fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Code Snippet</ListItemText>
                </MenuItem>
              </Menu>
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: '1rem', py: 1 }}
                placeholder="Message AI Assistant..."
                multiline
                maxRows={8}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <IconButton
                sx={{
                  bgcolor: inputVal.trim()
                    ? 'primary.main'
                    : 'action.disabledBackground',
                  color: inputVal.trim()
                    ? 'primary.contrastText'
                    : 'text.disabled',
                  p: 1,
                  ml: 1,
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: inputVal.trim()
                      ? 'primary.dark'
                      : 'action.disabledBackground',
                    transform: inputVal.trim() ? 'scale(1.05)' : 'none',
                  },
                  transition: 'all 0.2s ease',
                }}
                onClick={handleSend}
                disabled={!inputVal.trim()}
              >
                <ArrowUpward sx={{ fontSize: 20 }} />
              </IconButton>
            </Paper>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: 'text.disabled',
                mt: 1.5,
              }}
            >
              AI Assistant can make mistakes. Consider verifying important
              information.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
