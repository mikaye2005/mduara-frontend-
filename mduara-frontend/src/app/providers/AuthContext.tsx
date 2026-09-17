import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  mockNotifications,
  type ChamaMembership,
  type NotificationItem,
  type UserRole,
  type VerifiedTokenPayload,
  verifiedUsers,
} from '../../shared/mockData';
import { getStoredValue, removeStoredValue, setStoredValue } from '../../services/storage/secureStore';

export interface WorkspaceOption {
  role: UserRole;
  label: string;
}

const AUTH_STORAGE_KEY = 'mduara.prototype-auth.v1';

interface PersistedPrototypeSession {
  phone: string;
  chamaId: number;
  role: UserRole;
}

interface AuthContextValue {
  activeMembership: ChamaMembership | null;
  availableWorkspaces: WorkspaceOption[];
  isAuthenticated: boolean;
  isHydrated: boolean;
  notifications: NotificationItem[];
  selectChama: (chamaId: number) => boolean;
  selectContext: (chamaId: number, role: UserRole) => boolean;
  selectWorkspace: (role: UserRole) => boolean;
  signIn: (phone: string, pin: string) => boolean;
  signOut: () => void;
  unreadNotifications: number;
  user: VerifiedTokenPayload | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const rolePermissions: Record<UserRole, string[]> = {
  member: ['dashboard:view', 'contributions:view:self', 'loans:view:self', 'members:view:safe'],
  chairperson: ['dashboard:view', 'recruitment:manage', 'applications:approve', 'members:manage', 'reports:view'],
  secretary: ['dashboard:view', 'members:register', 'applications:review', 'announcements:manage', 'minutes:manage'],
  treasurer: ['dashboard:view', 'contributions:reconcile', 'financial-monitor:view', 'reports:view'],
  superadmin: ['platform:*'],
};

function workspaceLabel(role: UserRole) {
  if (role === 'member') return 'Member View';
  if (role === 'chairperson') return 'Chair Workspace';
  if (role === 'secretary') return 'Secretary Workspace';
  if (role === 'treasurer') return 'Treasurer Workspace';
  return 'Platform Administration';
}

function normalizePhone(phone: string) {
  return phone.replace(/[\s()-]/g, '');
}

function createSessionUser(source: VerifiedTokenPayload): VerifiedTokenPayload {
  if (source.isPlatformAdmin && source.memberships.length === 0) {
    return { ...source, memberships: [...source.memberships], role: 'superadmin', chamaId: 0, chamaName: 'M-Duara Platform', permissions: rolePermissions.superadmin };
  }

  const firstMembership = source.memberships.find((membership) => membership.status === 'active') ?? source.memberships[0];
  if (!firstMembership) return { ...source, memberships: [], role: 'member', permissions: rolePermissions.member };

  return {
    ...source,
    memberships: source.memberships.map((membership) => ({ ...membership })),
    chamaId: firstMembership.chamaId,
    chamaName: firstMembership.chamaName,
    role: 'member',
    permissions: rolePermissions.member,
  };
}


function restoreSession(source: VerifiedTokenPayload, descriptor: PersistedPrototypeSession): VerifiedTokenPayload | null {
  if (descriptor.role === 'superadmin') {
    if (!source.isPlatformAdmin) return null;
    return {
      ...source,
      memberships: source.memberships.map((membership) => ({ ...membership })),
      role: 'superadmin',
      chamaId: 0,
      chamaName: 'M-Duara Platform',
      permissions: rolePermissions.superadmin,
    };
  }

  const membership = source.memberships.find(
    (item) => item.chamaId === descriptor.chamaId && item.status === 'active',
  );
  if (!membership) return null;
  if (descriptor.role !== 'member' && membership.officialRole !== descriptor.role) return null;

  return {
    ...source,
    memberships: source.memberships.map((item) => ({ ...item })),
    role: descriptor.role,
    chamaId: membership.chamaId,
    chamaName: membership.chamaName,
    permissions: rolePermissions[descriptor.role],
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<VerifiedTokenPayload | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      try {
        const stored = await getStoredValue(AUTH_STORAGE_KEY);
        if (!stored) return;

        const descriptor = JSON.parse(stored) as Partial<PersistedPrototypeSession>;
        if (typeof descriptor.phone !== 'string' || typeof descriptor.chamaId !== 'number' || typeof descriptor.role !== 'string') {
          await removeStoredValue(AUTH_STORAGE_KEY);
          return;
        }

        const source = Object.values(verifiedUsers).find(
          (candidate) => normalizePhone(candidate.phone) === normalizePhone(descriptor.phone!),
        );
        if (!source) {
          await removeStoredValue(AUTH_STORAGE_KEY);
          return;
        }

        const restored = restoreSession(source, descriptor as PersistedPrototypeSession);
        if (!restored) {
          await removeStoredValue(AUTH_STORAGE_KEY);
          if (active) setUser(createSessionUser(source));
          return;
        }

        if (active) setUser(restored);
      } catch {
        await removeStoredValue(AUTH_STORAGE_KEY);
      } finally {
        if (active) setIsHydrated(true);
      }
    };

    void hydrate();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      void removeStoredValue(AUTH_STORAGE_KEY);
      return;
    }

