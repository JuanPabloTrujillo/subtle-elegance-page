
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import leadsData from '../data/leads.json';
import { Users, ArrowLeft, Clock, PhoneCall, CheckCircle, XCircle, Plus, History, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadTable from '@/components/LeadTable';
import CreateLeadDialog from '@/components/CreateLeadDialog';
import { useToast } from "@/hooks/use-toast";

export interface Lead {
  id: number;
  nombre: string;
  telefono: string;
  producto: string;
  empresa?: string;
  estado: 'nuevo' | 'contactando' | 'aceptado' | 'rechazado';
  vendedor?: string;
  comentarios?: Array<{id: number, texto: string, fecha: string, autor: string}>;
  ultimaActividad?: string;
  fechaCreacion: string;
}

const Leads = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Convert imported leads data and add required properties
  const [leads, setLeads] = useState<Lead[]>(() => {
    return leadsData.map((lead, index) => ({
      ...lead,
      estado: 'nuevo' as const,
      comentarios: [],
      fechaCreacion: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      ultimaActividad: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString()
    }));
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );
    
    toast({
      title: "Lead actualizado",
      description: `${updatedLead.nombre} ha sido actualizado correctamente.`,
    });
  };

  const handleCreateLead = (newLead: Omit<Lead, 'id' | 'comentarios' | 'fechaCreacion'>) => {
    const id = Math.max(0, ...leads.map(lead => lead.id)) + 1;
    const createdLead: Lead = {
      ...newLead,
      id,
      comentarios: [],
      fechaCreacion: new Date().toISOString(),
      ultimaActividad: new Date().toISOString()
    };
    
    setLeads(prev => [...prev, createdLead]);
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Lead creado",
      description: `${newLead.nombre} ha sido añadido como nuevo lead.`,
    });
  };

  // Filter leads by status
  const newLeads = leads.filter(lead => lead.estado === 'nuevo');
  const contactingLeads = leads.filter(lead => lead.estado === 'contactando');
  const acceptedLeads = leads.filter(lead => lead.estado === 'aceptado');
  const rejectedLeads = leads.filter(lead => lead.estado === 'rechazado');

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/dashboard')}
                className="text-text-body hover:text-text-heading hover:bg-sage-50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-text-heading">Gestión de Leads</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
              >
                <Plus className="h-4 w-4" />
                Crear Lead
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-text-heading flex items-center gap-2">
                <Users className="h-5 w-5 text-sage-500" /> 
                Leads ({leads.length})
              </h2>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="gap-2 text-text-body"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 text-text-body"
                  onClick={() => navigate('/leads/history')}
                >
                  <History className="h-4 w-4" />
                  Historial
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 text-orange-500 mb-2">
                  <Clock className="h-5 w-5" />
                  <h3 className="font-semibold">Nuevos leads ({newLeads.length})</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">Leads que necesitan seguimiento inicial</p>
                <Button 
                  variant="outline" 
                  className="w-full text-orange-500 border-orange-200 hover:bg-orange-50"
                >
                  Llegar a nuevos leads
                </Button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <PhoneCall className="h-5 w-5" />
                  <h3 className="font-semibold">Intentando contactar ({contactingLeads.length})</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">Leads en proceso de contacto</p>
                <Button 
                  variant="outline" 
                  className="w-full text-blue-500 border-blue-200 hover:bg-blue-50"
                >
                  Hacer seguimiento de leads
                </Button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 text-green-500 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <h3 className="font-semibold">Aceptados ({acceptedLeads.length})</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">Leads que han aceptado la propuesta</p>
                <Button 
                  variant="outline" 
                  className="w-full text-green-500 border-green-200 hover:bg-green-50"
                >
                  Hacer seguimiento de leads
                </Button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <XCircle className="h-5 w-5" />
                  <h3 className="font-semibold">Rechazados ({rejectedLeads.length})</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">Leads que han rechazado la propuesta</p>
                <Button 
                  variant="outline" 
                  className="w-full text-red-500 border-red-200 hover:bg-red-50"
                >
                  Hacer seguimiento de leads
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="todos" className="w-full">
              <TabsList className="w-full bg-white shadow-sm mb-6 rounded-lg p-1 border border-sage-100">
                <TabsTrigger 
                  value="todos" 
                  className="flex items-center gap-2 w-1/5 data-[state=active]:bg-sage-100"
                >
                  <Users className="h-4 w-4" /> 
                  Todos ({leads.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="nuevos" 
                  className="flex items-center gap-2 w-1/5 data-[state=active]:bg-sage-100"
                >
                  <Clock className="h-4 w-4 text-orange-500" /> 
                  Nuevos ({newLeads.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="contactando" 
                  className="flex items-center gap-2 w-1/5 data-[state=active]:bg-sage-100"
                >
                  <PhoneCall className="h-4 w-4 text-blue-500" /> 
                  Contactando ({contactingLeads.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="aceptados" 
                  className="flex items-center gap-2 w-1/5 data-[state=active]:bg-sage-100"
                >
                  <CheckCircle className="h-4 w-4 text-green-500" /> 
                  Aceptados ({acceptedLeads.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="rechazados" 
                  className="flex items-center gap-2 w-1/5 data-[state=active]:bg-sage-100"
                >
                  <XCircle className="h-4 w-4 text-red-500" /> 
                  Rechazados ({rejectedLeads.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="todos">
                <LeadTable leads={leads} onLeadUpdate={handleLeadUpdate} />
              </TabsContent>
              
              <TabsContent value="nuevos">
                <LeadTable leads={newLeads} onLeadUpdate={handleLeadUpdate} />
              </TabsContent>
              
              <TabsContent value="contactando">
                <LeadTable leads={contactingLeads} onLeadUpdate={handleLeadUpdate} />
              </TabsContent>
              
              <TabsContent value="aceptados">
                <LeadTable leads={acceptedLeads} onLeadUpdate={handleLeadUpdate} />
              </TabsContent>
              
              <TabsContent value="rechazados">
                <LeadTable leads={rejectedLeads} onLeadUpdate={handleLeadUpdate} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <CreateLeadDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateLead={handleCreateLead}
      />
    </div>
  );
};

export default Leads;
