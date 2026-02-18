import type { Field, Table, Transformation, Warehouse } from "@/lib/schema";
import type { Node } from "@xyflow/react";

export type ZNode = Node & {
  data: ZNodeData;
};

export type ZNodeData = (Warehouse | Table | Field | Transformation) & {
  visible: boolean;
};
