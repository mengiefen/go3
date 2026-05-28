import { useState } from 'react';
import type { ChatThread, Message } from './chat-types';

const MOCK_THREADS: ChatThread[] = [
  {
    id: 'thread_1',
    title: 'Code Refactoring using React',
    updatedAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    messages: [
      {
        id: '1',
        role: 'user',
        content:
          'Can you show me how to refactor this component to use a custom hook?',
        createdAt: Date.now() - 1000 * 60 * 60 * 2,
      },
      {
        id: '2',
        role: 'assistant',
        content:
          "Certainly! Here's how you can extract the logic into a `useCustomHook`:\n\n```tsx\nexport function useCustomHook() {\n  const [state, setState] = useState(0);\n  return { state, setState };\n}\n```\n\nThis keeps your components clean.",
        createdAt: Date.now() - 1000 * 60 * 60 * 1.9,
      },
    ],
  },
  {
    id: 'thread_2',
    title: 'Explain Quantum Computing',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    messages: [
      {
        id: '3',
        role: 'user',
        content: 'Explain quantum computing in simple terms.',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      },
      {
        id: '4',
        role: 'assistant',
        content:
          'Quantum computing is a type of computing that takes advantage of the strange ability of subatomic particles to exist in more than one state at any time. Due to the way the tiniest of particles behave, operations can be done much quicker and use less energy than classical computers.',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1.9,
      },
    ],
  },
];

export function useChat() {
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    threads[0]?.id || null,
  );

  const activeThread = threads.find((t) => t.id === activeThreadId) || null;

  const createNewThread = () => {
    const newThread: ChatThread = {
      id: `thread_${Date.now()}`,
      title: 'New conversation',
      messages: [],
      updatedAt: Date.now(),
    };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
  };

  const deleteThread = (id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (activeThreadId === id) {
      setActiveThreadId(null);
    }
  };

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    if (!activeThreadId) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      role,
      content,
      createdAt: Date.now(),
    };

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === activeThreadId) {
          // If this is the first message for a New conversation, generate a title
          const isFirstUserMessage =
            thread.messages.length === 0 && role === 'user';

          return {
            ...thread,
            title: isFirstUserMessage
              ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
              : thread.title,
            messages: [...thread.messages, newMessage],
            updatedAt: Date.now(),
          };
        }
        return thread;
      }),
    );
  };

  const sendMessage = (content: string) => {
    // If no active thread, optionally create one?
    // Usually the user will start a new chat before typing
    // Let's create one if null
    let currentActiveId = activeThreadId;
    if (!currentActiveId) {
      const newThread: ChatThread = {
        id: `thread_${Date.now()}`,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        updatedAt: Date.now(),
      };
      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
      currentActiveId = newThread.id;
      // We will add the message immediately to this new thread by using a direct slice state update
      // below, but let's simply rely on `addMessage` logic by deferring the add if currentActiveId just changed.
      // Wait, let's just use the `setThreads` callback.
    }

    // Add user message right away
    addMessage(content, 'user');

    // Simulate Bot response
    setTimeout(() => {
      addMessage(
        'I am processing your specific request now. Markdown supported:\n\n```python\nprint("Hello World!")\n```\n\nAnd *Lists*:\n- Item 1\n- Item 2\n\n> This is a blockquote!',
        'assistant',
      );
    }, 1200);
  };

  return {
    threads,
    activeThreadId,
    activeThread,
    setActiveThreadId,
    createNewThread,
    deleteThread,
    sendMessage,
  };
}
