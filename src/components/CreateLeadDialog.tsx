
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Lead } from "@/pages/Leads";
import { PlusCircle } from 'lucide-react';

interface CreateLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateLead: (lead: Omit<Lead, 'id' | 'comentarios' | 'fechaCreacion'>) => void;
}

const CreateLeadDialog: React.FC<CreateLeadDialogProps> = ({ 
  open, 
  onOpenChange,
  onCreateLead
}) => {
  const form = useForm<Omit<Lead, 'id' | 'comentarios' | 'fechaCreacion'>>({
    defaultValues: {
      nombre: '',
      telefono: '',
      producto: '',
      empresa: '',
      estado: 'nuevo',
    }
  });

  const onSubmit = (values: Omit<Lead, 'id' | 'comentarios' | 'fechaCreacion'>) => {
    onCreateLead(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl border-0 shadow-xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-text-heading">Crear Nuevo Lead</DialogTitle>
          <DialogDescription className="text-text-body text-base">
            Completa la información para registrar un nuevo lead potencial.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-heading font-medium">Nombre Completo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Juan Pérez" 
                      {...field} 
                      required 
                      className="rounded-lg border-gray-200 hover:border-orange-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-heading font-medium">Teléfono</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: 123-456-7890" 
                      {...field} 
                      required 
                      className="rounded-lg border-gray-200 hover:border-orange-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="empresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-heading font-medium">Empresa (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Empresa S.A." 
                      {...field} 
                      className="rounded-lg border-gray-200 hover:border-orange-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="producto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-heading font-medium">Producto de Interés</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Seguro de Vida" 
                      {...field} 
                      required 
                      className="rounded-lg border-gray-200 hover:border-orange-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="rounded-lg border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Crear Lead
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadDialog;
