import type { ParserResult } from "../types";

export interface TxTableInsert {
  TableInsertId: string;
  DestinationTableId: string;
  SourceTableId: string;
  Name: string;
  DestinationTableType: string;
  ExecutionNumber: string;
}

export function parseTxTableInsert(obj: TxTableInsert): ParserResult {
  return {
    relations: [
      {
        id: obj.TableInsertId,
        from_id: obj.SourceTableId ?? obj.DestinationTableId, // when custom table insert, source table Id is empty
        to_id: obj.DestinationTableId,
        name: obj.TableInsertId,
        type: "table-table",
        data: undefined,
      },
    ],
  };
}
