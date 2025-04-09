
import React from 'react';
import { format, addDays, isSameDay, startOfWeek, parseISO, addWeeks, subWeeks } from 'date-fns';
import { Calendar, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';

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
  onChangeWeek: (newDate: Date) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ date, reservations, onSlotClick, onChangeWeek }) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 21:00
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleNextWeek = () => {
    onChangeWeek(addWeeks(date, 1));
  };

  const handlePrevWeek = () => {
    onChangeWeek(subWeeks(date, 1));
  };

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
    <div className="rounded-xl shadow-card overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-white">
        <button 
          onClick={handlePrevWeek}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-50 hover:bg-sage-100 text-sage-600 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center space-x-2">
          <img 
            src="https://www.designevo.com/res/templates/thumb_small/brown-badge-and-white-football.webp" 
            alt="Sports Logo" 
            className="h-6 w-6 object-contain"
          />
          <h2 className="text-lg font-medium text-text-heading">
            {format(weekStart, 'MMMM d')} - {format(days[6], 'MMMM d, yyyy')}
          </h2>
        </div>
        <button 
          onClick={handleNextWeek}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-50 hover:bg-sage-100 text-sage-600 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      
      <div className="overflow-auto">
        <div className="grid grid-cols-8 gap-1.5 p-2 bg-white">
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
                const maxVisibleReservations = 2;
                const hasMoreReservations = slotReservations.length > maxVisibleReservations;
                const visibleReservations = slotReservations.slice(0, maxVisibleReservations);
                
                return (
                  <div 
                    key={dayIndex}
                    onClick={() => onSlotClick(day, hour)}
                    className={`h-auto min-h-14 max-h-20 border-t border-slate-100 transition-all duration-200 cursor-pointer overflow-y-auto
                      ${isBooked ? 'bg-sage-50/20' : 'hover:bg-sage-50/30'} 
                      ${(hour % 2 === 0) ? 'bg-slate-50/20' : ''}`}
                  >
                    {isBooked ? (
                      <div className="flex flex-col gap-0.5 p-0.5">
                        {visibleReservations.map(res => (
                          <div 
                            key={res.id} 
                            className="w-full"
                          >
                            <div className={`w-full rounded-sm px-1.5 py-0.5 text-xs text-white truncate flex items-center gap-1
                              ${getSportTypeColor(res.sportType)} transform hover:scale-[1.02] transition-transform`}
                            >
                              <Users size={10} className="shrink-0" />
                              <span className="truncate font-medium">{res.name}</span>
                            </div>
                          </div>
                        ))}
                        {hasMoreReservations && (
                          <div className="text-xs text-center text-slate-500 font-medium">
                            +{slotReservations.length - maxVisibleReservations} más
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyView;
