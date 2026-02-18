import type { Field, Objects } from "@/lib/schema";
import type { ParserResult } from "../types";
import { v4 } from "uuid";

export interface TxSemanticLayerField {
  SemanticLayerFieldId: string;
  SemanticLayerTableId: string;
  FieldId: string;
  Name: string;
  DataType: string;
  FieldType: string;
  ExecutionNumber: string;
  Hidden: string;
}

export function parseTxSemanticLayerField(
  obj: TxSemanticLayerField,
  objects: Objects
): ParserResult {
  const field: Field = {
    id: obj.SemanticLayerFieldId,
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
    relations: [
      {
        id: v4(),
        from_id: obj.FieldId,
        to_id: obj.SemanticLayerFieldId,
        type: "field-field",
        name: "",
        data: undefined,
      },
    ],
  };
}
