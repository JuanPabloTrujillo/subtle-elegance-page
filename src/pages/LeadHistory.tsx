
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Lead } from './Leads';

const LeadHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [leadActivities, setLeadActivities] = useState<Array<{
    id: number;
    leadName: string;
    leadId: number;
    action: string;
    date: string;
    user: string;
  }>>([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // Mock data for lead activities
    const mockActivities = [
      {
        id: 1,
        leadName: "Juan Pérez",
        leadId: 1,
        action: "Lead creado",
        date: "2023-05-10T10:30:00",
        user: "Admin"
      },
      {
        id: 2,
        leadName: "Juan Pérez",
        leadId: 1,
        action: "Etapa actualizada a 'Intentando contactar'",
        date: "2023-05-11T14:20:00",
        user: "Vendedor Uno"
      },
      {
        id: 3,
        leadName: "María González",
        leadId: 2,
        action: "Lead creado",
        date: "2023-05-12T09:15:00",
        user: "Admin"
      },
      {
        id: 4,
        leadName: "María González",
        leadId: 2,
        action: "Asignado a Vendedor Dos",
        date: "2023-05-12T11:45:00",
        user: "Admin"
      },
      {
        id: 5,
        leadName: "María González",
        leadId: 2,
        action: "Comentario añadido",
        date: "2023-05-13T16:30:00",
        user: "Vendedor Dos"
      },
      {
        id: 6,
        leadName: "María González",
        leadId: 2,
        action: "Etapa actualizada a 'Aceptado'",
        date: "2023-05-15T10:00:00",
        user: "Vendedor Dos"
      },
      {
        id: 7,
        leadName: "Carlos López",
        leadId: 3,
        action: "Lead creado",
        date: "2023-05-16T08:20:00",
        user: "Admin"
      },
      {
        id: 8,
        leadName: "Carlos López",
        leadId: 3,
        action: "Asignado a Vendedor Tres",
        date: "2023-05-16T09:00:00",
        user: "Admin"
      },
      {
        id: 9,
        leadName: "Carlos López",
        leadId: 3,
        action: "Etapa actualizada a 'Intentando contactar'",
        date: "2023-05-16T11:30:00",
        user: "Vendedor Tres"
      },
      {
        id: 10,
        leadName: "Carlos López",
        leadId: 3,
        action: "Etapa actualizada a 'Rechazado'",
        date: "2023-05-18T15:45:00",
        user: "Vendedor Tres"
      }
    ];

    setLeadActivities(mockActivities);
  }, [navigate]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es });
    } catch(e) {
      return 'Fecha desconocida';
    }
  };

  const filteredActivities = leadActivities.filter(activity => 
    activity.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/leads')}
                className="text-text-body hover:text-text-heading hover:bg-sage-50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-text-heading">Historial de Leads</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-text-heading flex items-center gap-2">
                <Clock className="h-5 w-5 text-sage-500" /> 
                Historial de Actividades
              </h2>
              <div className="w-full md:w-72">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar en el historial..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-sage-50 hover:bg-sage-50">
                    <TableHead>Fecha</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Usuario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                      <TableRow 
                        key={activity.id} 
                        className="hover:bg-sage-50 cursor-pointer"
                        onClick={() => navigate(`/leads?id=${activity.leadId}`)}
                      >
                        <TableCell>{formatDate(activity.date)}</TableCell>
                        <TableCell>
                          <div className="font-medium">{activity.leadName}</div>
                        </TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>{activity.user}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10">
                        {searchTerm ? 
                          'No se encontraron resultados que coincidan con la búsqueda' : 
                          'No hay actividades de leads disponibles'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadHistory;
