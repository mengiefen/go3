import CalendarView from '@/components/calendar/CalendarView';
import { Box } from '@mui/material';

export function CalendarPage() {
  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <CalendarView />
    </Box>
  );
}
