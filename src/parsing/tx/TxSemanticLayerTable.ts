import type { Objects, Table } from "@/lib/schema";
import type { ParserResult } from "../types";
import { v4 } from "uuid";

export interface TxSemanticLayerTable {
  SemanticLayerTableId: string;
  SemanticLayerModelId: string;
  TableId: string;
  Name: string;
  TableCategory: string;
  ExecutionNumber: string;
}

export function parseTxSemanticLayerTable(
  obj: TxSemanticLayerTable,
  objects: Objects
): ParserResult {
  const table: Table = {
    id: obj.SemanticLayerTableId,
    name: obj.Name,
    order: -1,
    type: "table",
    fields: [],
    isView: false,
    definition: "",
    fieldsShown: [],
    warehouse_id: obj.SemanticLayerModelId,
    connection_id: undefined,
    warehouse: undefined,
  };

  objects[table.id] = table;

  return {
    tables: [table],
    relations: [
      {
        id: v4(),
        from_id: obj.TableId,
        to_id: obj.SemanticLayerTableId,
        name: obj.SemanticLayerTableId,
        type: "table-table",
        data: undefined,
      },
    ],
  };
}
