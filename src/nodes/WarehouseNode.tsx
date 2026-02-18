import type { ZNode } from "@/viewer/utils";
import type { Warehouse } from "@/lib/schema";
import { Handle, Position } from "@xyflow/react";
// import { Handle, Position } from "@xyflow/react";

export default function WarehouseNode(node: ZNode) {
  const warehouse = node.data as Warehouse;
  return (
    <div className={!node.data.visible ? "opacity-0" : ""}>
      <div className="p-4 bg-white rounded shadow">
        <span>{warehouse.name} </span>
        <Handle id={`${warehouse.id}`} type="target" position={Position.Top} />
        <Handle
          id={`${warehouse.id}`}
          type="source"
          position={Position.Bottom}
        />
      </div>
    </div>
  );
}
