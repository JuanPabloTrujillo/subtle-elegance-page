
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import leadsData from '../data/leads.json';
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeadCard from '@/components/LeadCard';

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState(leadsData);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leads;
