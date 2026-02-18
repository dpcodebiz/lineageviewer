import type { Objects, Warehouse } from "@/lib/schema";
import type { ParserResult } from "../types";

export interface TxDataSource {
  DataSourceId: string;
  BusinessUnitId: string;
  GlobalDatabaseId: string;
  UseGlobalDatabase: string;
  Name: string;
  Locked: string;
  ConvertOutOfRangeDatesToSQLMinMax: string;
  ConnectionStringProperties: string;
  CommandTimeOut: string;
  ConnectionTimeOut: string;
  UseSSISApproach: string;
  TablePrefix: string;
  ManualTablePrefix: string;
  DateTimeConversion: string;
  MaxExecutionThreads: string;
  AllowExecutionFailure: string;
  SimpleModeBehavior: string;
  MetaDataExtractType: string;
  ExtractFullColumnsCache: string;
  BitVersion: string;
}

export function parseTxDataSource(
  obj: TxDataSource,
  objects: Objects
): ParserResult {
  const warehouse: Warehouse = {
    id: obj.DataSourceId,
    name: obj.Name,
    order: -1,
    type: "warehouse",
    tx_link_type: "semantic",
    tables: [],
  };

  objects[warehouse.id] = warehouse;

  return {
    warehouses: [warehouse],
  };
}
