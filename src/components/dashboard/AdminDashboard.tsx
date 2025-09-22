import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Settings, BarChart3, Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, UserCheck, FileText, Database, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

// Dummy data - replace with real queries later
const dummySystemStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalAssessments: 5634,
  pendingApprovals: 23,
  systemHealth: 98.5,
  storageUsed: 67
};

const dummyUserDistribution = [
  { name: 'Players', value: 1089, color: '#3b82f6' },
  { name: 'Coaches', value: 134, color: '#10b981' },
  { name: 'Admins', value: 24, color: '#f59e0b' }
];

const dummyActivityData = [
  { month: 'Jan', users: 1100, assessments: 450 },
  { month: 'Feb', users: 1150, assessments: 520 },
  { month: 'Mar', users: 1200, assessments: 580 },
  { month: 'Apr', users: 1247, assessments: 634 }
];

const dummyPendingApprovals = [
  { id: 1, type: 'Coach Registration', user: 'John Smith', submitted: '2024-01-10', priority: 'high' },
  { id: 2, type: 'Assessment Review', user: 'Sarah Johnson', submitted: '2024-01-11', priority: 'medium' },
  { id: 3, type: 'Content Moderation', user: 'Mike Wilson', submitted: '2024-01-12', priority: 'low' },
  { id: 4, type: 'Data Export Request', user: 'Emma Davis', submitted: '2024-01-13', priority: 'high' }
];

const dummyRecentUsers = [
  { id: 1, name: 'Alex Thompson', email: 'alex@example.com', role: 'player', joined: '2024-01-10', status: 'active' },
  { id: 2, name: 'Maria Garcia', email: 'maria@example.com', role: 'coach', joined: '2024-01-11', status: 'pending' },
  { id: 3, name: 'David Lee', email: 'david@example.com', role: 'player', joined: '2024-01-12', status: 'active' },
  { id: 4, name: 'Lisa Chen', email: 'lisa@example.com', role: 'player', joined: '2024-01-13', status: 'active' }
];

const dummySystemAlerts = [
  { id: 1, type: 'warning', message: 'High server load detected', time: '2 hours ago' },
  { id: 2, type: 'info', message: 'Database backup completed', time: '4 hours ago' },
  { id: 3, type: 'error', message: 'Failed login attempts spike', time: '6 hours ago' }
];

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedUserFilter, setSelectedUserFilter] = useState('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Admin Dashboard ⚡
              </h1>
              <p className="text-xl text-gray-600">
                System overview and management controls
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">System Health</p>
                <p className="text-2xl font-bold text-green-600">{dummySystemStats.systemHealth}%</p>
              </div>
              <Button icon={Settings} className="bg-gray-800 hover:bg-gray-900">
                System Settings
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold">{dummySystemStats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-10 w-10 text-blue-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold">{dummySystemStats.activeUsers.toLocaleString()}</p>
              </div>
              <Activity className="h-10 w-10 text-green-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Assessments</p>
                <p className="text-3xl font-bold">{dummySystemStats.totalAssessments.toLocaleString()}</p>
              </div>
              <FileText className="h-10 w-10 text-purple-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold">{dummySystemStats.pendingApprovals}</p>
              </div>
              <Clock className="h-10 w-10 text-orange-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Health</p>
                <p className="text-3xl font-bold">{dummySystemStats.systemHealth}%</p>
              </div>
              <Shield className="h-10 w-10 text-indigo-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Storage</p>
                <p className="text-3xl font-bold">{dummySystemStats.storageUsed}%</p>
              </div>
              <Database className="h-10 w-10 text-teal-200" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Analytics Section */}
          <div className="lg:col-span-3 space-y-8">
            {/* User Distribution */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                  User Distribution
                </h3>
                <Select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  options={[
                    { value: '7d', label: 'Last 7 days' },
                    { value: '30d', label: 'Last 30 days' },
                    { value: '90d', label: 'Last 90 days' },
                    { value: '1y', label: 'Last year' }
                  ]}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={dummyUserDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dummyUserDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  {dummyUserDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Activity Trends */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                Platform Activity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dummyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="assessments" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Assessments"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Alerts */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                System Alerts
              </h3>
              <div className="space-y-3">
                {dummySystemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full mt-4" 
                variant="outline" 
                size="sm"
                onClick={() => alert('View all system alerts')}
              >
                View All Alerts
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h3>
              <div className="space-y-3">
                <Button 
                  fullWidth 
                  variant="outline" 
                  size="sm" 
                  icon={UserCheck}
                  onClick={() => alert('Open user management interface')}
                >
                  Manage Users
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  size="sm" 
                  icon={Settings}
                  onClick={() => alert('Open system configuration')}
                >
                  System Config
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  size="sm" 
                  icon={FileText}
                  onClick={() => alert('Generate system reports')}
                >
                  Generate Reports
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  size="sm" 
                  icon={Database}
                  onClick={() => alert('Open database management tools')}
                >
                  Database Tools
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  size="sm" 
                  icon={Shield}
                  onClick={() => alert('Run security audit')}
                >
                  Security Audit
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-orange-600" />
              Pending Approvals ({dummyPendingApprovals.length})
            </h3>
            <div className="space-y-4">
              {dummyPendingApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{approval.type}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(approval.priority)}`}>
                        {approval.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{approval.user}</p>
                    <p className="text-xs text-gray-500">Submitted: {approval.submitted}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => alert(`Review ${approval.type} for ${approval.user}`)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => alert('View all pending approvals')}
            >
              View All Pending
            </Button>
          </Card>

          {/* Recent Users */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              Recent Users
            </h3>
            <div className="space-y-4">
              {dummyRecentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">Joined: {user.joined}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => alert('Open user management panel')}
            >
              Manage All Users
            </Button>
          </Card>
        </div>

        {/* System Performance Summary */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            System Performance Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-green-600">99.9%</p>
              <p className="text-gray-600">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">1.2s</p>
              <p className="text-gray-600">Avg Response Time</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">2.4TB</p>
              <p className="text-gray-600">Data Processed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600">0.01%</p>
              <p className="text-gray-600">Error Rate</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}