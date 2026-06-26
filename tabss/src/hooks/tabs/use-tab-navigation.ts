import type { WorkspaceLayout } from '@/types/tabs';
import { useNavigate } from '@tanstack/react-router';

export function useTabNavigation(
  layout: WorkspaceLayout,
  setActiveTab: (panelId: string, tabId: string) => void,
) {
  const navigate = useNavigate();

  const handleTabChange = (panelId: string, tabId: string) => {
    // 1. Update state
    setActiveTab(panelId, tabId);

    // 2. Sync URL if main panel
    const panelIndex = layout.panels.findIndex((p) => p.id === panelId);
    if (panelIndex === 0) {
      const panel = layout.panels.find((p) => p.id === panelId);
      const tab = panel?.tabs.find((t) => t.id === tabId);

      if (tab) {
        let path = '/';
        switch (tab.pageId) {
          case 'dashboard':
            path = '/';
            break;
          case 'inventory':
            path = '/inventory';
            break;
          case 'sales':
            path = '/sales';
            break;
          case 'calendar':
            path = '/calendar';
            break;
          case 'shops':
            path = '/shops';
            break;
          case 'settings':
            path = '/settings';
            break;
          default:
            path = '/';
        }
        navigate({ to: path });
      }
    }
  };

  return { handleTabChange };
}
