import { Box } from '@mui/material';
import { ChatLayout } from '@/components/ui/Chat/ChatLayout';

export function ChatPage() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ChatLayout />
    </Box>
  );
}
