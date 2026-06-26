import type { WorkspaceLayout } from '@/types/tabs';
import { useCallback } from 'react';

export function useTabSelection(
  setLayout: React.Dispatch<React.SetStateAction<WorkspaceLayout>>,
) {
  const setActiveTab = useCallback(
    (panelId: string, tabId: string) => {
      setLayout((prev) => ({
        ...prev,
        panels: prev.panels.map((p) =>
          p.id === panelId ? { ...p, activeTabId: tabId } : p,
        ),
      }));
    },
    [setLayout],
  );

  return { setActiveTab };
}
