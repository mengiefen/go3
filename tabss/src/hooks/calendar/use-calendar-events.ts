import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { LocalEvent, NewLocalEvent } from '@/types/calendar';

const STORAGE_KEY = 'calendar-events';

export function useCalendarEvents() {
  const [events, setEvents] = useState<LocalEvent[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load calendar events', e);
    }
  }, []);

  // Persist to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = useCallback((eventData: NewLocalEvent) => {
    const newEvent: LocalEvent = {
      id: uuidv4(),
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEvents((prev) => [...prev, newEvent]);
    return { success: true, message: 'Event created successfully' };
  }, []);

  const updateEvent = useCallback(
    (id: string, data: Partial<NewLocalEvent>) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id
            ? { ...event, ...data, updatedAt: new Date().toISOString() }
            : event,
        ),
      );
      return { success: true, message: 'Event updated successfully' };
    },
    [],
  );

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    return { success: true, message: 'Event deleted successfully' };
  }, []);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
