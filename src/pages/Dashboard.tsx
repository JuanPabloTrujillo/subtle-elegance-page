
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
import mockData from '../data/mock-data.json';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const combinedSportsData = mockData.analytics.sportStats.football.map((item, index) => ({
    month: item.month,
    "Football Bookings": item.bookings,
    "Volleyball Bookings": mockData.analytics.sportStats.volleyball[index].bookings,
    "Football Revenue": item.revenue,
    "Volleyball Revenue": mockData.analytics.sportStats.volleyball[index].revenue
  }));

  return (
    <div className="min-h-screen bg-sage-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-text-heading">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/calendario')}
                className="text-text-body hover:text-text-heading px-4 py-2 rounded-lg hover:bg-sage-50 transition-colors"
              >
                Calendario
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="text-text-body hover:text-text-heading"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            {Object.entries(mockData.analytics.userStats).map(([key, value]) => (
              <div key={key} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-text-body truncate capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-text-heading">
                    {value.toLocaleString()}
                  </dd>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-text-heading mb-4">Monthly Revenue</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData.analytics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#059669"
                    fill="#059669"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sports Bookings Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-text-heading mb-4">Sports Bookings</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={combinedSportsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Football Bookings" fill="#059669" />
                    <Bar dataKey="Volleyball Bookings" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-text-heading mb-4">Sports Revenue</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedSportsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Football Revenue" stroke="#059669" />
                    <Line type="monotone" dataKey="Volleyball Revenue" stroke="#3B82F6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-text-heading mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {mockData.analytics.performanceMetrics.map((metric) => (
                <div key={metric.name} className="bg-sage-50 rounded-lg p-4">
                  <p className="text-sm text-text-body">{metric.name}</p>
                  <p className="text-2xl font-semibold text-text-heading mt-1">
                    {metric.value}%
                  </p>
                  <div className="w-full bg-sage-100 rounded-full h-2 mt-2">
                    <div
                      className="bg-sage-500 h-2 rounded-full"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
