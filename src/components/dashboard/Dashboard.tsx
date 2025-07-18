import React from 'react';
import { BarChart3, TrendingUp, Users, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Enterprises',
      value: '12,456',
      change: '+12%',
      trend: 'up',
      icon: <Users className="h-8 w-8 text-blue-600" />
    },
    {
      title: 'Completed Surveys',
      value: '8,945',
      change: '+8%',
      trend: 'up',
      icon: <CheckCircle className="h-8 w-8 text-green-600" />
    },
    {
      title: 'Pending Surveys',
      value: '2,341',
      change: '-5%',
      trend: 'down',
      icon: <AlertCircle className="h-8 w-8 text-yellow-600" />
    },
    {
      title: 'Frames Uploaded',
      value: '156',
      change: '+3%',
      trend: 'up',
      icon: <FileText className="h-8 w-8 text-purple-600" />
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Frame uploaded', user: 'Admin User', time: '2 hours ago', type: 'upload' },
    { id: 2, action: 'Survey completed', user: 'Enterprise ABC', time: '4 hours ago', type: 'survey' },
    { id: 3, action: 'Notice generated', user: 'RO User', time: '6 hours ago', type: 'notice' },
    { id: 4, action: 'Frame allocated', user: 'CPG User', time: '1 day ago', type: 'allocation' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Survey Progress Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Survey Progress</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Manufacturing</span>
              <span className="text-sm font-medium text-gray-900">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Services</span>
              <span className="text-sm font-medium text-gray-900">72%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Construction</span>
              <span className="text-sm font-medium text-gray-900">64%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '64%' }}></div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'upload' ? 'bg-blue-500' :
                  activity.type === 'survey' ? 'bg-green-500' :
                  activity.type === 'notice' ? 'bg-purple-500' :
                  'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Upload Frame</span>
            </div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-green-900">Allocate Frame</span>
            </div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Generate Report</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;