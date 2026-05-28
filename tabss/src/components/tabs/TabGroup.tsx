import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import { useMemo, useState } from 'react';

import type { Tab } from '@/types/tabs';
import { PageContent } from './PageRegistry';
import { SortableTab } from './SortableTab';
import { TabContainerContextMenu } from './TabContainerContextMenu';
import { TabContextMenu } from './TabContextMenu';

interface TabGroupProps {
  panelId: string;
  isMainPanel: boolean;
  tabs: Tab[];
  activeTabId: string;
  onTabsChange: (tabs: Tab[]) => void;
  onActiveTabChange: (id: string) => void;
  onCloseTab: (id: string) => void;
  onSplitRight: (id: string) => void;
  onSplitDown: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCopyLink: () => void;
  onClosePanel?: () => void;
}

export function TabGroup({
  // panelId,
  isMainPanel,
  tabs,
  activeTabId,
  onTabsChange,
  onActiveTabChange,
  onCloseTab,
  onSplitRight,
  onSplitDown,
  onDuplicate,
  onCopyLink,
  onClosePanel,
}: TabGroupProps) {
  const [tabContextMenu, setTabContextMenu] = useState<{
    anchorPoint: { x: number; y: number };
    tabId: string;
  } | null>(null);
  const [containerContextMenu, setContainerContextMenu] = useState<{
    anchorPoint: { x: number; y: number };
  } | null>(null);

  const tabIds = useMemo(() => tabs.map((t) => t.id), [tabs]);

  const handleCloseOthers = (id: string) => {
    const keep = tabs.filter((t) => t.id === id || t.pinned);
    onTabsChange(keep);
    onActiveTabChange(id);
  };

  const handleCloseAll = () => {
    const pinned = tabs.filter((t) => t.pinned);

    if (isMainPanel) {
      // Main panel: just clear tabs but keep panel
      onTabsChange(pinned);
      if (pinned.length > 0) onActiveTabChange(pinned[0].id);
    } else {
      // Split panel: close the entire panel if no pinned tabs
      if (pinned.length === 0 && onClosePanel) {
        onClosePanel();
      } else {
        onTabsChange(pinned);
        if (pinned.length > 0) onActiveTabChange(pinned[0].id);
      }
    }
  };

  const handleTogglePin = (id: string) => {
    onTabsChange(
      tabs.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)),
    );
  };

  if (tabs.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'text.secondary',
          bgcolor: 'background.default',
        }}
      >
        No tabs open. Select a page from the sidebar.
      </Box>
    );
  }

  return (
    <TabContext value={activeTabId}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <SortableContext
          items={tabIds}
          strategy={horizontalListSortingStrategy}
        >
          <Box
            onContextMenu={(e: React.MouseEvent) => {
              e.preventDefault();
              setContainerContextMenu({
                anchorPoint: { x: e.clientX, y: e.clientY },
              });
            }}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              px: 1,
            }}
          >
            <TabList
              onChange={(_, v) => onActiveTabChange(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 32,
                height: 32,
                '& .MuiTabs-flexContainer': {
                  gap: 0,
                },
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
              }}
            >
              {tabs.map((tab) => (
                <SortableTab
                  key={tab.id}
                  tab={tab}
                  onClose={onCloseTab}
                  value={tab.id}
                  isActive={activeTabId === tab.id}
                  onContextMenu={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTabContextMenu({
                      anchorPoint: { x: e.clientX, y: e.clientY },
                      tabId: tab.id,
                    });
                  }}
                />
              ))}
            </TabList>
          </Box>
        </SortableContext>

        <TabContextMenu
          anchorPoint={tabContextMenu?.anchorPoint ?? null}
          tabId={tabContextMenu?.tabId ?? null}
          isPinned={tabs.find((t) => t.id === tabContextMenu?.tabId)?.pinned}
          onClose={() => setTabContextMenu(null)}
          onUnpin={() =>
            tabContextMenu?.tabId && handleTogglePin(tabContextMenu.tabId)
          }
          onCloseTab={onCloseTab}
          onCloseOthers={handleCloseOthers}
          onCloseAll={handleCloseAll}
          onDuplicate={onDuplicate}
          onSplitRight={onSplitRight}
          onSplitDown={onSplitDown}
          onTogglePin={handleTogglePin}
          onCopyLink={onCopyLink}
        />

        <TabContainerContextMenu
          anchorPoint={containerContextMenu?.anchorPoint ?? null}
          onClose={() => setContainerContextMenu(null)}
          onCloseAll={handleCloseAll}
        />

        <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {tabs.map((tab) => (
            <TabPanel
              key={tab.id}
              value={tab.id}
              sx={{
                height: '100%',
                p: 0,
                overflow: 'auto',
                display: activeTabId === tab.id ? 'block' : 'none',
              }}
            >
              {/* Render content based on pageId using the registry. 
                  This ensures each split pane renders its own content independent of the global router outlet. */}
              {activeTabId === tab.id ? (
                <PageContent pageId={tab.pageId} />
              ) : null}
            </TabPanel>
          ))}
        </Box>
      </Box>
    </TabContext>
  );
}
