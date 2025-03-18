
import React, { useState } from 'react';
import { User, Phone, Package, CheckCircle, UserCheck, Clock, Check } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export interface Lead {
  id: number;
  nombre: string;
  telefono: string;
  producto: string;
  estado: 'pendiente' | 'asignado' | 'cerrado';
  vendedor?: string;
}

interface LeadCardProps {
  lead: Lead;
  onLeadUpdate: (updatedLead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onLeadUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string | undefined>(lead.vendedor);
  const [closeLead, setCloseLead] = useState(lead.estado === 'cerrado');
  const { toast } = useToast();

  const handleAssign = () => {
    if (assignedTo) {
      const updatedLead: Lead = {
        ...lead,
        vendedor: assignedTo,
        estado: closeLead ? 'cerrado' : 'asignado'
      };
      
      onLeadUpdate(updatedLead);
      
      toast({
        title: closeLead ? "Lead cerrado" : "Lead asignado",
        description: closeLead 
          ? `${lead.nombre} ha sido cerrado por ${assignedTo}` 
          : `${lead.nombre} ha sido asignado a ${assignedTo}`,
      });
      
      setIsDialogOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona un vendedor",
      });
    }
  };

  const handleCancel = () => {
    setAssignedTo(lead.vendedor);
    setCloseLead(lead.estado === 'cerrado');
    setIsDialogOpen(false);
  };

  const getStatusIcon = () => {
    switch(lead.estado) {
      case 'pendiente': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'asignado': return <UserCheck className="h-4 w-4 text-sage-500" />;
      case 'cerrado': return <Check className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch(lead.estado) {
      case 'pendiente': return 'Pendiente';
      case 'asignado': return `Asignado a: ${lead.vendedor}`;
      case 'cerrado': return `Cerrado por: ${lead.vendedor}`;
      default: return 'Pendiente';
    }
  };

  const getStatusClass = () => {
    switch(lead.estado) {
      case 'pendiente': return 'bg-yellow-50 text-yellow-600';
      case 'asignado': return 'bg-red-50 text-red-600';
      case 'cerrado': return 'bg-green-50 text-green-600';
      default: return 'bg-yellow-50 text-yellow-600';
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={() => setIsDialogOpen(true)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-5 w-5 text-sage-500" />
            <span className="font-medium text-text-heading">{lead.nombre}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-body mb-2">
            <Phone className="h-4 w-4 text-sage-500" />
            <span>{lead.telefono}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-body">
            <Package className="h-4 w-4 text-sage-500" />
            <span>{lead.producto}</span>
          </div>
          <div className={`flex items-center gap-3 text-sm mt-3 ${getStatusClass()} p-2 rounded-md`}>
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {lead.estado === 'pendiente' ? 'Asignar Lead' : 
               lead.estado === 'asignado' ? 'Actualizar Asignación' : 'Detalles del Lead'}
            </DialogTitle>
            <DialogDescription>
              {lead.estado === 'pendiente' ? 'Selecciona el vendedor que se encargará de este lead.' :
               lead.estado === 'asignado' ? 'Actualiza el vendedor asignado o marca como cerrado.' :
               'Este lead ha sido cerrado.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Información del Lead</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-body">Nombre:</span>
                  <p className="font-medium">{lead.nombre}</p>
                </div>
                <div>
                  <span className="text-text-body">Teléfono:</span>
                  <p className="font-medium">{lead.telefono}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-text-body">Producto de Interés:</span>
                  <p className="font-medium">{lead.producto}</p>
                </div>
              </div>
            </div>
            {lead.estado !== 'cerrado' && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Asignar a Vendedor</h3>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger className="border-sage-200 focus:ring-sage-500 focus:border-sage-500">
                    <SelectValue placeholder="Seleccionar vendedor" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-sage-100 shadow-lg">
                    <SelectItem 
                      value="Vendedor Uno" 
                      className="hover:bg-sage-50 focus:bg-sage-50 cursor-pointer"
                    >
                      Vendedor Uno
                    </SelectItem>
                    <SelectItem 
                      value="Vendedor Dos" 
                      className="hover:bg-sage-50 focus:bg-sage-50 cursor-pointer"
                    >
                      Vendedor Dos
                    </SelectItem>
                    <SelectItem 
                      value="Vendedor Tres" 
                      className="hover:bg-sage-50 focus:bg-sage-50 cursor-pointer"
                    >
                      Vendedor Tres
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {lead.estado === 'asignado' && (
                  <div className="flex items-center gap-2 mt-4">
                    <input 
                      type="checkbox" 
                      id="closeLead"
                      checked={closeLead}
                      onChange={(e) => setCloseLead(e.target.checked)}
                      className="rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                    />
                    <label htmlFor="closeLead" className="text-sm text-text-body">
                      Marcar como cerrado
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            {lead.estado !== 'cerrado' && (
              <Button 
                type="button" 
                onClick={handleAssign} 
                className="gap-2 bg-sage-500 hover:bg-sage-600"
              >
                <CheckCircle className="h-4 w-4" />
                {closeLead ? 'Cerrar Lead' : 'Asignar Lead'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadCard;
