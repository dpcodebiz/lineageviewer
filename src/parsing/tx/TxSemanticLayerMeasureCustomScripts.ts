//#region
import type { Field, Objects } from "@/lib/schema";
import type { ParserResult } from "../types";
// import { v4 } from "uuid";

export interface TxSemanticLayerMeasureCustomScript {
  SemanticLayerMeasureCustomScriptId: string;
  SemanticLayerMeasureId: string;
  Name: string;
  Script: string;
  EndpointType: string;
}

export function parseTxSemanticLayerMeasureCustomScript(
  obj: TxSemanticLayerMeasureCustomScript,
  objects: Objects
): ParserResult {
  const field = objects[obj.SemanticLayerMeasureId] as Field;

  if (field == undefined) {
    return {};
  }

  field.script = obj.Script;

  return {};
}
//#endregion
