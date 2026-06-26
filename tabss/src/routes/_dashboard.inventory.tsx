import { createFileRoute } from '@tanstack/react-router';
import { InventoryPage } from '@/features/inventory/InventoryPage';

export const Route = createFileRoute('/_dashboard/inventory')({
  component: InventoryPage,
});

export { InventoryPage };
