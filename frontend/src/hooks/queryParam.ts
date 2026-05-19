import { useMemo } from 'react';

function useQueryParam(paramName: string): string | null {
  return useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get(paramName);
  }, [paramName]);
}

export default useQueryParam;