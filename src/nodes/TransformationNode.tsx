import type { ZNode } from "@/viewer/utils";
import type { Transformation } from "@/lib/schema";
import { Handle, Position } from "@xyflow/react";
import { BadgeAlert, Code2, Columns3Cog } from "lucide-react";

export default function TransformationNode(node: ZNode) {
  const transformation = node.data as Transformation;
  return (
    <div className={!node.data.visible ? "opacity-0" : "node"}>
      {/* {node.id} */}
      <span className=" bg-sky-400 rounded-t px-4 py-2 text-white relative z-10 flex flex-row gap-2 items-center">
        {transformation.name === "View" ? <Columns3Cog /> : <Code2 />}
        {transformation.name}
      </span>
      <div className="flex w-full bg-sky-100 text-sm">
        {transformation.conditions.map((condition, index) => (
          <div
            className="px-4 py-2 w-full flex flex-row items-center gap-2"
            key={condition.id + condition.transformation_id + index}
          >
            <div className="grow">
              {condition.rule === "" ? condition.name : condition.rule}
            </div>
            <BadgeAlert className="text-sky-900 ml-auto" />
          </div>
        ))}
      </div>
      <div className="p-4 bg-white rounded-b shadow-l shadow-r flex flex-col gap-2 relative">
        <p className="whitespace-pre">{transformation.rule}</p>
        {/* <hr className="border-gray-200" /> */}
        <Handle
          className="handle absolute"
          id={`${transformation.id}-t`}
          type="target"
          position={Position.Left}
        />
        <Handle
          className="handle"
          id={`${transformation.id}-s`}
          type="source"
          position={Position.Right}
        />
      </div>
    </div>
  );
}
