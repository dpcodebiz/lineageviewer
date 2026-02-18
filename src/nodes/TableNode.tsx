import type { ZNode } from "@/viewer/utils";
import { Handle, Position } from "@xyflow/react";

import { clsx, getIconFromDataType } from "./utils";
import type { Table } from "@/lib/schema";
import { wDefaultStyles } from "@/data/config";
import { useDataStore } from "@/data/state";
import { CornerDownRight } from "lucide-react";

export default function TableNode(node: ZNode) {
  const settings = useDataStore((state) => state.settings);
  const setSettings = useDataStore((state) => state.setSettings);
  const table = node.data as Table;

  return (
    <div className={!node.data.visible ? "opacity-0" : ""}>
      <div className={clsx("node relative")}>
        {settings.selection?.includes(table.id) && (
          <div className="absolute left-0 right-0 top-0 bottom-0 rounded ring-4 ring-gray-900 animate-pulse"></div>
        )}
        <div className="flex flex-row gap-4 w-full py-3 px-6 relative">
          {settings.mode === "fields" && (
            <Handle
              className="handle big absolute"
              id={`${table.id}-t`}
              type="target"
              position={Position.Left}
            />
          )}
          <span className="font-bold my-auto">{table.name}</span>
          <div className="ml-auto flex flex-row gap-2">
            <div
              className={clsx(
                "px-3 py-1 rounded-xl w-max my-auto h-max",
                wDefaultStyles[table.warehouse?.order ?? 0] ?? wDefaultStyles[0]
              )}
            >
              {table.warehouse?.name}
            </div>
          </div>
          {settings.mode === "fields" && (
            <Handle
              className="handle big absolute"
              id={`${table.id}-s`}
              type="source"
              position={Position.Right}
            />
          )}
        </div>
        <hr className="border-gray-100" />
        <div
          className={clsx(
            "relative",
            settings.transformations &&
              table.definition != undefined &&
              table.definition != ""
              ? ""
              : "hidden"
          )}
        >
          <p className={clsx("whitespace-pre p-4 bg-gray-50")}>
            {table.definition}
          </p>
          <hr className="border-gray-100" />
        </div>
        <div className="flex flex-col divide-y-1 divide-gray-100 noclick">
          {settings.mode === "fields" &&
            table.fieldsShown.map((f) => (
              <>
                <div
                  className="relative"
                  key={f.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSettings({
                      ...settings,
                      highlight: settings.highlight === f.id ? undefined : f.id,
                    });
                  }}
                >
                  <div
                    className={clsx(
                      "px-6 py-0.5",
                      settings.search.trim() != "" &&
                        f.name
                          .toLowerCase()
                          .includes(settings.search.toLowerCase())
                        ? "bg-amber-200 hover:bg-amber-300"
                        : "hover:bg-gray-50",
                      settings.highlight === f.id
                        ? "bg-blue-600 hover:bg-blue-800! text-white"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <Handle
                      className="handle absolute top-1/2!"
                      id={`${f.id}-t`}
                      type="target"
                      position={Position.Left}
                    />
                    <div className={clsx("grid grid-cols-7 gap-2")}>
                      <div className="col-span-1 flex items-center">
                        {getIconFromDataType(f.datatype)}
                      </div>
                      <div className="col-span-3">{f.name}</div>
                      <span className="flex items-center col-span-3">
                        {f.datatype}
                      </span>
                    </div>
                    <Handle
                      className="handle absolute top-1/2!"
                      id={`${f.id}-s`}
                      type="source"
                      position={Position.Right}
                    />
                  </div>
                </div>
                {settings.transformations && f.script != "" && (
                  <div className="relative">
                    <div className={clsx("px-6 py-0.5", "bg-orange-50")}>
                      <div className={clsx("grid grid-cols-7 gap-2")}>
                        <div className="col-span-1 flex items-center">
                          <div className="ml-2">
                            <CornerDownRight className="text-gray-700" />
                          </div>
                        </div>
                        <div className="col-span-6">{f.script}</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
        </div>
        {settings.mode === "tables" && (
          <>
            <Handle
              className="handle"
              id={`${table.id}-t`}
              type="target"
              position={Position.Left}
            />
            <Handle
              className="handle"
              id={`${table.id}-s`}
              type="source"
              position={Position.Right}
            />
          </>
        )}
      </div>
    </div>
  );
}
