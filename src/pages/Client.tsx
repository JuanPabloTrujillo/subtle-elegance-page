
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { FileText, ArrowLeft, Upload, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StoredFile {
  id: string;
  name: string;
  size: string;
  date: string;
}

const clientSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre es requerido' }),
  telefono: z.string().min(10, { message: 'El teléfono debe tener al menos 10 dígitos' }),
  documento: z.string().min(5, { message: 'El número de documento es requerido' }),
  fechaNacimiento: z.date({
    required_error: 'La fecha de nacimiento es requerida',
  }),
  marca: z.string().min(1, { message: 'La marca es requerida' }),
  placa: z.string().min(1, { message: 'La placa es requerida' }),
  modelo: z.string().min(1, { message: 'El modelo es requerido' }),
  servicio: z.string().min(1, { message: 'El servicio es requerido' }),
  zonaCirculacion: z.string().min(1, { message: 'La zona de circulación es requerida' }),
});

type ClientFormValues = z.infer<typeof clientSchema>;

const Client = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>(() => {
    const savedFiles = localStorage.getItem('clientPDFs');
    return savedFiles ? JSON.parse(savedFiles) : [];
  });

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Initialize form with default values
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nombre: '',
      telefono: '',
      documento: '',
      marca: '',
      placa: '',
      modelo: '',
      servicio: '',
      zonaCirculacion: '',
    },
  });

  // Handle form submission
  const onSubmit = (data: ClientFormValues) => {
    // Store client data in localStorage
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    clients.push({
      id: Date.now().toString(),
      ...data,
      fechaNacimiento: format(data.fechaNacimiento, 'yyyy-MM-dd'),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('clients', JSON.stringify(clients));

    // Show success message
    toast({
      title: "Cliente registrado",
      description: "El cliente ha sido registrado exitosamente",
    });

    // Reset form
    form.reset();
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Solo se permiten archivos PDF",
      });
      return;
    }

    const newFile: StoredFile = {
      id: Date.now().toString(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      date: new Date().toLocaleDateString()
    };

    const updatedFiles = [...storedFiles, newFile];
    setStoredFiles(updatedFiles);
    localStorage.setItem('clientPDFs', JSON.stringify(updatedFiles));

    toast({
      title: "Archivo subido",
      description: "El PDF se ha guardado correctamente",
    });
  };

  // Delete file
  const deleteFile = (id: string) => {
    const updatedFiles = storedFiles.filter(file => file.id !== id);
    setStoredFiles(updatedFiles);
    localStorage.setItem('clientPDFs', JSON.stringify(updatedFiles));

    toast({
      title: "Archivo eliminado",
      description: "El PDF se ha eliminado correctamente",
    });
  };

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
              <h1 className="text-xl font-semibold text-text-heading">Registro de Clientes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/leads')}
                className="text-text-body hover:text-text-heading px-4 py-2 rounded-lg hover:bg-sage-50 transition-colors"
              >
                Leads
              </button>
              <button
                onClick={() => navigate('/calendario')}
                className="text-text-body hover:text-text-heading px-4 py-2 rounded-lg hover:bg-sage-50 transition-colors"
              >
                Calendario
              </button>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-text-heading mb-6">Información del Cliente</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Teléfono */}
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de teléfono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Documento */}
                  <FormField
                    control={form.control}
                    name="documento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. de Documento</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de documento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fecha de nacimiento */}
                  <FormField
                    control={form.control}
                    name="fechaNacimiento"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Nacimiento</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, 'dd/MM/yyyy')
                                ) : (
                                  <span className="text-muted-foreground">Seleccionar fecha</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Marca */}
                  <FormField
                    control={form.control}
                    name="marca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca del Vehículo</FormLabel>
                        <FormControl>
                          <Input placeholder="Marca" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Placa */}
                  <FormField
                    control={form.control}
                    name="placa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placa</FormLabel>
                        <FormControl>
                          <Input placeholder="Placa del vehículo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Modelo */}
                  <FormField
                    control={form.control}
                    name="modelo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input placeholder="Modelo del vehículo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Servicio */}
                  <FormField
                    control={form.control}
                    name="servicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Servicio</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar servicio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="particular">Particular</SelectItem>
                              <SelectItem value="publico">Público</SelectItem>
                              <SelectItem value="especial">Especial</SelectItem>
                              <SelectItem value="carga">Carga</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Zona de circulación */}
                  <FormField
                    control={form.control}
                    name="zonaCirculacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zona de Circulación</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar zona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="nacional">Nacional</SelectItem>
                              <SelectItem value="urbana">Urbana</SelectItem>
                              <SelectItem value="rural">Rural</SelectItem>
                              <SelectItem value="internacional">Internacional</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-sage-500 hover:bg-sage-600 text-white"
                  >
                    Registrar Cliente
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-text-heading mb-4">Documentos de Pólizas</h2>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-sage-100 rounded-lg p-6 mb-4">
              <FileText className="h-12 w-12 text-sage-500 mb-2" />
              <p className="text-text-body mb-4">Arrastra y suelta archivos de pólizas en PDF aquí o</p>
              <label htmlFor="client-file-upload">
                <input
                  id="client-file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="default" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" /> Seleccionar archivo
                </Button>
              </label>
            </div>

            <div className="space-y-2">
              {storedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-sage-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-sage-500" />
                    <div>
                      <p className="text-sm font-medium text-text-heading">{file.name}</p>
                      <p className="text-xs text-text-body">
                        {file.size} • Subido el {file.date}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-text-body" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Client;
