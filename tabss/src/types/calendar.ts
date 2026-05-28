export type LocalEvent = {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  allDay: boolean;
  description?: string | null;
  color?: string | null; // 'blue', 'green', 'red', 'yellow', 'purple'
  createdAt: string;
  updatedAt: string;
};

export type NewLocalEvent = Omit<LocalEvent, 'id' | 'createdAt' | 'updatedAt'>;
