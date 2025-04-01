
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  FileCheck, 
  AlertTriangle, 
  Search, 
  Users, 
  RotateCw,
  PlusCircle,
  Clock,
  Check,
  X,
  ExternalLink,
  Filter,
  Bell
} from "lucide-react";

const policyData = {
  expiringPolicies: [
    { id: 'POL-1234', client: 'María González', type: 'Auto', expiry: '2023-08-15', premium: 4500, status: 'pendiente' },
    { id: 'POL-1235', client: 'Juan Pérez', type: 'Hogar', expiry: '2023-08-16', premium: 3200, status: 'contactado' },
    { id: 'POL-1236', client: 'Ana López', type: 'Vida', expiry: '2023-08-18', premium: 5800, status: 'pendiente' },
    { id: 'POL-1237', client: 'Roberto Sánchez', type: 'Auto', expiry: '2023-08-22', premium: 4200, status: 'contactado' },
    { id: 'POL-1238', client: 'Carla Ramírez', type: 'Salud', expiry: '2023-08-24', premium: 6500, status: 'renovado' }
  ],
  renewalStats: {
    totalRenewals: 32,
    completed: 18,
    inProgress: 10,
    pending: 4
  },
  alerts: [
    { id: 1, message: '5 pólizas vencen esta semana', type: 'warning', time: '2 horas' },
    { id: 2, message: 'Recordatorio: 3 clientes pendientes de contactar', type: 'info', time: '5 horas' },
    { id: 3, message: 'Póliza POL-1234 requiere atención inmediata', type: 'error', time: '1 día' },
    { id: 4, message: '2 renovaciones completadas exitosamente', type: 'success', time: '1 día' }
  ]
};

const PolicyManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value);
  };

  const filteredPolicies = policyData.expiringPolicies.filter(policy => 
    policy.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
    policy.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'renovado': return 'bg-green-100 text-green-800';
      case 'contactado': return 'bg-blue-100 text-blue-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'renovado': return 'Renovado';
      case 'contactado': return 'Contactado';
      case 'pendiente': return 'Pendiente';
      default: return status;
    }
  };

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Bell className="h-5 w-5 text-blue-500" />;
      case 'error': return <X className="h-5 w-5 text-red-500" />;
      case 'success': return <Check className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertBackground = (type: string) => {
    switch(type) {
      case 'warning': return 'bg-yellow-50 border-yellow-100';
      case 'info': return 'bg-blue-50 border-blue-100';
      case 'error': return 'bg-red-50 border-red-100';
      case 'success': return 'bg-green-50 border-green-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-text-heading flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-sage-500" /> 
          Gestión de Pólizas
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600"
          >
            <PlusCircle className="h-4 w-4" /> Nueva Póliza
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" /> Ver Todas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-5 w-5 text-sage-500" />
                Pólizas Próximas a Vencer
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-9 px-2">
                  <Filter className="h-4 w-4 text-text-body" />
                </Button>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-body" />
                  <Input
                    type="text"
                    placeholder="Buscar póliza..."
                    className="w-full pl-9 h-9 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <CardDescription>Pólizas que vencerán en los próximos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-medium text-text-body">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-text-body">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-text-body">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-text-body">Vencimiento</th>
                    <th className="text-left py-3 px-4 font-medium text-text-body">Prima</th>
                    <th className="text-left py-3 px-4 font-medium text-text-body">Estado</th>
                    <th className="text-right py-3 px-4 font-medium text-text-body">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPolicies.length > 0 ? (
                    filteredPolicies.map((policy, index) => (
                      <tr key={policy.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="py-3 px-4 font-medium">{policy.id}</td>
                        <td className="py-3 px-4">{policy.client}</td>
                        <td className="py-3 px-4">{policy.type}</td>
                        <td className="py-3 px-4">{formatDate(policy.expiry)}</td>
                        <td className="py-3 px-4">{formatCurrency(policy.premium)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                            {getStatusText(policy.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <RotateCw className="h-4 w-4 text-sage-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Users className="h-4 w-4 text-blue-500" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-text-body">
                        No se encontraron pólizas que coincidan con la búsqueda
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="text-sm text-text-body">Mostrando {filteredPolicies.length} de {policyData.expiringPolicies.length} pólizas</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled>
                Siguiente
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-sage-500" />
              Alertas Recientes
            </CardTitle>
            <CardDescription>Notificaciones y recordatorios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policyData.alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border flex items-start gap-3 ${getAlertBackground(alert.type)}`}
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-heading">{alert.message}</p>
                    <p className="text-xs text-text-body">Hace {alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <RotateCw className="h-5 w-5 text-sage-500" />
            Estado de Renovaciones
          </CardTitle>
          <CardDescription>Progreso de renovaciones del mes actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-text-body">Total</h3>
                <span className="text-xs text-text-body">100%</span>
              </div>
              <p className="text-2xl font-semibold text-text-heading">{policyData.renewalStats.totalRenewals}</p>
              <Progress value={100} className="h-1.5 mt-2" />
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-green-700">Completadas</h3>
                <span className="text-xs text-green-700">{Math.round((policyData.renewalStats.completed / policyData.renewalStats.totalRenewals) * 100)}%</span>
              </div>
              <p className="text-2xl font-semibold text-green-800">{policyData.renewalStats.completed}</p>
              <Progress value={(policyData.renewalStats.completed / policyData.renewalStats.totalRenewals) * 100} className="h-1.5 mt-2 bg-green-200">
                <div className="h-full bg-green-500" style={{ width: `${(policyData.renewalStats.completed / policyData.renewalStats.totalRenewals) * 100}%` }} />
              </Progress>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blue-700">En Proceso</h3>
                <span className="text-xs text-blue-700">{Math.round((policyData.renewalStats.inProgress / policyData.renewalStats.totalRenewals) * 100)}%</span>
              </div>
              <p className="text-2xl font-semibold text-blue-800">{policyData.renewalStats.inProgress}</p>
              <Progress value={(policyData.renewalStats.inProgress / policyData.renewalStats.totalRenewals) * 100} className="h-1.5 mt-2 bg-blue-200">
                <div className="h-full bg-blue-500" style={{ width: `${(policyData.renewalStats.inProgress / policyData.renewalStats.totalRenewals) * 100}%` }} />
              </Progress>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-yellow-700">Pendientes</h3>
                <span className="text-xs text-yellow-700">{Math.round((policyData.renewalStats.pending / policyData.renewalStats.totalRenewals) * 100)}%</span>
              </div>
              <p className="text-2xl font-semibold text-yellow-800">{policyData.renewalStats.pending}</p>
              <Progress value={(policyData.renewalStats.pending / policyData.renewalStats.totalRenewals) * 100} className="h-1.5 mt-2 bg-yellow-200">
                <div className="h-full bg-yellow-500" style={{ width: `${(policyData.renewalStats.pending / policyData.renewalStats.totalRenewals) * 100}%` }} />
              </Progress>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyManagement;
