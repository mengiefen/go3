import type { LocalEvent } from '@/types/calendar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfYear,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfYear,
} from 'date-fns';

interface YearViewProps {
  date: Date;
  events: LocalEvent[];
  onView: (view: any) => void;
  onNavigate: (date: Date) => void;
}

export default function YearView({
  date,
  events,
  onView,
  onNavigate,
}: YearViewProps) {
  const theme = useTheme();
  const months = eachMonthOfInterval({
    start: startOfYear(date),
    end: endOfYear(date),
  });

  const handleDayClick = (day: Date) => {
    onNavigate(day);
    onView('day');
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        },
        gap: 3,
        p: 2,
        overflowY: 'auto',
        height: '100%',
      }}
    >
      {months.map((month) => {
        const days = eachDayOfInterval({
          start: startOfMonth(month),
          end: endOfMonth(month),
        });

        return (
          <Box
            key={month.toISOString()}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                boxShadow: 3,
              },
              transition: 'box-shadow 0.2s',
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              {format(month, 'MMMM')}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 0.5,
                textAlign: 'center',
              }}
            >
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <Typography
                  key={d}
                  variant="caption"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  {d}
                </Typography>
              ))}
              {/* Empty cells for start of month offset */}
              {Array.from({ length: startOfMonth(month).getDay() }).map(
                (_, i) => (
                  <Box key={`empty-${i}`} />
                ),
              )}
              {/* Days */}
              {days.map((day) => {
                const dayEvents = events.filter((e) =>
                  // new Date(e.start) because e.start is string in type but date in obj
                  isSameDay(new Date(e.start), day),
                );
                const hasEvents = dayEvents.length > 0;
                const isToday = isSameDay(day, new Date());

                return (
                  <IconButton
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    size="small"
                    sx={{
                      width: 28,
                      height: 28,
                      fontSize: '0.75rem',
                      bgcolor: isToday ? 'primary.main' : 'transparent',
                      color: isToday
                        ? 'primary.contrastText'
                        : !isSameMonth(day, month)
                          ? 'text.disabled'
                          : hasEvents
                            ? 'primary.main'
                            : 'text.primary',
                      fontWeight: hasEvents || isToday ? 'bold' : 'normal',
                      border:
                        !isToday && hasEvents
                          ? `1px solid ${theme.palette.primary.main}40`
                          : 'none',
                      '&:hover': {
                        bgcolor: isToday ? 'primary.dark' : 'action.hover',
                      },
                    }}
                  >
                    {format(day, 'd')}
                  </IconButton>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
