import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

// 1. Define the shape of the data that will be shared across the app
type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

// 2. Create the context with default empty values
const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

// 3. Provider component that will wrap our application
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app load, check if there's already an active session stored
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Subscribe to authentication state changes (e.g., login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Cleanup subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom hook to easily consume the AuthContext in any screen
export const useAuth = () => useContext(AuthContext);
