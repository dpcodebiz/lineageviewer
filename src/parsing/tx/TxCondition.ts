import type { Condition, Objects } from "@/lib/schema";
import type { ParserResult } from "../types";

export interface TxCondition {
  ConditionId: string;
  TransformationId: string;
  SeqNo: string;
  RuleType: string;
  RuleValue: string;
  Locked: string;
}

export function parseTxCondition(
  obj: TxCondition,
  objects: Objects
): ParserResult {
  const condition: Condition = {
    id: obj.ConditionId,
    name: obj.RuleType,
    transformation_id: obj.TransformationId,
    transformation: undefined,
    rule: obj.RuleValue,
  };

  objects[condition.id] = condition;

  return {
    conditions: [condition],
  };
}
