import type { Objects, Warehouse } from "@/lib/schema";
import type { ParserResult } from "../types";

export interface TxWarehouse {
  DataWarehouseId: string;
  ProjectId: string;
  Name: string;
  Locked: string;
  ExecutionNo: string;
  SimpleModeBehavior: string;
}

export function parseTxWarehouse(
  obj: TxWarehouse,
  objects: Objects
): ParserResult {
  const warehouse: Warehouse = {
    id: obj.DataWarehouseId,
    name: obj.Name,
    order: -1,
    type: "warehouse",
    tx_link_type: "warehouse",
    tables: [],
  };

  objects[warehouse.id] = warehouse;

  return {
    warehouses: [warehouse],
  };
}
