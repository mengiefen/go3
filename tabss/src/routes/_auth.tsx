import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--md-sys-color-background)',
        color: 'var(--md-sys-color-on-background)',
      }}
    >
      <main
        style={{
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Outlet />
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
