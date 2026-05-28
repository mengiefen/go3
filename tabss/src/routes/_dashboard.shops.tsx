import { createFileRoute } from '@tanstack/react-router';
import { ShopsPage } from '@/features/shops/ShopsPage';

export const Route = createFileRoute('/_dashboard/shops')({
  component: ShopsPage,
});

export { ShopsPage };
