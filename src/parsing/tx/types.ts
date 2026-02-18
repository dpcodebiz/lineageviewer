import type { Objects } from "@/lib/schema";
import type { ParserResult } from "../types";
import { parseTxCondition, type TxCondition } from "./TxCondition";
import {
  parseTxDataMovementRelation,
  type TxDataMovementRelation,
} from "./TxDataMovementRelation";
import { parseTxDataSource, type TxDataSource } from "./TxDataSource";
import {
  parseTxDataWarehouseMappingTable,
  type TxDataWarehouseMappingTable,
} from "./TxDataWarehouseMappingTable";
import { parseTxField, type TxField } from "./TxField";
import {
  parseTxSemanticLayerField,
  type TxSemanticLayerField,
} from "./TxSemanticLayerField";
import {
  parseTxSemanticLayerModel,
  type TxSemanticLayerModel,
} from "./TxSemanticLayerModel";
import {
  parseTxSemanticLayerTable,
  type TxSemanticLayerTable,
} from "./TxSemanticLayerTable";
import {
  parseTxSqlServerConnection,
  type TxSqlServerConnection,
} from "./TxSqlServerConnection";
import { parseTxTable, type TxTable } from "./TxTable";
import { parseTxTableInsert, type TxTableInsert } from "./TxTableInsert";
import {
  parseTxTransformation,
  type TxTransformation,
} from "./TxTransformation";
import { parseTxView, type TxView } from "./TxView";
import {
  parseTxViewDefinition,
  type TxViewDefinition,
} from "./TxViewDefinition";
import { parseTxWarehouse, type TxWarehouse } from "./TxWarehouse";
import { parseTxLookupField, type TxLookupField } from "./TxLookupField";
import {
  parseTxSemanticLayerMeasure,
  type TxSemanticLayerMeasure,
} from "./TxSemanticLayerMeasure";
import {
  parseTxSemanticLayerMeasureCustomScript,
  type TxSemanticLayerMeasureCustomScript,
} from "./TxSemanticLayerMeasureCustomScripts";

export type TxObject =
  | { type: "DataSources"; data: TxDataSource }
  | { type: "DataFields"; data: TxField }
  | { type: "DataTables"; data: TxTable }
  | { type: "DataWarehouses"; data: TxWarehouse }
  | { type: "SemanticLayerFields"; data: TxSemanticLayerField }
  | { type: "SemanticLayerMeasures"; data: TxSemanticLayerMeasure }
  | { type: "SemanticLayerTables"; data: TxSemanticLayerTable }
  | { type: "SemanticLayerModels"; data: TxSemanticLayerModel }
  | { type: "SqlServerConnections"; data: TxSqlServerConnection }
  | { type: "DataMovementRelations"; data: TxDataMovementRelation }
  | { type: "DataWarehouseMappingTables"; data: TxDataWarehouseMappingTable }
  | { type: "TableInserts"; data: TxTableInsert }
  | { type: "Transformations"; data: TxTransformation }
  | { type: "Conditions"; data: TxCondition }
  | { type: "Views"; data: TxView }
  | { type: "ViewDefinitions"; data: TxViewDefinition }
  | { type: "LookupFields"; data: TxLookupField }
  | {
      type: "SemanticLayerMeasureCustomScripts";
      data: TxSemanticLayerMeasureCustomScript;
    };

export type TxObjectParserMapping = {
  [index in TxObject["type"]]: (
    _: Extract<TxObject, { type: index }>["data"],
    _2: Objects
  ) => ParserResult;
};

export const txParsers: TxObjectParserMapping = {
  DataSources: parseTxDataSource,
  DataFields: parseTxField,
  DataTables: parseTxTable,
  DataWarehouses: parseTxWarehouse,
  SemanticLayerFields: parseTxSemanticLayerField,
  SemanticLayerMeasures: parseTxSemanticLayerMeasure,
  SemanticLayerTables: parseTxSemanticLayerTable,
  SemanticLayerModels: parseTxSemanticLayerModel,
  SqlServerConnections: parseTxSqlServerConnection,
  DataMovementRelations: parseTxDataMovementRelation,
  DataWarehouseMappingTables: parseTxDataWarehouseMappingTable,
  TableInserts: parseTxTableInsert,
  Transformations: parseTxTransformation,
  Conditions: parseTxCondition,
  Views: parseTxView,
  ViewDefinitions: parseTxViewDefinition,
  LookupFields: parseTxLookupField,
  SemanticLayerMeasureCustomScripts: parseTxSemanticLayerMeasureCustomScript,
};
