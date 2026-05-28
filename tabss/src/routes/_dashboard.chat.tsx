import { Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { ChatLayout } from '../components/ui/chat/ChatLayout';

export const Route = createFileRoute('/_dashboard/chat')({
  component: ChatPage,
});

export function ChatPage() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ChatLayout />
    </Box>
  );
}
