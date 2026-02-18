import type { Objects, Warehouse } from "@/lib/schema";
import type { ParserResult } from "../types";

export interface TxSemanticLayerModel {
  SemanticLayerModelId: string;
  ProjectId: string;
  Name: string;
  EndpointTypesEnabled: string;
  ExecutionNumber: string;
}

export function parseTxSemanticLayerModel(
  obj: TxSemanticLayerModel,
  objects: Objects
): ParserResult {
  const warehouse: Warehouse = {
    id: obj.SemanticLayerModelId,
    name: obj.Name,
    order: -1,
    type: "warehouse",
    tx_link_type: "semantic",
    tables: [],
  };

  objects[warehouse.id] = warehouse;

  return {
    warehouses: [warehouse],
  };
}
