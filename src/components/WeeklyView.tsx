
import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeeklyViewProps {
  date: Date;
  reservations: Array<{
    id: string;
    name: string;
    sportType: 'football' | 'volleyball';
    startTime: string;
    endTime: string;
    date: Date;
  }>;
  onSlotClick: (date: Date, hour: number) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ date, reservations, onSlotClick }) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 AM to 9:00 PM
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getReservationsForDayAndHour = (day: Date, hour: number) => {
    return reservations.filter(res => {
      const resDate = new Date(res.date);
      const resStartHour = parseInt(res.startTime.split(':')[0]);
      return format(resDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && resStartHour === hour;
    });
  };

  const handleSlotClick = (day: Date, hour: number) => {
    const dayReservations = getReservationsForDayAndHour(day, hour);
    if (dayReservations.length === 0) {
      onSlotClick(day, hour);
    }
  };

  return (
    <div className="overflow-auto bg-white rounded-lg">
      <div className="min-w-[800px]">
        {/* Header con los días */}
        <div className="grid grid-cols-8 gap-1 mb-2 bg-sage-50">
          <div className="h-16 border-b flex items-center justify-center font-semibold text-sage-500">
            Hora
          </div>
          {days.map((day) => (
            <div
              key={day.toString()}
              className="h-16 border-b p-2 text-center"
            >
              <div className="font-semibold text-sage-500">
                {format(day, 'EEEE', { locale: es })}
              </div>
              <div className="text-sm text-gray-600">
                {format(day, 'd MMM')}
              </div>
            </div>
          ))}
        </div>

        {/* Grid de horas y eventos */}
        <div className="grid grid-cols-8 gap-1">
          {/* Columna de horas */}
          <div className="space-y-1">
            {hours.map(hour => (
              <div key={hour} className="h-20 text-right pr-2 text-sm text-gray-500 font-medium flex items-center justify-end">
                {`${hour}:00`}
              </div>
            ))}
          </div>

          {/* Columnas de días */}
          {days.map(day => (
            <div key={day.toString()} className="space-y-1">
              {hours.map(hour => {
                const dayReservations = getReservationsForDayAndHour(day, hour);
                const isBooked = dayReservations.length > 0;
                return (
                  <div
                    key={`${day}-${hour}`}
                    onClick={() => handleSlotClick(day, hour)}
                    className={`h-20 border rounded-lg transition-all duration-200 p-1 relative group
                      ${isBooked 
                        ? 'bg-red-50 cursor-not-allowed' 
                        : 'hover:bg-sage-50 cursor-pointer hover:shadow-md'}`}
                  >
                    {isBooked ? (
                      dayReservations.map(res => (
                        <div
                          key={res.id}
                          className={`h-full rounded-md p-2 ${
                            res.sportType === 'football' 
                              ? 'bg-blue-100 border border-blue-200' 
                              : 'bg-green-100 border border-green-200'
                          }`}
                        >
                          <div className="font-semibold text-xs">{res.name}</div>
                          <div className="text-xs text-gray-600">
                            {res.sportType === 'football' ? 'Fútbol' : 'Vóley'}
                          </div>
                          <div className="text-xs text-gray-600">
                            {`${res.startTime} - ${res.endTime}`}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="hidden group-hover:flex absolute inset-0 bg-sage-50/90 rounded-lg items-center justify-center text-xs text-sage-500 font-medium">
                        Click para reservar
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyView;
