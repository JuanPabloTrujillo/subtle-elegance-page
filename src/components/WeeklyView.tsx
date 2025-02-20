
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
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ date, reservations }) => {
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

  return (
    <div className="overflow-auto">
      <div className="min-w-[800px]">
        {/* Header con los días */}
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div className="h-14 border-b"></div>
          {days.map((day) => (
            <div
              key={day.toString()}
              className="h-14 border-b p-2 text-center"
            >
              <div className="font-semibold">
                {format(day, 'EEEE', { locale: es })}
              </div>
              <div className="text-sm text-gray-500">
                {format(day, 'd MMM')}
              </div>
            </div>
          ))}
        </div>

        {/* Grid de horas y eventos */}
        <div className="grid grid-cols-8 gap-1">
          {/* Columna de horas */}
          <div className="space-y-4">
            {hours.map(hour => (
              <div key={hour} className="h-20 text-right pr-2 text-sm text-gray-500">
                {`${hour}:00`}
              </div>
            ))}
          </div>

          {/* Columnas de días */}
          {days.map(day => (
            <div key={day.toString()} className="space-y-4">
              {hours.map(hour => {
                const dayReservations = getReservationsForDayAndHour(day, hour);
                return (
                  <div key={`${day}-${hour}`} className="h-20 border-b border-l p-1">
                    {dayReservations.map(res => (
                      <div
                        key={res.id}
                        className={`text-xs p-1 rounded mb-1 ${
                          res.sportType === 'football' ? 'bg-blue-100' : 'bg-green-100'
                        }`}
                      >
                        <div className="font-semibold">{res.name}</div>
                        <div>{res.sportType === 'football' ? 'Fútbol' : 'Vóley'}</div>
                        <div>{`${res.startTime} - ${res.endTime}`}</div>
                      </div>
                    ))}
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
