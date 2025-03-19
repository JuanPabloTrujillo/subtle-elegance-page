import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import insuranceData from '../data/insurance-data.json';
import leadsData from '../data/leads.json';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Clipboard, Activity, BarChart2, Users, UserCheck, Trophy, ExternalLink, UserPlus, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StoredFile {
  id: string;
  name: string;
  size: string;
  date: string;
}

interface SalespersonMetric {
  name: string;
  assignedLeads: number;
  closedDeals: number;
  revenue: number;
  conversionRate: number;
}

// Define the Lead interface to fix TypeScript errors
interface Lead {
  id: number;
  nombre: string;
  telefono: string;
  producto: string;
  estado?: string; // Make estado optional since it might not exist in all records
}

const COLORS = ['#059669', '#3B82F6', '#F97316', '#EC4899'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);
  const [userName, setUserName] = useState<string>('');

  // Type cast leadsData to match the Lead interface
  const typedLeadsData = leadsData as Lead[];

  const salesMetrics: SalespersonMetric[] = [
    { 
      name: "Vendedor Uno", 
      assignedLeads: 42, 
      closedDeals: 28, 
      revenue: 580000, 
      conversionRate: 67 
    },
    { 
      name: "Vendedor Dos", 
      assignedLeads: 31, 
      closedDeals: 17, 
      revenue: 420000, 
      conversionRate: 55 
    },
    { 
      name: "Vendedor Tres", 
      assignedLeads: 38, 
      closedDeals: 22, 
      revenue: 510000, 
      conversionRate: 58 
    }
  ];

  const assignedLeadCounts = typedLeadsData.reduce((counts, lead) => {
    const randomSalesperson = `Vendedor ${Math.floor(Math.random() * 3) + 1}`;
    counts[randomSalesperson] = (counts[randomSalesperson] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const assignedLeadsData = Object.entries(assignedLeadCounts).map(([name, count]) => ({
    name,
    value: count
  }));

  const salesPerformanceData = salesMetrics.map(metric => ({
    name: metric.name,
    leads: metric.assignedLeads,
    deals: metric.closedDeals
  }));

  // Fix TypeScript errors by properly checking for estado property
  const pendingLeadsCount = typedLeadsData.filter(lead => !lead.estado || lead.estado === 'pendiente').length;
  const assignedLeadsCount = typedLeadsData.filter(lead => lead.estado === 'asignado').length;
  const closedLeadsCount = typedLeadsData.filter(lead => lead.estado === 'cerrado').length;
  const totalLeadsCount = typedLeadsData.length;

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    } else {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.email || 'Usuario');
      } catch (e) {
        setUserName('Usuario');
      }
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-sage-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-text-heading">Dashboard de Seguros</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/client')}
                className="text-text-body hover:text-text-heading px-4 py-2 rounded-lg hover:bg-sage-50 transition-colors"
              >
                Clientes
              </button>
              <button
                onClick={() => navigate('/leads')}
                className="text-text-body hover:text-text-heading px-4 py-2 rounded-lg hover:bg-sage-50 transition-colors"
              >
                Leads
              </button>
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
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 flex-1">
                <h2 className="text-2xl font-bold text-text-heading mb-2">¡Bienvenido de nuevo, {userName}!</h2>
                <p className="text-text-body mb-6">Aquí está el resumen de tus leads de seguros para hoy.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-yellow-600 font-medium">Leads Pendientes</p>
                        <p className="text-3xl font-bold text-yellow-700">{pendingLeadsCount}</p>
                        <p className="text-xs text-yellow-600">{Math.round((pendingLeadsCount / totalLeadsCount) * 100)}% del total</p>
                      </div>
                      <Clock className="h-10 w-10 text-yellow-500" />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Leads Asignados</p>
                        <p className="text-3xl font-bold text-blue-700">{assignedLeadsCount}</p>
                        <p className="text-xs text-blue-600">{Math.round((assignedLeadsCount / totalLeadsCount) * 100)}% del total</p>
                      </div>
                      <UserCheck className="h-10 w-10 text-blue-500" />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Leads Cerrados</p>
                        <p className="text-3xl font-bold text-green-700">{closedLeadsCount}</p>
                        <p className="text-xs text-green-600">{Math.round((closedLeadsCount / totalLeadsCount) * 100)}% del total</p>
                      </div>
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="bg-sage-50 p-6 md:w-1/3 flex flex-col items-center justify-center">
                <img 
                  src="https://segurosgsc.com/wp-content/uploads/2020/03/logogsc_transparencia3.png" 
                  alt="Seguros GSC Logo" 
                  className="max-w-full max-h-36 object-contain"
                />
                <p className="text-sage-500 font-medium text-center mt-2">Su aliado en protección</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-text-heading flex items-center gap-2">
                <Users className="h-5 w-5 text-sage-500" /> 
                Leads Potenciales
              </h2>
              <Button 
                onClick={() => navigate('/leads')}
                className="bg-sage-500 hover:bg-sage-600 text-white flex items-center gap-2"
              >
                Ver todos los leads <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-text-heading flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-sage-500" /> 
                Clientes
              </h2>
              <Button 
                onClick={() => navigate('/client')}
                className="bg-sage-500 hover:bg-sage-600 text-white flex items-center gap-2"
              >
                Registrar cliente <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-text-heading mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-sage-500" />
                Desempeño de Vendedores
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="leads" name="Leads Asignados" fill="#059669" />
                    <Bar dataKey="deals" name="Ventas Cerradas" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-text-heading mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-sage-500" />
                Distribución de Leads por Vendedor
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assignedLeadsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {assignedLeadsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} leads`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-text-heading mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-sage-500" />
              Métricas de Vendedores
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-sage-50">
                  <tr>
                    <th className="px-6 py-3 rounded-l-lg">Vendedor</th>
                    <th className="px-6 py-3">Leads Asignados</th>
                    <th className="px-6 py-3">Ventas Cerradas</th>
                    <th className="px-6 py-3">Ingresos</th>
                    <th className="px-6 py-3 rounded-r-lg">Conversión</th>
                  </tr>
                </thead>
                <tbody>
                  {salesMetrics.map((metric, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-sage-50/30'}>
                      <td className="px-6 py-4 font-medium">{metric.name}</td>
                      <td className="px-6 py-4">{metric.assignedLeads}</td>
                      <td className="px-6 py-4">{metric.closedDeals}</td>
                      <td className="px-6 py-4">{formatCurrency(metric.revenue)}</td>
                      <td className="px-6 py-4">{metric.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            {Object.entries(insuranceData.companyStats).map(([key, value]) => (
              <div key={key} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-text-body truncate capitalize">
                    {key === 'totalPolicies' ? 'Pólizas Totales' : 
                     key === 'activePolicies' ? 'Pólizas Activas' : 
                     'Pólizas Nuevas'}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-text-heading">
                    {value.toLocaleString()}
                  </dd>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-text-heading mb-4">Documentos de Pólizas</h2>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-sage-100 rounded-lg p-6 mb-4">
              <FileText className="h-12 w-12 text-sage-500 mb-2" />
              <p className="text-text-body mb-4">Arrastra y suelta archivos de pólizas en PDF aquí o</p>
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

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-text-heading mb-4">Ingresos Mensuales</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={insuranceData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value/1000)}k`} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Ingresos']} />
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-text-heading mb-4">Gestión de Reclamaciones</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={insuranceData.claimsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="submitted" name="Presentadas" fill="#059669" />
                    <Bar dataKey="approved" name="Aprobadas" fill="#3B82F6" />
                    <Bar dataKey="rejected" name="Rechazadas" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-text-heading mb-4">Distribución de Pólizas</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={insuranceData.policyTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {insuranceData.policyTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} pólizas`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-text-heading mb-4">Segmentos de Clientes</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={insuranceData.customerSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {insuranceData.customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-text-heading mb-4">Prima por Tipo de Póliza</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={insuranceData.policyTypes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Prima Total']} />
                    <Bar dataKey="premium" name="Prima Total" fill="#059669" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-text-heading mb-4">Métricas de Rendimiento</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {insuranceData.performanceMetrics.map((metric) => (
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
