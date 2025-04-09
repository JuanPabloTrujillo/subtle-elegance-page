import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from "@/components/ui/calendar";
import { startOfWeek, endOfWeek, isSameDay, isWithinInterval, format, addDays, startOfDay, isSameWeek } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyView from '../components/WeeklyView';
import reservationsData from '../data/reservations.json';
import { CalendarIcon, ChevronLeft, ChevronRight, Filter, Calendar as CalendarIconLucide, Users, TrendingUp, Clock } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  sportType: 'football' | 'basketball' | 'tennis' | 'volleyball';
  startTime: string;
  endTime: string;
  date: Date;
}

const CalendarioPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sportFilter, setSportFilter] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const savedReservations = localStorage.getItem('reservations');
      if (savedReservations) {
        return JSON.parse(savedReservations).map((res: any) => ({
          ...res,
          date: new Date(res.date)
        }));
      }
      return reservationsData.reservations.map(res => ({
        ...res,
        date: new Date(res.date)
      }));
    } catch (error) {
      console.error('Error loading reservations:', error);
      return [];
    }
  });

  const [formData, setFormData] = useState<Omit<Reservation, 'id'>>({
    name: '',
    phone: '',
    sportType: 'football',
    startTime: '08:00',
    endTime: '09:00',
    date: new Date(),
  });

  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);

  const calculateInsights = () => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    const totalReservations = reservations.length;
    
    const todaysReservations = reservations.filter(res => 
      format(new Date(res.date), 'yyyy-MM-dd') === todayStr
    ).length;
    
    const sportCounts: Record<string, number> = {};
    reservations.forEach(res => {
      if (sportCounts[res.sportType]) {
        sportCounts[res.sportType]++;
      } else {
        sportCounts[res.sportType] = 1;
      }
    });
    
    let mostPopularSport = { type: 'Sin datos', count: 0 };
    Object.entries(sportCounts).forEach(([type, count]) => {
      if (count > mostPopularSport.count) {
        mostPopularSport = { 
          type: type === 'football' ? 'Fútbol' : 
                type === 'basketball' ? 'Baloncesto' : 
                type === 'tennis' ? 'Tenis' : 'Vóley Playa', 
          count 
        };
      }
    });
    
    const hourCounts: Record<string, number> = {};
    reservations.forEach(res => {
      const hour = res.startTime.split(':')[0];
      if (hourCounts[hour]) {
        hourCounts[hour]++;
      } else {
        hourCounts[hour] = 1;
      }
    });
    
    let peakHour = { hour: '00', count: 0 };
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > peakHour.count) {
        peakHour = { hour, count };
      }
    });
    
    return {
      totalReservations,
      todaysReservations,
      mostPopularSport,
      peakHour: `${peakHour.hour}:00`
    };
  };
  
  const insights = calculateInsights();

  const checkTimeSlotAvailable = (checkDate: Date, startTime: string) => {
    return !reservations.some(res => {
      const resDate = new Date(res.date);
      return format(resDate, 'yyyy-MM-dd') === format(checkDate, 'yyyy-MM-dd') && 
             res.startTime === startTime;
    });
  };

  const handleTimeSlotClick = (selectedDate: Date, hour: number) => {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00';
    
    if (!checkTimeSlotAvailable(selectedDate, startTime)) {
      toast({
        variant: "destructive",
        title: "Horario no disponible",
        description: "Este horario ya está reservado. Por favor, selecciona otro horario.",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      date: selectedDate,
      startTime,
      endTime
    }));
    setIsDialogOpen(true);
  };

  const handleNewReservationClick = () => {
    const currentDate = date || new Date();
    setFormData({
      name: '',
      phone: '',
      sportType: 'football',
      startTime: '08:00',
      endTime: '09:00',
      date: currentDate,
    });
    setIsDialogOpen(true);
  };

  const handleNextDay = () => {
    if (date) {
      setDate(addDays(date, 1));
    }
  };

  const handlePrevDay = () => {
    if (date) {
      setDate(addDays(date, -1));
    }
  };

  const handleChangeWeek = (newDate: Date) => {
    setDate(newDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkTimeSlotAvailable(formData.date, formData.startTime)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ya existe una reserva en este horario. Por favor, selecciona otro horario.",
      });
      return;
    }

    const newReservation: Reservation = {
      id: Date.now().toString(),
      ...formData,
    };

    const updatedReservations = [...reservations, newReservation];
    saveReservationsToJson(updatedReservations);

    toast({
      title: "Reserva creada",
      description: "La reserva se ha creado correctamente.",
    });

    setIsDialogOpen(false);
  };

  const saveReservationsToJson = async (updatedReservations: Reservation[]) => {
    try {
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      console.log('Reservations saved:', updatedReservations);
    } catch (error) {
      console.error('Error saving reservations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar las reservas. Por favor, intente nuevamente.",
      });
    }
  };

  const deleteReservation = (id: string) => {
    const updatedReservations = reservations.filter(res => res.id !== id);
    saveReservationsToJson(updatedReservations);
  };

  const filteredReservations = reservations.filter(res => {
    if (!date || !res.date) return false;

    const resDate = new Date(res.date);
    const matchesDate = (() => {
      switch (view) {
        case 'day':
          return isSameDay(resDate, date);
        case 'week':
          return isSameWeek(resDate, date, { weekStartsOn: 1 });
        default:
          return false;
      }
    })();

    if (sportFilter && res.sportType !== sportFilter) {
      return false;
    }

    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      res.name.toLowerCase().includes(searchTerm) ||
      res.phone.toLowerCase().includes(searchTerm) ||
      res.sportType.toLowerCase().includes(searchTerm);

    return matchesDate && matchesSearch;
  });

  const handleDeleteConfirm = () => {
    if (reservationToDelete) {
      const updatedReservations = reservations.filter(res => res.id !== reservationToDelete);
      saveReservationsToJson(updatedReservations);
      setReservationToDelete(null);
      
      toast({
        title: "Reserva eliminada",
        description: "La reserva se ha eliminado correctamente.",
      });
    }
  };

  const formatDateDisplay = (date?: Date) => {
    if (!date) return '';
    return format(date, 'EEEE, d MMMM yyyy');
  };

  const sportTypeOptions = [
    { value: 'football', label: 'Fútbol' },
    { value: 'basketball', label: 'Baloncesto' },
    { value: 'tennis', label: 'Tenis' },
    { value: 'volleyball', label: 'Vóley Playa' }
  ];

  return (
    <div className="min-h-screen bg-sage-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-text-heading">Calendario de Reservas</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-text-body hover:text-text-heading px-4 py-2 rounded-lg hover:bg-sage-50 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="text-text-body hover:text-text-heading"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white hover:shadow-card-hover transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-sage-50 text-sage-500">
                    <CalendarIconLucide size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-body">Total de Reservas</p>
                    <h4 className="text-2xl font-bold text-text-heading">{insights.totalReservations}</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-card-hover transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-body">Reservas Hoy</p>
                    <h4 className="text-2xl font-bold text-text-heading">{insights.todaysReservations}</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-card-hover transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-amber-50 text-amber-500">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-body">Deporte Popular</p>
                    <h4 className="text-lg font-bold text-text-heading">{insights.mostPopularSport.type}</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-card-hover transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-violet-50 text-violet-500">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-body">Hora Punta</p>
                    <h4 className="text-2xl font-bold text-text-heading">{insights.peakHour}</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-text-heading">Calendario</h3>
                  <div className="flex items-center gap-2">
                    <Tabs defaultValue={view} onValueChange={(v) => setView(v as 'day' | 'week')}>
                      <TabsList>
                        <TabsTrigger value="day">Día</TabsTrigger>
                        <TabsTrigger value="week">Semana</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    {view === 'day' && (
                      <div className="flex items-center ml-2">
                        <button 
                          onClick={handlePrevDay}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-50 hover:bg-sage-100 text-sage-600 transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="px-2 text-sm font-medium">{formatDateDisplay(date)}</span>
                        <button 
                          onClick={handleNextDay}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-50 hover:bg-sage-100 text-sage-600 transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {view === 'week' ? (
                  <WeeklyView
                    date={date || new Date()}
                    reservations={filteredReservations}
                    onSlotClick={handleTimeSlotClick}
                    onChangeWeek={handleChangeWeek}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">Horarios del día</h4>
                      <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                        {Array.from({ length: 14 }, (_, i) => i + 7).map((hour) => {
                          const hourFormatted = `${hour.toString().padStart(2, '0')}:00`;
                          const daySlotReservations = filteredReservations.filter(res => {
                            return parseInt(res.startTime) === hour;
                          });
                          const isBooked = daySlotReservations.length > 0;
                          
                          return (
                            <div 
                              key={hour}
                              onClick={() => date && handleTimeSlotClick(date, hour)}
                              className={`p-3 rounded-lg border ${isBooked 
                                ? 'bg-sage-50 border-sage-100' 
                                : 'bg-white border-slate-100 hover:bg-sage-50/30'} cursor-pointer`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{hourFormatted}</span>
                                {isBooked ? (
                                  <span className="text-sm text-sage-600 bg-sage-50 px-2 py-1 rounded">Reservado</span>
                                ) : (
                                  <span className="text-sm text-slate-500">Disponible</span>
                                )}
                              </div>
                              {daySlotReservations.map(res => (
                                <div key={res.id} className="mt-2 text-sm">
                                  <p className="font-medium">{res.name}</p>
                                  <p className="text-xs text-slate-500">{res.sportType} - {res.phone}</p>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-text-heading">Reservas</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="bg-sage-500 text-white hover:bg-sage-600 hover:text-white border-0"
                      >
                        Nueva Reserva
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <div className="space-y-4">
                        <h4 className="font-medium text-center">Selecciona día y hora</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-slate-500">Fecha</p>
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(date) => date && setFormData({...formData, date})}
                            className="rounded-md border p-3 pointer-events-auto"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm text-slate-500">Hora inicio</p>
                            <Select 
                              value={formData.startTime} 
                              onValueChange={(value) => setFormData({...formData, startTime: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {Array.from({ length: 14 }, (_, i) => i + 7).map((hour) => (
                                    <SelectItem 
                                      key={hour} 
                                      value={`${hour.toString().padStart(2, '0')}:00`}
                                    >
                                      {`${hour.toString().padStart(2, '0')}:00`}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-slate-500">Hora fin</p>
                            <Select 
                              value={formData.endTime} 
                              onValueChange={(value) => setFormData({...formData, endTime: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                                    <SelectItem 
                                      key={hour} 
                                      value={`${hour.toString().padStart(2, '0')}:00`}
                                    >
                                      {`${hour.toString().padStart(2, '0')}:00`}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => {
                            if (checkTimeSlotAvailable(formData.date, formData.startTime)) {
                              setIsDialogOpen(true);
                            } else {
                              toast({
                                variant: "destructive",
                                title: "Horario no disponible",
                                description: "Este horario ya está reservado. Por favor, selecciona otro horario.",
                              });
                            }
                          }}
                        >
                          Continuar
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="mb-4 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Buscar por nombre, tel��fono o deporte..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setShowFilters(!showFilters)}
                      className={showFilters ? "bg-sage-100" : ""}
                    >
                      <Filter size={18} />
                    </Button>
                  </div>
                  
                  {showFilters && (
                    <div className="p-3 bg-sage-50 rounded-lg space-y-2 animate-fade-in">
                      <p className="text-sm font-medium">Filtrar por deporte</p>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={sportFilter === null ? "bg-sage-500 text-white" : "bg-white"}
                          onClick={() => setSportFilter(null)}
                        >
                          Todos
                        </Button>
                        {sportTypeOptions.map((sport) => (
                          <Button 
                            key={sport.value}
                            variant="outline" 
                            size="sm"
                            className={sportFilter === sport.value ? "bg-sage-500 text-white" : "bg-white"}
                            onClick={() => setSportFilter(sport.value)}
                          >
                            {sport.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-card transition-shadow"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-text-heading">{reservation.name}</p>
                          <p className="text-sm text-text-body">
                            {new Date(reservation.date).toLocaleDateString()} - {reservation.startTime} a {reservation.endTime}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-block w-3 h-3 rounded-full ${
                              reservation.sportType === 'football' ? 'bg-sage-500' :
                              reservation.sportType === 'basketball' ? 'bg-blue-500' :
                              reservation.sportType === 'tennis' ? 'bg-amber-500' : 'bg-violet-500'
                            }`}></span>
                            <span className="text-sm text-text-body">
                              {reservation.sportType === 'football' ? 'Fútbol' : 
                               reservation.sportType === 'basketball' ? 'Baloncesto' :
                               reservation.sportType === 'tennis' ? 'Tenis' : 'Vóley Playa'} - {reservation.phone}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setReservationToDelete(reservation.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredReservations.length === 0 && (
                    <div className="text-center p-8 bg-sage-50/50 rounded-lg">
                      <p className="text-text-body">No hay reservas para este período</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={handleNewReservationClick}
                      >
                        Crear una reserva
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Reserva</DialogTitle>
            <DialogDescription>
              Complete los datos para crear una nueva reserva para el día {formData.date ? format(formData.date, 'dd/MM/yyyy') : ''} 
              a las {formData.startTime}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-body mb-1">
                Nombre
              </label>
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-body mb-1">
                Teléfono
              </label>
              <Input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-body mb-1">
                Deporte
              </label>
              <Select 
                value={formData.sportType} 
                onValueChange={(value: any) => setFormData({...formData, sportType: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="football">Fútbol</SelectItem>
                  <SelectItem value="basketball">Baloncesto</SelectItem>
                  <SelectItem value="tennis">Tenis</SelectItem>
                  <SelectItem value="volleyball">Vóley Playa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Crear Reserva
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!reservationToDelete} onOpenChange={() => setReservationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la reserva del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReservationToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CalendarioPage;
