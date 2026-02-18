import type { Objects, Table, Warehouse } from "@/lib/schema";
import type { ParserResult } from "../types";
import { crash } from "@/lib/debug";

export interface TxSqlServerConnection {
  SqlServerConnectionId: string;
  DataWarehouseId: string;
  GlobalDatabaseId: string;
  UseGlobalDatabase: string;
  Server: string;
  SSISServerName: string;
  Authentication: string;
  Password: string;
  UserName: string;
  CatalogName: string;
  CommandTimeOut: string;
  ConnectionTimeOut: string;
  ConnectionStringProperties: string;
  UseSSISApproach: string;
  MaxRowsToCopy: string;
  DeploymentTarget: string;
  UserCollation: string;
  SecurityRoleDropOption: string;
  DirectReadOption: string;
  SSLOption: string;
  SSISVersion: string;
  SSISAuthentication: string;
  SSISPassword: string;
  SSISUserName: string;
  ODXUseAzureDataFactory: string;
  ODXAzureDataFactoryTenantId: string;
  ODXAzureDataFactoryAppId: string;
  ODXAzureDataFactoryAppSecret: string;
  ODXAzureDataFactoryResoruceGroup: string;
  ODXAzureDataFactorySubscriptionId: string;
  ODXAzureDataFactoryName: string;
  ODXAzureDataFactoryFolderName: string;
  ODXAzureDataFactoryIntegratedRuntimeName: string;
  ODXAzureDataFactoryConnectionTimeout: string;
  ODXAzureDataFactoryActivityTimeout: string;
}

export function parseTxSqlServerConnection(
  obj: TxSqlServerConnection,
  objects: Objects
): ParserResult {
  const tables = Object.values(objects).filter(
    (o) =>
      //@ts-expect-error useless error
      o?.type === "table" &&
      (o as Table).connection_id === obj.SqlServerConnectionId
  ) as Table[];
  const warehouse = objects[obj.DataWarehouseId] as Warehouse;

  if (warehouse === undefined) {
    crash("Couldn't find warehouse", [obj, objects]);
  }

  tables.forEach((table) => {
    table.warehouse_id = warehouse.id;
  });

  return {};
}
