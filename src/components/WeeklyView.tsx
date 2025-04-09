
import React from 'react';
import { format, addDays, isSameDay, startOfWeek, parseISO } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

interface Reservation {
  id: string;
  name: string;
  sportType: string;
  startTime: string;
  endTime: string;
  date: Date;
}

interface WeeklyViewProps {
  date: Date;
  reservations: Reservation[];
  onSlotClick: (date: Date, hour: number) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ date, reservations, onSlotClick }) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 21:00
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getReservationsForSlot = (day: Date, hour: number) => {
    return reservations.filter(res => {
      const resDate = res.date instanceof Date ? res.date : new Date(res.date);
      const resHour = parseInt(res.startTime.split(':')[0]);
      return isSameDay(resDate, day) && resHour === hour;
    });
  };

  return (
    <div className="overflow-auto">
      <div className="grid grid-cols-8 gap-1">
        {/* Empty cell for the time column header */}
        <div className="h-12 flex items-center justify-center bg-sage-50 rounded-lg">
          <Clock className="w-5 h-5 text-sage-500" />
        </div>
        
        {/* Day headers */}
        {days.map((day, i) => (
          <div 
            key={i} 
            className="h-12 flex flex-col items-center justify-center bg-sage-50 rounded-lg"
          >
            <span className="text-sm font-medium text-text-body">
              {format(day, 'EEE')}
            </span>
            <span className="text-xs text-text-body">
              {format(day, 'MMM d')}
            </span>
          </div>
        ))}

        {/* Time slots */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            {/* Time label */}
            <div className="h-12 flex items-center justify-center text-sm font-medium text-text-body border-t border-slate-100">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
            
            {/* Day slots */}
            {days.map((day, dayIndex) => {
              const slotReservations = getReservationsForSlot(day, hour);
              const isBooked = slotReservations.length > 0;
              
              return (
                <div 
                  key={dayIndex}
                  onClick={() => onSlotClick(day, hour)}
                  className={`h-12 border-t border-slate-100 transition-colors cursor-pointer
                    ${isBooked ? 'bg-sage-50' : 'hover:bg-sage-50/50'}`}
                >
                  {isBooked && slotReservations.map(res => (
                    <div 
                      key={res.id} 
                      className="h-full w-full p-1"
                    >
                      <div className={`h-full w-full rounded px-2 py-1 text-xs text-white truncate
                        ${res.sportType === 'football' ? 'bg-sage-500' : 'bg-blue-500'}`}
                      >
                        {res.name}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;
