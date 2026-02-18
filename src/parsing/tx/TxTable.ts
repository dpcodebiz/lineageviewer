import type { Objects, Table } from "@/lib/schema";
import type { ParserResult } from "../types";

export interface TxTable {
  DataTableId: string;
  DataSourceId: string;
  SqlServerConnectionId: string;
  Name: string;
  SchemaName: string;
  StagingName: string;
  OrigName: string;
  IsChecked: string;
  TableType: string;
  NullCheckAllowNulls: string;
  NullCheckApproach: string;
  Locked: string;
  LockedOnStaging: string;
  TruncateRawBeforeTransfere: string;
  TruncateValidBeforeTransfere: string;
  TruncateRawAfterCleansing: string;
  KeepErrorsAndWarnings: string;
  ShowControlFields: string;
  IsDirty: string;
}

export function parseTxTable(obj: TxTable, objects: Objects): ParserResult {
  const table: Table = {
    id: obj.DataTableId,
    name: obj.Name,
    order: -1,
    type: "table",
    fields: [],
    fieldsShown: [],
    warehouse_id: obj.DataSourceId,
    connection_id: obj.SqlServerConnectionId,
    warehouse: undefined,
    isView: false,
    definition: "",
  };

  objects[table.id] = table;

  return {
    tables: [table],
  };
}
