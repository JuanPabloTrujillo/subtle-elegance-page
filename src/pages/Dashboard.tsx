import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
import mockData from '../data/mock-data.json';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";

interface StoredFile {
  id: string;
  name: string;
  size: string;
  date: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
    const savedFiles = localStorage.getItem('storedPDFs');
    if (savedFiles) {
      setStoredFiles(JSON.parse(savedFiles));
    }
  }, [navigate]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Solo se permiten archivos PDF",
      });
      return;
    }

    const newFile: StoredFile = {
      id: Date.now().toString(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      date: new Date().toLocaleDateString()
    };

    const updatedFiles = [...storedFiles, newFile];
    setStoredFiles(updatedFiles);
    localStorage.setItem('storedPDFs', JSON.stringify(updatedFiles));

    toast({
      title: "Archivo subido",
      description: "El PDF se ha guardado correctamente",
    });
  };

  const deleteFile = (id: string) => {
    const updatedFiles = storedFiles.filter(file => file.id !== id);
    setStoredFiles(updatedFiles);
    localStorage.setItem('storedPDFs', JSON.stringify(updatedFiles));

    toast({
      title: "Archivo eliminado",
      description: "El PDF se ha eliminado correctamente",
    });
  };

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
          {/* PDF Upload Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-text-heading mb-4">Documentos PDF</h2>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-sage-100 rounded-lg p-6 mb-4">
              <FileText className="h-12 w-12 text-sage-500 mb-2" />
              <p className="text-text-body mb-4">Arrastra y suelta tus archivos PDF aquí o</p>
              <label htmlFor="file-upload">
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="default" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" /> Seleccionar archivo
                </Button>
              </label>
            </div>

            {/* PDF List */}
            <div className="space-y-2">
              {storedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-sage-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-sage-500" />
                    <div>
                      <p className="text-sm font-medium text-text-heading">{file.name}</p>
                      <p className="text-xs text-text-body">
                        {file.size} • Subido el {file.date}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-text-body" />
                  </button>
                </div>
              ))}
            </div>
          </div>

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
