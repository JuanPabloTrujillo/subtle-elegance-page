
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, User, Clock, PhoneCall, CheckCircle, XCircle } from 'lucide-react';
import { Lead } from "@/pages/Leads";

interface LeadDetailDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadUpdate: (updatedLead: Lead) => void;
}

const LeadDetailDialog: React.FC<LeadDetailDialogProps> = ({ 
  lead, 
  open, 
  onOpenChange,
  onLeadUpdate
}) => {
  const [commentText, setCommentText] = useState("");
  const [selectedSalesperson, setSelectedSalesperson] = useState<string | undefined>(lead.vendedor);
  const [selectedStatus, setSelectedStatus] = useState<Lead['estado']>(lead.estado);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: es });
    } catch(e) {
      return "Fecha desconocida";
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
      case 'nuevo': return 'Nuevo lead';
      case 'contactando': return 'Intentando contactar';
      case 'aceptado': return 'Aceptado';
      case 'rechazado': return 'Rechazado';
      default: return 'Nuevo lead';
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

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    const updatedComments = [
      ...(lead.comentarios || []),
      {
        id: Date.now(),
        texto: commentText,
        fecha: new Date().toISOString(),
        autor: localStorage.getItem('user') || 'Usuario'
      }
    ];
    
    const updatedLead: Lead = {
      ...lead,
      comentarios: updatedComments,
      ultimaActividad: new Date().toISOString()
    };
    
    onLeadUpdate(updatedLead);
    setCommentText("");
  };

  const handleUpdateLead = () => {
    const updatedLead: Lead = {
      ...lead,
      vendedor: selectedSalesperson,
      estado: selectedStatus,
      ultimaActividad: new Date().toISOString()
    };
    
    onLeadUpdate(updatedLead);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Lead</DialogTitle>
          <DialogDescription>
            Información y gestión del lead seleccionado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{lead.nombre}</h3>
                <p className="text-muted-foreground">{lead.telefono}</p>
                {lead.empresa && <p className="text-sm text-muted-foreground">Empresa: {lead.empresa}</p>}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(lead.estado)} flex items-center gap-1`}>
                {getStatusIcon(lead.estado)}
                {getStatusText(lead.estado)}
              </div>
            </div>
            
            <div className="text-sm">
              <p><span className="font-medium">Producto de interés:</span> {lead.producto}</p>
              <p><span className="font-medium">Creado:</span> {formatDate(lead.fechaCreacion)}</p>
              <p><span className="font-medium">Última actividad:</span> {formatDate(lead.ultimaActividad || lead.fechaCreacion)}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Tabs defaultValue="comentarios" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1">
                <TabsTrigger value="comentarios" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <MessageSquare className="h-4 w-4" />
                  Comentarios
                </TabsTrigger>
                <TabsTrigger value="gestion" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <User className="h-4 w-4" />
                  Gestión
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="comentarios" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Agregar comentario</h4>
                  <Textarea 
                    placeholder="Escribir comentario sobre este lead..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-24 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <Button 
                    onClick={handleAddComment} 
                    disabled={!commentText.trim()} 
                    className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                  >
                    Agregar comentario
                  </Button>
                </div>
                
                <div className="space-y-4 mt-6">
                  <h4 className="font-medium">Historial de comentarios</h4>
                  {lead.comentarios && lead.comentarios.length > 0 ? (
                    <div className="space-y-4">
                      {lead.comentarios.map((comentario) => (
                        <div key={comentario.id} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{comentario.autor}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(comentario.fecha)}</span>
                          </div>
                          <p className="text-sm">{comentario.texto}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No hay comentarios disponibles.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="gestion" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Etapa actual</h4>
                    <Select 
                      value={selectedStatus} 
                      onValueChange={(value) => setSelectedStatus(value as Lead['estado'])}
                    >
                      <SelectTrigger className="w-full bg-white border-gray-200 focus:ring-orange-500 focus:border-orange-500 shadow-sm">
                        <SelectValue placeholder="Seleccionar etapa" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-100 shadow-lg">
                        <SelectItem value="nuevo" className="hover:bg-orange-50 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span>Nuevo lead</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="contactando" className="hover:bg-orange-50 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <PhoneCall className="h-4 w-4 text-blue-500" />
                            <span>Intentando contactar</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="aceptado" className="hover:bg-orange-50 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Aceptado</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="rechazado" className="hover:bg-orange-50 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span>Rechazado</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Asignar vendedor</h4>
                    <Select 
                      value={selectedSalesperson} 
                      onValueChange={setSelectedSalesperson}
                    >
                      <SelectTrigger className="w-full bg-white border-gray-200 focus:ring-orange-500 focus:border-orange-500 shadow-sm">
                        <SelectValue placeholder="Seleccionar vendedor" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-100 shadow-lg">
                        <SelectItem value="Vendedor Uno" className="hover:bg-orange-50 cursor-pointer">Vendedor Uno</SelectItem>
                        <SelectItem value="Vendedor Dos" className="hover:bg-orange-50 cursor-pointer">Vendedor Dos</SelectItem>
                        <SelectItem value="Vendedor Tres" className="hover:bg-orange-50 cursor-pointer">Vendedor Tres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={handleUpdateLead} className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                  Guardar cambios
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailDialog;
