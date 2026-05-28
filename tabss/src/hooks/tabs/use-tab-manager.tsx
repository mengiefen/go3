import type { WorkspaceLayout } from '@/types/tabs';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { createContext, useContext, type ReactNode } from 'react';
import { useTabDragAndDrop } from './use-tab-drag-and-drop';
import { useTabNavigation } from './use-tab-navigation';
import { useTabOperations } from './use-tab-operations';
import { useTabPersistence } from './use-tab-persistence';
import { useTabSelection } from './use-tab-selection';
import { useWorkspaceState } from './use-workspace-state';

interface TabContextType {
  layout: WorkspaceLayout;
  setLayout: React.Dispatch<React.SetStateAction<WorkspaceLayout>>;
  openTab: (pageId: string, title: string) => void;
  openDuplicateTab: (pageId: string, title: string) => void;
  closeTab: (tabId: string, panelId: string) => void;
  splitTab: (
    tabId: string,
    panelId: string,
    direction?: 'horizontal' | 'vertical',
  ) => void;
  shareLayout: () => string;
  resetLayout: () => void;
  moveTab: (
    tabId: string,
    fromPanelId: string,
    toPanelId: string,
    newIndex: number,
  ) => void;
  setActiveTab: (panelId: string, tabId: string) => void;
  activeDragTabId: string | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleTabChange: (panelId: string, tabId: string) => void;
}

const TabContext = createContext<TabContextType | null>(null);

export function TabProvider({ children }: { children: ReactNode }) {
  const { layout, setLayout } = useWorkspaceState();

  useTabPersistence(layout, setLayout);

  const { setActiveTab } = useTabSelection(setLayout);

  const {
    openTab,
    openDuplicateTab,
    closeTab,
    splitTab,
    resetLayout,
    shareLayout,
  } = useTabOperations(setLayout);

  // We can pass shareLayout via context if needed, but it needs 'layout' as arg in the hook.
  // The hook implementation accepts layout as arg.
  // Wait, my useTabOperations implementation of shareLayout took layout as arg.
  // Context expects shareLayout() -> string.
  // Let's create a wrapper here or update the hook.
  // The hook implementation: const shareLayout = useCallback((layout: WorkspaceLayout) => ...
  // So we need to wrap it.

  const {
    moveTab,
    activeDragTabId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useTabDragAndDrop(layout, setLayout);

  const { handleTabChange } = useTabNavigation(layout, setActiveTab);

  const contextValue: TabContextType = {
    layout,
    setLayout,
    openTab,
    openDuplicateTab,
    closeTab,
    splitTab,
    shareLayout: () => shareLayout(layout),
    resetLayout,
    moveTab,
    setActiveTab,
    activeDragTabId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleTabChange,
  };

  return (
    <TabContext.Provider value={contextValue}>{children}</TabContext.Provider>
  );
}

export function useTabManager() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabManager must be used within a TabProvider');
  }
  return context;
}
