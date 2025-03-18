
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import leadsData from '../data/leads.json';
import { Users, ArrowLeft, Clock, UserCheck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeadCard, { Lead } from '@/components/LeadCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(() => {
    // Convert imported leads data to include estado property
    return leadsData.map(lead => ({
      ...lead,
      estado: 'pendiente' as const
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
  };

  // Filter leads by status
  const pendingLeads = leads.filter(lead => lead.estado === 'pendiente');
  const assignedLeads = leads.filter(lead => lead.estado === 'asignado');
  const closedLeads = leads.filter(lead => lead.estado === 'cerrado');

  return (
    <div className="min-h-screen bg-sage-50">
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
              <h1 className="text-xl font-semibold text-text-heading">Leads Potenciales</h1>
            </div>
            <div className="flex items-center space-x-4">
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
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-text-heading flex items-center gap-2">
                <Users className="h-5 w-5 text-sage-500" /> 
                Gestión de Leads
              </h2>
            </div>
            
            <Tabs defaultValue="pendientes" className="w-full">
              <TabsList className="w-full bg-white shadow-sm mb-6 rounded-lg p-1 border border-sage-100">
                <TabsTrigger 
                  value="pendientes" 
                  className="flex items-center gap-2 w-1/3 data-[state=active]:bg-sage-100"
                >
                  <Clock className="h-4 w-4" /> 
                  Pendientes ({pendingLeads.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="asignados" 
                  className="flex items-center gap-2 w-1/3 data-[state=active]:bg-sage-100"
                >
                  <UserCheck className="h-4 w-4" /> 
                  Asignados ({assignedLeads.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="cerrados" 
                  className="flex items-center gap-2 w-1/3 data-[state=active]:bg-sage-100"
                >
                  <CheckCircle className="h-4 w-4" /> 
                  Cerrados ({closedLeads.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pendientes">
                {pendingLeads.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} onLeadUpdate={handleLeadUpdate} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <Clock className="h-12 w-12 text-sage-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-text-heading">No hay leads pendientes</h3>
                    <p className="text-text-body mt-1">Todos los leads han sido asignados o cerrados</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="asignados">
                {assignedLeads.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assignedLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} onLeadUpdate={handleLeadUpdate} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <UserCheck className="h-12 w-12 text-sage-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-text-heading">No hay leads asignados</h3>
                    <p className="text-text-body mt-1">No hay leads asignados actualmente</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="cerrados">
                {closedLeads.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {closedLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} onLeadUpdate={handleLeadUpdate} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <CheckCircle className="h-12 w-12 text-sage-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-text-heading">No hay leads cerrados</h3>
                    <p className="text-text-body mt-1">No se ha cerrado ningún lead todavía</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leads;
