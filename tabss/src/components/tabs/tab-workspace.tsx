import { useTabManager } from '@/hooks/use-tab-manager';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import Box from '@mui/material/Box';
import React from 'react';
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from 'react-resizable-panels';
import { TabGroup } from './tab-group';

export function TabWorkspace() {
  const {
    layout,
    setLayout,
    closeTab,
    splitTab,
    openDuplicateTab,
    shareLayout,
    activeDragTabId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleTabChange,
  } = useTabManager();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const closePanel = (panelId: string) => {
    setLayout((prev) => {
      const newPanels = prev.panels.filter((p) => p.id !== panelId);
      if (newPanels.length === 0) return prev;
      return {
        ...prev,
        panels: newPanels,
        sizes: newPanels.map(() => 100 / newPanels.length),
      };
    });
  };

  // Helper to find the tab object for overlay
  const activeDragTab = layout.panels
    .flatMap((p) => p.tabs)
    .find((t) => t.id === activeDragTabId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{ height: '100%', width: '100%', bgcolor: 'background.default' }}
      >
        <PanelGroup
          orientation={layout.direction}
          style={{ height: '100%', width: '100%' }}
        >
          {layout.panels.map((panel, index) => (
            <React.Fragment key={panel.id}>
              {index > 0 && (
                <PanelResizeHandle style={{ position: 'relative', zIndex: 10 }}>
                  <Box
                    sx={{
                      backgroundColor: 'divider',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        opacity: 0.5,
                      },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: layout.direction === 'horizontal' ? '4px' : '100%',
                      height: layout.direction === 'vertical' ? '4px' : '100%',
                      cursor:
                        layout.direction === 'horizontal'
                          ? 'col-resize'
                          : 'row-resize',
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: 'divider',
                        borderRadius: '999px',
                        width: layout.direction === 'vertical' ? '16px' : '4px',
                        height:
                          layout.direction === 'vertical' ? '4px' : '16px',
                      }}
                    />
                  </Box>
                </PanelResizeHandle>
              )}
              <Panel
                defaultSize={layout.sizes[index]}
                minSize={10}
                style={{ position: 'relative' }}
              >
                <TabGroup
                  panelId={panel.id}
                  isMainPanel={index === 0}
                  tabs={panel.tabs}
                  activeTabId={panel.activeTabId}
                  onTabsChange={(tabs) =>
                    setLayout((prev) => ({
                      ...prev,
                      panels: prev.panels.map((p) =>
                        p.id === panel.id ? { ...p, tabs } : p,
                      ),
                    }))
                  }
                  onActiveTabChange={(id) => handleTabChange(panel.id, id)}
                  onCloseTab={(id) => closeTab(id, panel.id)}
                  onSplitRight={() =>
                    splitTab(panel.activeTabId, panel.id, 'horizontal')
                  }
                  onSplitDown={() =>
                    splitTab(panel.activeTabId, panel.id, 'vertical')
                  }
                  onDuplicate={() => {
                    const activeTab = panel.tabs.find(
                      (t) => t.id === panel.activeTabId,
                    );
                    if (activeTab)
                      openDuplicateTab(activeTab.pageId, activeTab.title);
                  }}
                  onCopyLink={() => {
                    const url = shareLayout();
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(url);
                    }
                  }}
                  onClosePanel={
                    index > 0 ? () => closePanel(panel.id) : undefined
                  }
                />
              </Panel>
            </React.Fragment>
          ))}
        </PanelGroup>

        <DragOverlay>
          {activeDragTabId ? (
            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                fontSize: '0.8125rem',
                fontWeight: 600,
                boxShadow: 3,
                color: 'text.primary',
                opacity: 0.9,
                cursor: 'grabbing',
              }}
            >
              {activeDragTab?.title}
            </Box>
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}
