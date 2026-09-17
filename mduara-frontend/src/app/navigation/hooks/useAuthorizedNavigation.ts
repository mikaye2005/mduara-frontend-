import { useEffect, useMemo, useState } from 'react';

import { getFallbackPath, getRoleNavItems, isPathAllowed } from '../config';
import type { AppPath, AppRole } from '../types';

interface UseAuthorizedNavigationOptions {
  role: AppRole;
}

export function useAuthorizedNavigation({ role }: UseAuthorizedNavigationOptions) {
  const fallbackPath = useMemo(() => getFallbackPath(role), [role]);
  const [currentPath, setCurrentPath] = useState<AppPath>(fallbackPath);

  const allowedNavItems = useMemo(() => getRoleNavItems(role), [role]);
  const mobileNavItems = useMemo(
    () => allowedNavItems.filter((item) => item.showInMobile).slice(0, 4),
    [allowedNavItems],
  );

  // Derive the route synchronously so a workspace change can never render
  // one frame of a path that is not allowed for the new role.
  const safeCurrentPath = isPathAllowed(currentPath, role) ? currentPath : fallbackPath;

  useEffect(() => {
    if (currentPath !== safeCurrentPath) setCurrentPath(safeCurrentPath);
  }, [currentPath, safeCurrentPath]);

  const navigateTo = (path: AppPath) => {
    setCurrentPath(isPathAllowed(path, role) ? path : fallbackPath);
  };

  return { allowedNavItems, currentPath: safeCurrentPath, mobileNavItems, navigateTo };
}
