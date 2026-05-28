'use client';

import { useTabManager } from '@/hooks/use-tab-manager';
import { useLocation } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

export function RouteSynchronizer() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const { openTab } = useTabManager();
  const lastPathRef = useRef(pathname);

  useEffect(() => {
    if (pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;

    let pageId = '';
    let title = '';

    if (pathname === '/') {
      pageId = 'dashboard';
      title = 'Dashboard';
    } else if (pathname.startsWith('/inventory')) {
      pageId = 'inventory';
      title = 'Inventory';
    } else if (pathname.startsWith('/sales')) {
      pageId = 'sales';
      title = 'Sales';
    } else if (pathname.startsWith('/calendar')) {
      pageId = 'calendar';
      title = 'Calendar';
    } else if (pathname.startsWith('/shops')) {
      pageId = 'shops';
      title = 'Shops';
    } else if (pathname.startsWith('/settings')) {
      pageId = 'settings';
      title = 'Settings';
    } else if (pathname.startsWith('/tables')) {
      pageId = 'tables';
      title = 'Tables';
    } else if (pathname.startsWith('/chat')) {
      pageId = 'chat';
      title = 'Chat';
    }

    if (pageId) {
      openTab(pageId, title);
    }
  }, [pathname, openTab]);

  return null;
}
