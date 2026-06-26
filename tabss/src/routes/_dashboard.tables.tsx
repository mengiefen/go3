import { createFileRoute } from '@tanstack/react-router';
import { TablesPage } from '@/features/tables/TablesPage';

export const Route = createFileRoute('/_dashboard/tables')({
  component: TablesPage,
});

export { TablesPage };
