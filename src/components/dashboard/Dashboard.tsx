import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, MessageSquare, Users, User, Activity, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PlayerDashboard } from './PlayerDashboard';
import { CoachDashboard } from './CoachDashboard';
import { AdminDashboard } from './AdminDashboard';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Route to appropriate dashboard based on user role
  switch (user?.role) {
    case 'coach':
      return <CoachDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'player':
    default:
      return <PlayerDashboard />;
  }
}