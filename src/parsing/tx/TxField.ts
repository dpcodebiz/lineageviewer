import type { Field, Objects } from "@/lib/schema";
import type { ParserResult } from "../types";

export interface TxField {
  DataFieldId: string;
  DataTableId: string;
  SeqNo: string;
  Name: string;
  OrigName: string;
  DataType: string;
  StagingName: string;
  BaseType: string;
  OrigDataType: string;
  CharLength: string;
  NumericScale: string;
  NumericPrecision: string;
  IsPrimaryKey: string;
  IsChecked: string;
  IsCustom: string;
  IsRawOnly: string;
  FieldAggregationType: string;
  ExecutionNo: string;
  Locked: string;
  LockedOnStaging: string;
  HashingAlgorithm: string;
}

export function parseTxField(obj: TxField, objects: Objects): ParserResult {
  const field: Field = {
    id: obj.DataFieldId,
    name: obj.Name, // + " " + obj.DataFieldId.substring(0, 6),
    order: -1,
    type: "field",
    table_id: obj.DataTableId,
    table: undefined,
    datatype: obj.DataType,
    script: "",
  };

  objects[field.id] = field;

  return {
    fields: [field],
  };
}
