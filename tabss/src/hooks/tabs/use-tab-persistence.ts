import type { WorkspaceLayout } from '@/types/tabs';
import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'suk-workspace-layout';

export function useTabPersistence(
  layout: WorkspaceLayout,
  setLayout: React.Dispatch<React.SetStateAction<WorkspaceLayout>>,
) {
  const hasMountedRef = useRef(false);

  // Hydrate from local storage after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setLayout(parsed);
        }
      } catch (e) {
        console.error('Failed to hydrate tabs', e);
      }
    }
  }, [setLayout]);

  // Save to local storage on change 
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, [layout]);
}
