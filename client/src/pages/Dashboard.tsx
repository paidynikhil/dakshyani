import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Package, MessageSquare, ShoppingBag } from 'lucide-react';
import { dashboardStats, salesData, userEngagementData, productPopularityData } from '../data/mockData';

const Dashboard: React.FC = () => {
  const COLORS = ['#800000', '#B91C1C', '#DC2626', '#EF4444'];

  const StatCard = ({ icon: Icon, title, value, color, trend }: {
    icon: any;
    title: string;
    value: string | number;
    color: string;
    trend?: string;
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          title="Total Products"
          value={dashboardStats.totalProducts}
          color="bg-maroon-600"
          trend="+12% from last month"
        />
        <StatCard
          icon={ShoppingBag}
          title="Total Orders"
          value={dashboardStats.totalOrders}
          color="bg-blue-600"
          trend="+8% from last month"
        />
        <StatCard
          icon={Users}
          title="Active Users"
          value={dashboardStats.activeUsers}
          color="bg-green-600"
          trend="+15% from last month"
        />
        <StatCard
          icon={MessageSquare}
          title="Reviews"
          value={dashboardStats.totalReviews}
          color="bg-purple-600"
          trend="+5% from last month"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Line type="monotone" dataKey="sales" stroke="#800000" strokeWidth={3} dot={{ fill: '#800000', strokeWidth: 2, r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Engagement */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userEngagementData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userEngagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Product Popularity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Popularity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productPopularityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="count" fill="#800000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New order received', item: 'Premium Banarasi Silk Saree', time: '2 hours ago', type: 'order' },
            { action: 'Product added', item: 'Designer Cotton Saree', time: '4 hours ago', type: 'product' },
            { action: 'Review submitted', item: 'Bridal Red Lehenga', time: '6 hours ago', type: 'review' },
            { action: 'New user registered', item: 'Priya Sharma', time: '1 day ago', type: 'user' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'order' ? 'bg-green-100' :
                  activity.type === 'product' ? 'bg-blue-100' :
                  activity.type === 'review' ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  {activity.type === 'order' && <ShoppingBag size={16} className="text-green-600" />}
                  {activity.type === 'product' && <Package size={16} className="text-blue-600" />}
                  {activity.type === 'review' && <MessageSquare size={16} className="text-purple-600" />}
                  {activity.type === 'user' && <Users size={16} className="text-orange-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.item}</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;