import { v4 } from "uuid";
import type { ParserResult } from "../types";

export interface TxDataWarehouseMappingTable {
  DataWarehouseMappingTableId: string;
  DestinationTableId: string;
  SourceTableId: string;
  SeqNo: string;
}

export function parseTxDataWarehouseMappingTable(
  obj: TxDataWarehouseMappingTable
): ParserResult {
  return {
    relations: [
      {
        id: v4(),
        from_id: obj.SourceTableId,
        to_id: obj.DestinationTableId,
        name: obj.DataWarehouseMappingTableId,
        type: "table-table",
        data: undefined,
      },
    ],
  };
}
