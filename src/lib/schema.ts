export type Warehouse = ZEntity & {
  tables: Table[];
  /**
   * Possible values:
   * - warehouse : TX Warehouse
   * - semantic : TX Semantic Layer
   * - source : ODX Source Connector
   */
  tx_link_type: "warehouse" | "semantic" | "source";
};
export type Table = ZEntity & {
  warehouse_id: string | undefined;
  connection_id: string | undefined;
  warehouse: Warehouse | undefined;
  fields: Field[];
  fieldsShown: Field[];
  isView: boolean;
  definition: string;
};

export type Field = ZEntity & {
  table_id: string;
  table: Table | undefined;
  datatype: string;
  script: string;
};

export type Relation = {
  id: string;
  name: string;
  type:
    | "field-field"
    | "table-table"
    | "warehouse-table"
    | "field-transformation" // <--- manually reconstructed when a transformation and a field point to the same field
    | "transformation-field"; // <--- manually reconstructed when a transformation and a field point to the same field
  from_id: string;
  to_id: string;
  data: undefined;
};

export type Transformation = ZEntity & {
  field_id: string;
  rule: string;
  conditions: Condition[];
};

export type Condition = {
  id: string;
  name: string;
  transformation_id: string;
  transformation: Transformation | undefined;
  rule: string;
};

export type ZEntity = {
  id: string;
  name: string;
  type: "warehouse" | "table" | "field" | "transformation";
  order: number;
};

export type WarehouseConnection = {
  connection_id: string;
  warehouse_id: string;
};

export type Objects = {
  [index: string]: Warehouse | Table | Field | Transformation | Condition;
};

/**
 * Model used by the app that contains all the required data to visualize a flow
 */
export type Model = {
  objects: Objects;
  relations: Relation[];
  warehouses: Warehouse[];
  tables: Table[];
  fields: Field[];
  transformations: Transformation[];
  conditions: Condition[];
};
