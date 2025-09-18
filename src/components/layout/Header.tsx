import React from 'react';
import { Trophy, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../lib/supabase';
import { Button } from '../ui/Button';

export function Header() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Kridacara
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <div className="flex flex-col">
                  <span>{user.display_name || user.email}</span>
                  <span className="text-xs capitalize text-gray-500">{user.role}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                icon={LogOut}
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}