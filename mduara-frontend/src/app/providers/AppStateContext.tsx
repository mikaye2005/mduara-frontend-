import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { configureApiClient } from '../../services/api/client';
import { clearStoredValues, getStoredValue, setStoredValue } from '../../services/storage/secureStore';

const STORAGE_KEY = 'mduara.app-state.v1';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface AppProfile {
  id: string;
  fullName: string;
  phone: string | null;
  email: string;
  globalRole?: string;
  memberships?: Array<{
    chamaId: string;
    chamaName?: string;
    role: string;
    membershipStatus?: string;
  }>;
}

export interface AppState {
  auth: {
    tokens: AuthTokens | null;
    activeChamaId: string | null;
  };
  profile: AppProfile | null;
  dashboardMetrics: Record<string, unknown>;
  activeLoans: unknown[];
  notifications: unknown[];
}

type Action =
  | { type: 'HYDRATE'; payload: AppState }
  | { type: 'SET_SESSION'; payload: { tokens: AuthTokens; profile: AppProfile; activeChamaId?: string | null } }
  | { type: 'SET_ACTIVE_CHAMA'; payload: string | null }
  | { type: 'SET_DASHBOARD_METRICS'; payload: Record<string, unknown> }
  | { type: 'SET_ACTIVE_LOANS'; payload: unknown[] }
  | { type: 'SET_NOTIFICATIONS'; payload: unknown[] }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  auth: { tokens: null, activeChamaId: null },
  profile: null,
  dashboardMetrics: {},
  activeLoans: [],
  notifications: [],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'SET_SESSION':
      return {
        ...state,
        auth: {
          tokens: action.payload.tokens,
          activeChamaId: action.payload.activeChamaId ?? state.auth.activeChamaId,
        },
        profile: action.payload.profile,
      };
    case 'SET_ACTIVE_CHAMA':
      return { ...state, auth: { ...state.auth, activeChamaId: action.payload } };
    case 'SET_DASHBOARD_METRICS':
      return { ...state, dashboardMetrics: action.payload };
    case 'SET_ACTIVE_LOANS':
      return { ...state, activeLoans: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

interface AppStateContextValue {
  state: AppState;
  isHydrated: boolean;
  setSession: (tokens: AuthTokens, profile: AppProfile, activeChamaId?: string | null) => void;
  setActiveChamaId: (chamaId: string | null) => void;
  setDashboardMetrics: (metrics: Record<string, unknown>) => void;
  setActiveLoans: (loans: unknown[]) => void;
  setNotifications: (notifications: unknown[]) => void;
  logout: () => Promise<void>;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

function isPersistedState(value: unknown): value is AppState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<AppState>;
  return !!candidate.auth && 'tokens' in candidate.auth && 'activeChamaId' in candidate.auth;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const persisted = await getStoredValue(STORAGE_KEY);
        if (persisted) {
          const parsed = JSON.parse(persisted) as unknown;
          if (isPersistedState(parsed) && mounted) dispatch({ type: 'HYDRATE', payload: parsed });
        }
      } catch {
        // Corrupt local state must never prevent the application from loading.
        await clearStoredValues([STORAGE_KEY]);
      } finally {
        if (mounted) setIsHydrated(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    void setStoredValue(STORAGE_KEY, JSON.stringify(state));
  }, [isHydrated, state]);

  const logout = useCallback(async () => {
    dispatch({ type: 'LOGOUT' });
    await clearStoredValues([STORAGE_KEY]);
  }, []);

  useEffect(() => {
    configureApiClient({
      tokenGetter: () => stateRef.current.auth.tokens?.accessToken ?? null,
      unauthorizedHandler: logout,
    });
  }, [logout]);

  const value = useMemo<AppStateContextValue>(() => ({
    state,
    isHydrated,
    setSession: (tokens, profile, activeChamaId) => dispatch({
      type: 'SET_SESSION',
      payload: { tokens, profile, activeChamaId },
    }),
    setActiveChamaId: (chamaId) => dispatch({ type: 'SET_ACTIVE_CHAMA', payload: chamaId }),
    setDashboardMetrics: (metrics) => dispatch({ type: 'SET_DASHBOARD_METRICS', payload: metrics }),
    setActiveLoans: (loans) => dispatch({ type: 'SET_ACTIVE_LOANS', payload: loans }),
    setNotifications: (notifications) => dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications }),
    logout,
  }), [isHydrated, logout, state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}
