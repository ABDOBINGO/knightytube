'use client';

import { useEffect, useCallback } from 'react';

export function useUnsavedChanges(hasChanges: boolean) {
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    },
    [hasChanges]
  );

  useEffect(() => {
    if (hasChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [hasChanges, handleBeforeUnload]);
}