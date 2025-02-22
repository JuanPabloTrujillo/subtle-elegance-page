import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from "@/components/ui/calendar";
import { Select } from "@radix-ui/react-select";
import { startOfWeek, endOfWeek, isSameDay, isWithinInterval, format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import WeeklyView from '../components/WeeklyView';
import reservationsData from '../data/reservations.json';

interface Reservation {
  id: string;
  name: string;
  phone: string;
  sportType: 'football' | 'volleyball';
  startTime: string;
  endTime: string;
  date: Date;
}

const CalendarioPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      return reservationsData.reservations.map(res => ({
        ...res,
        date: new Date(res.date)
      }));
    } catch (error) {
      console.error('Error loading reservations:', error);
      return [];
    }
  });

  const [formData, setFormData] = useState<Omit<Reservation, 'id' | 'date'>>({
    name: '',
    phone: '',
    sportType: 'football',
    startTime: '08:00',
    endTime: '09:00',
  });

  const checkTimeSlotAvailable = (checkDate: Date, startTime: string) => {
    return !reservations.some(res => {
      const resDate = new Date(res.date);
      return format(resDate, 'yyyy-MM-dd') === format(checkDate, 'yyyy-MM-dd') && 
             res.startTime === startTime;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    if (!checkTimeSlotAvailable(date, formData.startTime)) {
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
      date: date,
    };

    const updatedReservations = [...reservations, newReservation];
    saveReservationsToJson(updatedReservations);

    toast({
      title: "Reserva creada",
      description: "La reserva se ha creado correctamente.",
    });

    setFormData({
      name: '',
      phone: '',
      sportType: 'football',
      startTime: '08:00',
      endTime: '09:00',
    });
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

  const handleTimeSlotClick = (selectedDate: Date, hour: number) => {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    
    if (!checkTimeSlotAvailable(selectedDate, startTime)) {
      toast({
        variant: "destructive",
        title: "Horario no disponible",
        description: "Este horario ya está reservado. Por favor, selecciona otro horario.",
      });
      return;
    }

    setDate(selectedDate);
    setFormData({
      ...formData,
      startTime: startTime,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`
    });

    document.querySelector('.reservation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredReservations = reservations.filter(res => {
    if (!date || !res.date) return false;

    const resDate = new Date(res.date);
    const matchesDate = (() => {
      switch (view) {
        case 'day':
          return isSameDay(resDate, date);
        case 'week':
          const weekStart = startOfWeek(date, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
          return isWithinInterval(resDate, { start: weekStart, end: weekEnd });
        case 'month':
          return resDate.getMonth() === date.getMonth() && 
                 resDate.getFullYear() === date.getFullYear();
        default:
          return false;
      }
    })();

    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      res.name.toLowerCase().includes(searchTerm) ||
      res.phone.toLowerCase().includes(searchTerm) ||
      (res.sportType === 'football' ? 'fútbol' : 'vóley playa').includes(searchTerm);

    return matchesDate && matchesSearch;
  });

  const renderCalendarView = () => {
    switch (view) {
      case 'week':
        return date ? (
          <WeeklyView
            date={date}
            reservations={filteredReservations}
            onSlotClick={handleTimeSlotClick}
          />
        ) : null;
      default:
        return (
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        );
    }
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 reservation-form">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-text-heading mb-4">Nueva Reserva</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-body mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-body mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-body mb-1">
                      Deporte
                    </label>
                    <select
                      value={formData.sportType}
                      onChange={(e) => setFormData({
                        ...formData, 
                        sportType: e.target.value as 'football' | 'volleyball'
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    >
                      <option value="football">Fútbol</option>
                      <option value="volleyball">Vóley Playa</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-body mb-1">
                        Hora Inicio
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-body mb-1">
                        Hora Fin
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sage-500 hover:bg-sage-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500"
                  >
                    Crear Reserva
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-text-heading">Calendario</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Buscar por nombre, teléfono o deporte..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                    <select
                      value={view}
                      onChange={(e) => setView(e.target.value as 'day' | 'week' | 'month')}
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    >
                      <option value="day">Día</option>
                      <option value="week">Semana</option>
                      <option value="month">Mes</option>
                    </select>
                  </div>
                </div>
                {renderCalendarView()}
              </div>

              {view !== 'week' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-text-heading mb-4">
                    Reservas - {view === 'day' ? 'Del Día' : 'Del Mes'}
                  </h3>
                  <div className="space-y-4">
                    {filteredReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex justify-between items-center p-4 bg-sage-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-text-heading">{reservation.name}</p>
                          <p className="text-sm text-text-body">
                            {new Date(reservation.date).toLocaleDateString()} - {reservation.startTime} a {reservation.endTime}
                          </p>
                          <p className="text-sm text-text-body">
                            {reservation.sportType === 'football' ? 'Fútbol' : 'Vóley Playa'} - {reservation.phone}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                    {filteredReservations.length === 0 && (
                      <p className="text-center text-text-body">No hay reservas para este período</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarioPage;
