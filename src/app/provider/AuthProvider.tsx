
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { AppState, AppStateStatus } from "react-native";
import { supabase } from "@/lib/supabase"; 
type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error) {
        setError(error.message ?? "Failed to get session");
        setSession(null);
        setUser(null);
      } else {
        const next = data.session ?? null;
        setSession(next);
        setUser(next?.user ?? null);
      }
      setLoading(false);
    };

    void syncSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!isMounted) return;
      setSession(next);
      setUser(next?.user ?? null);
      setError(null);
      setLoading(false);
    });

    const onAppStateChange = (nextState: AppStateStatus) => {
      const wasBackground = appState.current.match(/inactive|background/);
      appState.current = nextState;
      if (wasBackground && nextState === "active") {
        void syncSession(); // refresh when coming back to foreground
      }
    };

    const appStateSub = AppState.addEventListener("change", onAppStateChange);

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
      appStateSub.remove();
    };
  }, []);

  const refresh = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      setError(error.message ?? "Failed to refresh session");
      return;
    }
    const next = data.session ?? null;
    setSession(next);
    setUser(next?.user ?? null);
    setError(null);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message ?? "Failed to sign out");
      return;
    }
    setSession(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      session,
      isAuthenticated: Boolean(user),
      loading,
      error,
      refresh,
      signOut,
    }),
    [user, session, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
