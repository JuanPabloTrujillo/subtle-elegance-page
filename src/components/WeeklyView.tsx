
import React from 'react';
import { format, addDays, isSameDay, startOfWeek, parseISO } from 'date-fns';
import { Calendar, Clock, Users } from 'lucide-react';

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

  // Function to determine sport type color
  const getSportTypeColor = (sportType: string) => {
    switch(sportType) {
      case 'football':
        return 'bg-sage-500';
      case 'basketball':
        return 'bg-blue-500';
      case 'tennis':
        return 'bg-amber-500';
      default:
        return 'bg-violet-500';
    }
  };

  return (
    <div className="overflow-auto rounded-xl shadow-card">
      <div className="grid grid-cols-8 gap-1.5">
        {/* Empty cell for the time column header */}
        <div className="h-14 flex items-center justify-center bg-sage-50 rounded-lg border border-sage-100">
          <Clock className="w-5 h-5 text-sage-500" />
        </div>
        
        {/* Day headers */}
        {days.map((day, i) => (
          <div 
            key={i} 
            className="h-14 flex flex-col items-center justify-center bg-sage-50 rounded-lg border border-sage-100 transition-colors hover:bg-sage-100"
          >
            <span className="text-sm font-semibold text-text-body">
              {format(day, 'EEE')}
            </span>
            <span className="text-xs text-text-body/70">
              {format(day, 'MMM d')}
            </span>
          </div>
        ))}

        {/* Time slots */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            {/* Time label */}
            <div className="h-14 flex items-center justify-center text-sm font-medium text-text-body border-t border-slate-100">
              <div className="flex items-center justify-center bg-sage-50/50 rounded-md w-16 h-8">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
            </div>
            
            {/* Day slots */}
            {days.map((day, dayIndex) => {
              const slotReservations = getReservationsForSlot(day, hour);
              const isBooked = slotReservations.length > 0;
              
              return (
                <div 
                  key={dayIndex}
                  onClick={() => onSlotClick(day, hour)}
                  className={`h-14 border-t border-slate-100 transition-all duration-200 cursor-pointer
                    ${isBooked ? 'bg-sage-50/20' : 'hover:bg-sage-50/30'} 
                    ${(hour % 2 === 0) ? 'bg-slate-50/20' : ''}`}
                >
                  {isBooked && slotReservations.map(res => (
                    <div 
                      key={res.id} 
                      className="h-full w-full p-1.5"
                    >
                      <div className={`h-full w-full rounded-md px-2 py-1 text-xs text-white truncate flex items-center gap-1.5 shadow-sm
                        ${getSportTypeColor(res.sportType)} transform hover:scale-[1.02] transition-transform`}
                      >
                        <Users size={12} className="shrink-0" />
                        <span className="truncate font-medium">{res.name}</span>
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
