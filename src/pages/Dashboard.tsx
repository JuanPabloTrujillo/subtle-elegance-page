
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  Clock, 
  UserCheck,
  Wallet,
  FileCheck,
  ChartBar,
  Layout,
  Home
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import SalesStatistics from '@/components/SalesStatistics';
import FinancialReports from '@/components/FinancialReports';
import PolicyManagement from '@/components/PolicyManagement';
import DashboardOverview from '@/components/DashboardOverview';

// Import lead data
import leadsData from '../data/leads.json';

interface StoredFile {
  id: string;
  name: string;
  size: string;
  date: string;
}

// Define the Lead interface to fix TypeScript errors
interface Lead {
  id: number;
  nombre: string;
  telefono: string;
  producto: string;
  estado?: string; // Make estado optional since it might not exist in all records
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');

  // Type cast leadsData to match the Lead interface
  const typedLeadsData = leadsData as Lead[];

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
            <div className="flex flex-col md:flex-row p-6">
              <div className="flex-1">
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
              
              <div className="md:w-1/3 flex flex-col items-center justify-center mt-6 md:mt-0 md:ml-4">
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
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList className="grid sm:grid-cols-4 grid-cols-2 w-full max-w-2xl gap-2">
                  <TabsTrigger value="overview" className="flex items-center gap-2 py-2.5">
                    <Layout className="h-4 w-4" />
                    <span className="sm:block hidden">Vista General</span>
                  </TabsTrigger>
                  <TabsTrigger value="sales" className="flex items-center gap-2 py-2.5">
                    <ChartBar className="h-4 w-4" />
                    <span className="sm:block hidden">Ventas y Leads</span>
                  </TabsTrigger>
                  <TabsTrigger value="finances" className="flex items-center gap-2 py-2.5">
                    <Wallet className="h-4 w-4" />
                    <span className="sm:block hidden">Finanzas</span>
                  </TabsTrigger>
                  <TabsTrigger value="policies" className="flex items-center gap-2 py-2.5">
                    <FileCheck className="h-4 w-4" />
                    <span className="sm:block hidden">Gestión de Pólizas</span>
                  </TabsTrigger>
                </TabsList>

                <div className="hidden md:flex gap-2">
                  <Button 
                    onClick={() => navigate('/leads')}
                    className="bg-sage-500 hover:bg-sage-600 text-white"
                  >
                    Ver Leads
                  </Button>
                  <Button 
                    onClick={() => navigate('/client')}
                    variant="outline"
                  >
                    Ver Clientes
                  </Button>
                </div>
              </div>

              <TabsContent value="overview" className="mt-2 animate-fade-in">
                <DashboardOverview setActiveTab={setActiveTab} />
              </TabsContent>
              
              <TabsContent value="sales" className="mt-2">
                <SalesStatistics />
              </TabsContent>
              
              <TabsContent value="finances" className="mt-2">
                <FinancialReports />
              </TabsContent>
              
              <TabsContent value="policies" className="mt-2">
                <PolicyManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
