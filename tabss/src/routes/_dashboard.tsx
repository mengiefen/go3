import { RouteSynchronizer } from '@/components/tabs/route-synchronizer';
import { Sidebar } from '@/components/tabs/sidebar';
import { TabWorkspace } from '@/components/tabs/tab-workspace';
import { TabProvider } from '@/hooks/tabs/use-tab-manager';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <TabProvider>
      <RouteSynchronizer />
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          backgroundColor: 'var(--mui-palette-background-default)', // Using MUI var or theme value?
          // Using theme values if possible, or consistent generic styles.
          // Note: Using inline styles to match what we saw in tabs/ layout, but adapted.
          // Tabs used CSS vars --md-sys-color-background.
          // We should use MUI system or verify ThemeProvider handles it.
          // Let's use generic styles or MUI Box maybe for consistency with ThemeRegistry?
          // But Sidebar and TabWorkspace expect strict flex layout.
        }}
      >
        <Sidebar />
        <main
          style={{
            flex: 1,
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <TabWorkspace />
        </main>
      </div>
    </TabProvider>
  );
}
