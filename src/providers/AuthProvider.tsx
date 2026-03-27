import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

/**
 * Supported User Roles in the application.
 */
type UserRole = 'ADMIN' | 'BARBER' | 'CLIENT' | null;

/**
 * Auth Context State definition.
 */
type AuthContextType = {
  session: Session | null;
  role: UserRole;
  isProfessional: boolean;
  loading: boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  role: null,
  isProfessional: false,
  loading: true,
});

/**
 * Authentication Provider.
 * Manages the global session and user roles extracted from Supabase metadata.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isProfessional, setIsProfessional] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Logic to identify the user's role and professional status.
     * Professionals include both ADMIN and BARBER roles.
     */
    const extractRoleInfo = (session: Session | null) => {
      
      console.log('== FULL USER METADATA ==', JSON.stringify(session?.user?.user_metadata));
      // -------------------------------------------
      
      const userRole = (session?.user?.user_metadata?.role as UserRole) || (session ? 'CLIENT' : null);
      const professional = userRole === 'ADMIN' || userRole === 'BARBER';
      
      console.log('== EXTRACTED ROLE:', userRole, '| IS PROFESSIONAL:', professional, ' ==');
      
      return { userRole, professional };
    };

    // Initial session check on application load
    supabase.auth.getSession().then(({ data: { session } }) => {
      const { userRole, professional } = extractRoleInfo(session);
      setSession(session);
      setRole(userRole);
      setIsProfessional(professional);
      setLoading(false);
    });

    // Listen to real-time auth state changes (SignIn, SignOut, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const { userRole, professional } = extractRoleInfo(session);
        setSession(session);
        setRole(userRole);
        setIsProfessional(professional);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, role, isProfessional, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
