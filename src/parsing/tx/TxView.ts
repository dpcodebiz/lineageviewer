import type { Objects, Table } from "@/lib/schema";
import type { ParserResult } from "../types";

export interface TxView {
  ViewId: string;
  Outerjoin: string;
}

export function parseTxView(obj: TxView, objects: Objects): ParserResult {
  const view: Table = {
    isView: true,
    id: obj.ViewId + "-v",
    name: obj.ViewId,
    order: -1,
    fields: [],
    fieldsShown: [],
    type: "table",
    warehouse_id: undefined,
    connection_id: undefined,
    warehouse: undefined,
    definition: "", // Empty because defined inside ViewDefinition
  };

  objects[view.id] = view;

  return {
    // tables: [view], // Removed because not used actually
  };
}
