import { v4 } from "uuid";
import type { ParserResult } from "../types";

export interface TxDataMovementRelation {
  DataMovementRelationId: string;
  ProjectId: string;
  SourceDataFieldId: string;
  DestinationDataFieldId: string;
  Locked: string;
}

export function parseTxDataMovementRelation(
  obj: TxDataMovementRelation
): ParserResult {
  return {
    relations: [
      {
        id: v4(),
        from_id: obj.SourceDataFieldId,
        to_id: obj.DestinationDataFieldId,
        name: obj.ProjectId,
        type: "field-field",
        data: undefined,
      },
    ],
  };
}
