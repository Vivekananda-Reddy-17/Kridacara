import React, { useState } from 'react';
import { Mail, Lock, Trophy, Phone } from 'lucide-react';
import { signIn, signUp } from '../../lib/supabase';
import { auth, googleProvider } from '../../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('player');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUpAndCreateProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await signUpAndCreateProfile(email, password, undefined, role);
        
        if (error) {
          if (error.message?.includes('user_already_exists') || error.code === 'user_already_exists') {
            setError('This email is already registered. Switching to sign in...');
            setTimeout(() => {
              setIsSignUp(false);
              setError('');
            }, 2000);
          } else {
            setError(error.message);
          }
        } else {
          setError('Account created successfully! You can now sign in.');
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message?.includes('invalid_credentials') || error.code === 'invalid_credentials') {
            setError('Invalid email or password. Please double-check your credentials and try again.');
          } else {
            setError(error.message);
          }
        }
      }

    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Handle successful Google sign-in
      console.log('Google sign-in successful:', result.user);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Kridacara
          </h2>
          <p className="text-gray-600">
            AI-powered sports talent assessment platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            placeholder="Enter your email"
          />

          {isSignUp && (
            <>
              <Select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
                options={[
                  { value: 'player', label: 'Player/Athlete' },
                  { value: 'coach', label: 'Coach/Scout' },
                  { value: 'admin', label: 'Administrator' }
                ]}
              />
            </>
          )}
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            placeholder="Enter your password"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            loading={loading}
            size="lg"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            loading={googleLoading}
            variant="outline"
            fullWidth
            className="mt-4"
          >
            <img 
              src="https://developers.google.com/identity/images/g-logo.png" 
              alt="Google" 
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </Button>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isSignUp 
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </div>
    </div>
  );
}