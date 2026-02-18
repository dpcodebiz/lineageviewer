import type { Field, Objects } from "@/lib/schema";
import type { ParserResult } from "../types";
// import { v4 } from "uuid";

export interface TxSemanticLayerMeasure {
  SemanticLayerMeasureId: string;
  SemanticLayerTableId: string;
  Name: string;
  DataType: string;
  MeasureType: string;
  ExecutionNumber: string;
  Hidden: string;
}

export function parseTxSemanticLayerMeasure(
  obj: TxSemanticLayerMeasure,
  objects: Objects
): ParserResult {
  const field: Field = {
    id: obj.SemanticLayerMeasureId,
    name: obj.Name,
    order: -1,
    type: "field",
    table_id: obj.SemanticLayerTableId,
    table: undefined,
    datatype: obj.DataType,
    script: "",
  };

  objects[field.id] = field;

  return {
    fields: [field],
    relations: [],
  };
}