    const descriptor: PersistedPrototypeSession = {
      phone: user.phone,
      chamaId: user.chamaId,
      role: user.role,
    };
    void setStoredValue(AUTH_STORAGE_KEY, JSON.stringify(descriptor));
  }, [isHydrated, user]);

  const activeMembership = useMemo(
    () => user?.memberships.find((membership) => membership.chamaId === user.chamaId) ?? null,
    [user],
  );

  const availableWorkspaces = useMemo<WorkspaceOption[]>(() => {
    if (!user) return [];

    // Platform administration is an additional workspace, not a separate identity.
    // When a platform admin is currently in platform context, selecting a Chama
    // returns them to Member View first; when they are in a Chama context, the
    // Platform Administration workspace remains available alongside any Chama office.
    if (user.role === 'superadmin') {
      return [{ role: 'superadmin', label: workspaceLabel('superadmin') }];
    }

    const workspaces: WorkspaceOption[] = [{ role: 'member', label: workspaceLabel('member') }];
    if (activeMembership?.officialRole) {
      workspaces.push({ role: activeMembership.officialRole, label: workspaceLabel(activeMembership.officialRole) });
    }
    if (user.isPlatformAdmin) {
      workspaces.push({ role: 'superadmin', label: workspaceLabel('superadmin') });
    }
    return workspaces;
  }, [activeMembership, user]);

  const notifications = useMemo(() => (user ? mockNotifications[user.role] ?? [] : []), [user]);
  const unreadNotifications = notifications.filter((item) => !item.read).length;

  const value = useMemo<AuthContextValue>(() => ({
    activeMembership,
    availableWorkspaces,
    isAuthenticated: !!user,
    isHydrated,
    notifications,
    selectChama: (chamaId: number) => {
      if (!user) return false;
      const membership = user.memberships.find((item) => item.chamaId === chamaId && item.status === 'active');
      if (!membership) return false;

      // Chama changes always return to Member View. This prevents an official
      // role in one Chama from leaking into another Chama context.
      setUser({
        ...user,
        chamaId: membership.chamaId,
        chamaName: membership.chamaName,
        role: 'member',
        permissions: rolePermissions.member,
      });
      return true;
    },
    selectContext: (chamaId: number, role: UserRole) => {
      if (!user) return false;

      if (role === 'superadmin') {
        if (!user.isPlatformAdmin) return false;
        setUser({ ...user, role: 'superadmin', chamaId: 0, chamaName: 'M-Duara Platform', permissions: rolePermissions.superadmin });
        return true;
      }

      const membership = user.memberships.find((item) => item.chamaId === chamaId && item.status === 'active');
      if (!membership) return false;
      if (role !== 'member' && membership.officialRole !== role) return false;

      setUser({
        ...user,
        chamaId: membership.chamaId,
        chamaName: membership.chamaName,
        role,
        permissions: rolePermissions[role],
      });
      return true;
    },
    selectWorkspace: (role: UserRole) => {
      if (!user) return false;

      if (role === 'superadmin') {
        if (!user.isPlatformAdmin) return false;
        setUser({ ...user, role: 'superadmin', chamaId: 0, chamaName: 'M-Duara Platform', permissions: rolePermissions.superadmin });
        return true;
      }

      if (!activeMembership) return false;
      if (role !== 'member' && activeMembership.officialRole !== role) return false;

      setUser({
        ...user,
        role,
        chamaId: activeMembership.chamaId,
        chamaName: activeMembership.chamaName,
        permissions: rolePermissions[role],
      });
      return true;
    },
    signIn: (phone: string, pin: string) => {
      const normalizedPhone = normalizePhone(phone.trim());
      const verifiedUser = Object.values(verifiedUsers).find((candidate) => normalizePhone(candidate.phone) === normalizedPhone);
      if (!verifiedUser || pin !== verifiedUser.mockPin) return false;
      setUser(createSessionUser(verifiedUser));
      return true;
    },
    signOut: () => {
      setUser(null);
      void removeStoredValue(AUTH_STORAGE_KEY);
    },
    unreadNotifications,
    user,
  }), [activeMembership, availableWorkspaces, isHydrated, notifications, unreadNotifications, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
