import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { ethLocalizer } from 'eth-react-big-calendar-localizer';
import { useCallback, useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { useCalendarEvents } from '@/hooks/calendar/use-calendar-events';
import type { LocalEvent } from '@/types/calendar';
import { Box, Paper, Skeleton, useTheme } from '@mui/material';
import CalendarToolbar from './CalendarToolbar';
import EventDialog from './EventDialog';
import YearView from './YearView';

// Ge'ez numerals mapping (1-30)
const geezNumerals: Record<number, string> = {
  1: '፩',
  2: '፪',
  3: '፫',
  4: '፬',
  5: '፭',
  6: '፮',
  7: '፯',
  8: '፰',
  9: '፱',
  10: '፲',
  11: '፲፩',
  12: '፲፪',
  13: '፲፫',
  14: '፲፬',
  15: '፲፭',
  16: '፲፮',
  17: '፲፯',
  18: '፲፰',
  19: '፲፱',
  20: '፳',
  21: '፳፩',
  22: '፳፪',
  23: '፳፫',
  24: '፳፬',
  25: '፳፭',
  26: '፳፮',
  27: '፳፯',
  28: '፳፰',
  29: '፳፱',
  30: '፴',
};

// Convert Arabic numerals to Ge'ez
function toGeez(text: string): string {
  return text.replace(/\b(\d{1,2})\b/g, (match) => {
    const num = parseInt(match, 10);
    return geezNumerals[num] || match;
  });
}

// Wrapped Ge'ez localizer
const createGeezLocalizer = () => {
  const originalFormat = ethLocalizer.format;
  return {
    ...ethLocalizer,
    format: (value: any, formatStr: string) => {
      const result = originalFormat(value, formatStr);
      if (typeof result === 'string') {
        return toGeez(result);
      }
      return result;
    },
  };
};

const ethiopianLocalizer = createGeezLocalizer();

const locales = { 'en-US': enUS };

const gregorianLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Internal event type for react-big-calendar (uses Date objects)
interface CalendarEvent extends Omit<LocalEvent, 'start' | 'end'> {
  start: Date;
  end: Date;
}

const DnDCalendar = withDragAndDrop<CalendarEvent, object>(Calendar);

export default function CalendarView() {
  const theme = useTheme();
  const { events, addEvent, updateEvent, deleteEvent } = useCalendarEvents();

  const [view, setView] = useState<View | 'year'>('month');
  const [date, setDate] = useState(new Date());
  const [calendarType, setCalendarType] = useState<'gregorian' | 'ethiopian'>(
    'gregorian',
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<LocalEvent | null>(null);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const onNavigate = useCallback((newDate: Date) => setDate(newDate), []);
  const onView = useCallback((newView: View | 'year') => setView(newView), []);

  const handleNavigateAction = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'TODAY') {
      setDate(new Date());
    } else if (action === 'PREV') {
      const newDate = new Date(date);
      if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
      else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
      else if (view === 'day') newDate.setDate(newDate.getDate() - 1);
      else if (view === 'year') newDate.setFullYear(newDate.getFullYear() - 1);
      setDate(newDate);
    } else if (action === 'NEXT') {
      const newDate = new Date(date);
      if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
      else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
      else if (view === 'day') newDate.setDate(newDate.getDate() + 1);
      else if (view === 'year') newDate.setFullYear(newDate.getFullYear() + 1);
      setDate(newDate);
    }
  };

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setSelectedEvent(null);
      setSelectedRange({ start, end });
      setIsDialogOpen(true);
    },
    [],
  );

  const handleSelectEvent = useCallback((event: LocalEvent) => {
    setSelectedEvent(event);
    setSelectedRange(null);
    setIsDialogOpen(true);
  }, []);

  const onEventDrop = useCallback(
    ({
      event,
      start,
      end,
    }: {
      event: CalendarEvent;
      start: string | Date;
      end: string | Date;
    }) => {
      // Optimistic update handled by hook + re-render
      updateEvent(event.id, {
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
      });
    },
    [updateEvent],
  );

  const onEventResize = useCallback(
    ({
      event,
      start,
      end,
    }: {
      event: CalendarEvent;
      start: string | Date;
      end: string | Date;
    }) => {
      updateEvent(event.id, {
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
      });
    },
    [updateEvent],
  );

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = theme.palette.primary.main;
    switch (event.color) {
      case 'green':
        backgroundColor = theme.palette.success.main;
        break;
      case 'red':
        backgroundColor = theme.palette.error.main;
        break;
      case 'yellow':
        backgroundColor = theme.palette.warning.main;
        break;
      case 'purple':
        backgroundColor = theme.palette.secondary.main;
        break;
      case 'blue':
      default:
        backgroundColor = theme.palette.primary.main;
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: theme.palette.primary.contrastText,
        border: '0px',
        display: 'block',
      },
    };
  };

  const currentLocalizer =
    calendarType === 'ethiopian' ? ethiopianLocalizer : gregorianLocalizer;

  const calendarEvents: CalendarEvent[] = events.map((e) => ({
    ...e,
    start: new Date(e.start),
    end: new Date(e.end),
  }));

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="rectangular" width={200} height={40} />
          <Skeleton variant="rectangular" width={300} height={40} />
        </Box>
        <Skeleton
          variant="rectangular"
          height="100%"
          sx={{ borderRadius: 2 }}
        />
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        height: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        borderRadius: 2,
        overflow: 'hidden', // Contain width
      }}
    >
      <CalendarToolbar
        date={date}
        view={view}
        onNavigate={handleNavigateAction}
        onView={onView}
        calendarType={calendarType}
        onToggleCalendarType={() =>
          setCalendarType((prev) =>
            prev === 'gregorian' ? 'ethiopian' : 'gregorian',
          )
        }
      />

      <Box
        sx={
          {
            flex: 1,
            overflow: 'hidden',
            minWidth: 0,
            // Define CSS variables for the external CSS file to use
            // using MUI CSS variables ensures they update automatically with theme changes
            '--rbc-bg-card': 'var(--mui-palette-background-paper)',
            '--rbc-bg-app': 'var(--mui-palette-background-default)',

            '--rbc-text-primary': 'var(--mui-palette-text-primary)',
            '--rbc-text-secondary': 'var(--mui-palette-text-secondary)',
            '--rbc-text-disabled': 'var(--mui-palette-text-disabled)',

            '--rbc-divider': 'var(--mui-palette-divider)',

            '--rbc-bg-hover': 'var(--mui-palette-action-hover)',
            '--rbc-bg-today':
              'color-mix(in srgb, var(--mui-palette-primary-main) 8%, transparent)',
            '--rbc-bg-selected':
              'color-mix(in srgb, var(--mui-palette-primary-main) 16%, transparent)',

            '--rbc-current-time': 'var(--mui-palette-secondary-main)',
            '--rbc-border-subtle':
              'color-mix(in srgb, var(--mui-palette-divider) 60%, transparent)',
          } as React.CSSProperties
        }
      >
        {view === 'year' ? (
          <YearView
            date={date}
            events={events}
            onView={onView}
            onNavigate={onNavigate}
          />
        ) : (
          <DnDCalendar
            localizer={currentLocalizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            toolbar={false}
            onSelectEvent={(event) =>
              handleSelectEvent(event as unknown as LocalEvent)
            }
            onSelectSlot={handleSelectSlot}
            selectable
            resizable
            onEventDrop={onEventDrop}
            onEventResize={onEventResize}
            view={view as View}
            onView={onView}
            date={date}
            onNavigate={onNavigate}
            eventPropGetter={eventStyleGetter}
            className={
              calendarType === 'ethiopian' ? 'ethiopian-calendar-mode' : ''
            }
            components={{
              timeGutterHeader: () => (
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--rbc-text-disabled)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    userSelect: 'none',
                  }}
                >
                  all day
                </span>
              ),
              month: {
                dateHeader: ({ label }: any) => {
                  if (calendarType === 'ethiopian') {
                    const dayNum = parseInt(label, 10);
                    const geezLabel = geezNumerals[dayNum] || label;
                    return <span>{geezLabel}</span>;
                  }
                  return <span>{label}</span>;
                },
              },
            }}
          />
        )}
      </Box>

      <EventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        event={selectedEvent}
        selectedRange={selectedRange}
        onSave={async (data) => {
          if (selectedEvent) {
            return updateEvent(selectedEvent.id, data);
          } else {
            return addEvent(data);
          }
        }}
        onDelete={async (id) => deleteEvent(id)}
      />
    </Paper>
  );
}
