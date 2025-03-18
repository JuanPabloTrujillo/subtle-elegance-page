
import React, { useState } from 'react';
import { User, Phone, Package, CheckCircle } from 'lucide-react';
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

interface Lead {
  id: number;
  nombre: string;
  telefono: string;
  producto: string;
}

interface LeadCardProps {
  lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string | undefined>();
  const { toast } = useToast();

  const handleAssign = () => {
    if (assignedTo) {
      toast({
        title: "Lead asignado",
        description: `${lead.nombre} ha sido asignado a ${assignedTo}`,
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
    setAssignedTo(undefined);
    setIsDialogOpen(false);
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
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Asignar Lead</DialogTitle>
            <DialogDescription>
              Selecciona el vendedor que se encargará de este lead.
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
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Asignar a Vendedor</h3>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vendedor Uno">Vendedor Uno</SelectItem>
                  <SelectItem value="Vendedor Dos">Vendedor Dos</SelectItem>
                  <SelectItem value="Vendedor Tres">Vendedor Tres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleAssign} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Asignar Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadCard;
