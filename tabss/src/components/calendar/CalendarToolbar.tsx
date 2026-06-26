import {
  Button,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import type { View } from 'react-big-calendar';

interface CalendarToolbarProps {
  date: Date;
  view: View | 'year';
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onView: (view: View | 'year') => void;
  calendarType: 'gregorian' | 'ethiopian';
  onToggleCalendarType: () => void;
}

export default function CalendarToolbar({
  date,
  view,
  onNavigate,
  onView,
  calendarType,
  onToggleCalendarType,
}: CalendarToolbarProps) {
  const label = () => {
    if (view === 'year') {
      return format(date, 'yyyy');
    }
    if (view === 'month') {
      return format(date, 'MMMM yyyy');
    }
    if (view === 'week') {
      return format(date, 'MMMM yyyy');
    }
    if (view === 'day') {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
    return format(date, 'MMMM yyyy');
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      mb={2}
      p={1}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Button variant="outlined" onClick={() => onNavigate('TODAY')}>
          {calendarType === 'ethiopian' ? 'ዛሬ (Today)' : 'Today'}
        </Button>
        <IconButton onClick={() => onNavigate('PREV')}>
          <ChevronLeft size={20} />
        </IconButton>
        <IconButton onClick={() => onNavigate('NEXT')}>
          <ChevronRight size={20} />
        </IconButton>
        <Typography variant="h6" fontWeight="bold" ml={2}>
          {label()}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, newView) => {
            if (newView) onView(newView);
          }}
          size="small"
        >
          <ToggleButton value="month">Month</ToggleButton>
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="day">Day</ToggleButton>
          <ToggleButton value="year">Year</ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="outlined"
          size="small"
          onClick={onToggleCalendarType}
          startIcon={<Globe size={16} />}
        >
          {calendarType === 'ethiopian' ? 'Ethiopian' : 'Gregorian'}
        </Button>
      </Stack>
    </Stack>
  );
}
