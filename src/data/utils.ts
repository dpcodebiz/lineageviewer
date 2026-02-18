import type { Warehouse } from "@/lib/schema";

/**
 * Sets a local order attribute on each warehouse based on the index of the warehouse in the sorted set
 */
export function computeWarehousesOrder(warehouses: Warehouse[]) {
  const wSorted = warehouses.sort((a, b) => a.id.localeCompare(b.id));

  warehouses.forEach((w) => {
    w.order = wSorted.findIndex((wSorted) => wSorted.id === w.id);
  });
}
