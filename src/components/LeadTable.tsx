
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, User, MoreHorizontal, PhoneCall, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LeadDetailDialog from './LeadDetailDialog';
import { Lead } from '@/pages/Leads';

interface LeadTableProps {
  leads: Lead[];
  onLeadUpdate: (updatedLead: Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onLeadUpdate }) => {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [openDetailId, setOpenDetailId] = useState<number | null>(null);

  const handleSelectLead = (id: number) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? 
      prev.filter(leadId => leadId !== id) : 
      [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  const getStatusIcon = (status: Lead['estado']) => {
    switch(status) {
      case 'nuevo': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'contactando': return <PhoneCall className="h-4 w-4 text-blue-500" />;
      case 'aceptado': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rechazado': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusText = (status: Lead['estado']) => {
    switch(status) {
      case 'nuevo': return 'Nuevo';
      case 'contactando': return 'Contactando';
      case 'aceptado': return 'Aceptado';
      case 'rechazado': return 'Rechazado';
      default: return 'Nuevo';
    }
  };

  const getStatusClass = (status: Lead['estado']) => {
    switch(status) {
      case 'nuevo': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'contactando': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'aceptado': return 'bg-green-50 text-green-700 border-green-200';
      case 'rechazado': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch(e) {
      return 'Fecha desconocida';
    }
  };

  const selectedLead = openDetailId !== null 
    ? leads.find(lead => lead.id === openDetailId) 
    : null;

  return (
    <>
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-card animate-fade-in bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-sage-50 to-white hover:bg-sage-50/80">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedLeads.length === leads.length && leads.length > 0} 
                  onCheckedChange={handleSelectAll}
                  className="rounded-sm"
                />
              </TableHead>
              <TableHead className="font-semibold text-gray-800">Lead</TableHead>
              <TableHead className="font-semibold text-gray-800">Empresa</TableHead>
              <TableHead className="font-semibold text-gray-800">Etapa</TableHead>
              <TableHead className="font-semibold text-gray-800">Última Actividad</TableHead>
              <TableHead className="font-semibold text-gray-800">Vendedor</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow 
                  key={lead.id} 
                  className="hover:bg-sage-50/40 transition-colors duration-150 cursor-pointer border-b border-gray-100" 
                  onClick={() => setOpenDetailId(lead.id)}
                >
                  <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedLeads.includes(lead.id)} 
                      onCheckedChange={() => handleSelectLead(lead.id)}
                      className="rounded-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-text-heading">{lead.nombre}</div>
                    <div className="text-sm text-muted-foreground">{lead.telefono}</div>
                  </TableCell>
                  <TableCell>{lead.empresa || '-'}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusClass(lead.estado)}`}>
                      {getStatusIcon(lead.estado)}
                      {getStatusText(lead.estado)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatDate(lead.ultimaActividad || lead.fechaCreacion)}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                      {lead.comentarios && lead.comentarios.length > 0 
                        ? <MessageSquare className="h-3 w-3" /> 
                        : null
                      }
                      {lead.comentarios && lead.comentarios.length > 0 
                        ? `${lead.comentarios.length} comentario${lead.comentarios.length !== 1 ? 's' : ''}` 
                        : 'Sin comentarios'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.vendedor ? (
                      <div className="flex items-center gap-2">
                        <div className="bg-sage-50 p-1.5 rounded-full">
                          <User className="h-3.5 w-3.5 text-sage-500" />
                        </div>
                        <span className="font-medium">{lead.vendedor}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No asignado</span>
                    )}
                  </TableCell>
                  <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-lg shadow-lg border border-gray-100">
                        <DropdownMenuItem 
                          onClick={() => setOpenDetailId(lead.id)}
                          className="cursor-pointer hover:bg-sage-50 focus:bg-sage-50 transition-colors duration-150"
                        >
                          Ver detalles
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-gray-500">
                  No hay leads disponibles en esta categoría
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedLead && (
        <LeadDetailDialog
          lead={selectedLead}
          open={openDetailId !== null}
          onOpenChange={(open) => {
            if (!open) setOpenDetailId(null);
          }}
          onLeadUpdate={onLeadUpdate}
        />
      )}
    </>
  );
};

export default LeadTable;
