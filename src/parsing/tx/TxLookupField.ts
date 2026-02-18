import type { Field, Objects } from "@/lib/schema";
import type { ParserResult } from "../types";
import { v4 } from "uuid";

export interface TxLookupField {
  LookupFieldId: string;
  LookupDataFieldId: string;
  ConditionalLookupFieldId: string;
  Name: string;
  FunctionOperator: string;
  Locked: string;
  SqlMode: string;
  ExecutionNumber: string;
}

export function parseTxLookupField(
  obj: TxLookupField,
  objects: Objects
): ParserResult {
  const from_obj = objects[obj.LookupDataFieldId] as Field;
  const to_obj = objects[obj.ConditionalLookupFieldId] as Field;

  return {
    relations: [
      {
        id: v4(),
        from_id: obj.LookupDataFieldId,
        to_id: obj.ConditionalLookupFieldId,
        name: "",
        type: "field-field",
        data: undefined,
      },
      {
        id: v4(),
        from_id: from_obj.table_id,
        to_id: to_obj.table_id,
        name: "",
        type: "table-table",
        data: undefined,
      },
    ],
  };
}
