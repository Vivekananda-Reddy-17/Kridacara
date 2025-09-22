import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser } from '../lib/supabase';

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

  useEffect(() => {
    // Check current session
    getCurrentUser().then(async (authUser) => {
      if (authUser) {
        // Fetch user profile
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .maybeSingle();

        if (data) {
          setUser({
            id: authUser.id,
            email: authUser.email!,
            display_name: data.display_name,
            avatar_url: data.avatar_url,
            bio: data.bio,
            height: data.height,
            weight: data.weight,
            bmi: data.bmi,
            role: data.role || 'player',
            created_at: data.created_at
          });
        } else {
          // Create profile if doesn't exist
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({
              user_id: authUser.id,
              role: 'player'
            })
            .select()
            .single();

          if (newProfile) {
            setUser({
              id: authUser.id,
              email: authUser.email!,
              display_name: newProfile.display_name,
              avatar_url: newProfile.avatar_url,
              bio: newProfile.bio,
              role: newProfile.role || 'player',
              created_at: newProfile.created_at
            });
          }
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const updateProfile = async (height: number, weight: number) => {
    if (!user) return;

    const bmi = weight / ((height / 100) ** 2);

    const { error } = await supabase
      .from('profiles')
      .update({ 
        height,
        weight,
        bmi
      })
      .eq('user_id', user.id);

    if (!error) {
      setUser(prev => prev ? { 
        ...prev, 
        height, 
        weight, 
        bmi 
      } : null);
    }
  };

  const signUpAndCreateProfile = async (
  email: string,
  password: string,
  phone?: string,
  role?: string
) => {
  try {
    console.log("Signing up with role:", role);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: (role?.trim() || "player").toLowerCase(),
          display_name: email.split("@")[0],
          phone: phone || null,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error.message);
      return { error };
    }

    console.log("User created:", data);
    console.log("Signup successful, user will be created via trigger");

    return { error: null, data };
  } catch (err) {
    console.error("Signup exception:", err);
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