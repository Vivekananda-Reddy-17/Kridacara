import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser } from '../lib/supabase';
import type { User as AuthUser } from '@supabase/supabase-js';

// Your User interface is good!
interface User {
  id: string;
  email: string;
  phone?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  role: 'player' | 'coach' | 'admin';
  location?: string;
  sport_preferences?: string[];
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  updateProfile: (height: number, weight: number) => Promise<void>;
  signUpAndCreateProfile: (email: string, password: string, phone?: string, role?: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✨ Helper function to fetch profile and set user state (DRY principle!)
  const fetchAndSetUser = async (authUser: AuthUser) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authUser.id) // Corrected from 'user_id' to match your likely schema
      .single();

    if (profile) {
      setUser({
        id: authUser.id,
        email: authUser.email!,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        height: profile.height,
        weight: profile.weight,
        bmi: profile.bmi,
        role: profile.role || 'player',
        created_at: profile.created_at,
        // Add other fields as needed
      });
    }
  };


  useEffect(() => {
    // Check current session on initial load
    getCurrentUser().then((authUser) => {
      if (authUser) {
        fetchAndSetUser(authUser);
      }
      setLoading(false);
    });

    // ✨ Revamped listener to handle SIGNED_IN and SIGNED_OUT
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true);
          await fetchAndSetUser(session.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const updateProfile = async (height: number, weight: number) => {
    if (!user) return;
    const bmi = weight / ((height / 100) ** 2);
    const { error } = await supabase
      .from('profiles')
      .update({ height, weight, bmi })
      .eq('user_id', user.id); // Also corrected here

    if (!error) {
      setUser(prev => prev ? { ...prev, height, weight, bmi } : null);
    }
  };

  const signUpAndCreateProfile = async (email: string, password: string, phone?: string, role?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) return { error };

      if (data.user) {
        // ✨ Using upsert() for a robust, error-free profile creation
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: data.user.id,
            display_name: email.split('@')[0],
            role: role || 'player'
          }, {
            onConflict: 'user_id' // Tell upsert which column to check
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { error: profileError };
        }
      }

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, updateProfile, signUpAndCreateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}