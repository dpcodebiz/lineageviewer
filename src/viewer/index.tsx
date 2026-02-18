import { useEffect } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  useNodesInitialized,
  Background,
  BackgroundVariant,
  MiniMap,
  type NodeTypes,
} from "@xyflow/react";

import { useLayoutedElements } from "@/lib/layout";
import { flowNodeTypes } from "@/nodes/utils";
import { getEdges, getNodes } from "@/data";
import { useDataStore } from "@/data/state";
import UI from "./ui";

const LayoutFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(getNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(getEdges());
  const { getLayoutedElements } = useLayoutedElements();
  const init = useNodesInitialized();
  const { setSettings, settings } = useDataStore((state) => state);

  useEffect(() => {
    if (!init) return;
    getLayoutedElements({
      "elk.algorithm": "layered",
      "elk.direction": "RIGHT",
      transformations: settings.transformations,
    });
  }, [init]);

  useEffect(() => {
    setEdges(getEdges());
  }, [settings]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={flowNodeTypes as unknown as NodeTypes}
      fitView
      minZoom={0.1}
      zoomOnDoubleClick={false}
      onNodeClick={(_, n) => {
        if (
          n.type != "table" ||
          settings.selection?.includes(n.id) ||
          settings.mode === "fields"
        ) {
          return; // Only allow to select tables that are not already selected
        }
        setSettings({ ...settings, selection: [n.data.id] });
        setNodes(getNodes());
        setEdges(getEdges());
      }}
    >
      <Background variant={BackgroundVariant.Dots} bgColor="#efefef" />
      <MiniMap zoomable pannable />
      <UI
        redrawCallback={() => {
          setNodes(getNodes());
          setEdges(getEdges());
        }}
      />
    </ReactFlow>
  );
};

export default function Flow() {
  return <LayoutFlow />;
}
