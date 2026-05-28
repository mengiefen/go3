import CalendarView from '@/components/calendar/CalendarView';
import { Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/calendar')({
  component: CalendarPage,
});

export function CalendarPage() {
  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <CalendarView />
    </Box>
  );
}
