import { createFileRoute } from '@tanstack/react-router';
import { ChatPage } from '@/features/chat/ChatPage';

export const Route = createFileRoute('/_dashboard/chat')({
  component: ChatPage,
});

export { ChatPage };

