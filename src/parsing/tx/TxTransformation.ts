import type { Objects, Transformation } from "@/lib/schema";
import type { ParserResult } from "../types";

export interface TxTransformation {
  TransformationId: string;
  DataFieldId: string;
  ExecutionNo: string;
  RuleType: string;
  RuleValue: string;
  Locked: string;
}

export function parseTxTransformation(
  obj: TxTransformation,
  objects: Objects
): ParserResult {
  const transformation: Transformation = {
    id: obj.TransformationId,
    name: obj.RuleType,
    order: 0,
    field_id: obj.DataFieldId,
    type: "transformation",
    rule: obj.RuleValue,
    conditions: [],
  };

  objects[transformation.id] = transformation;

  return {
    transformations: [transformation],
  };
}
