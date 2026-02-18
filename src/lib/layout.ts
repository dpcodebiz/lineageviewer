import { useCallback } from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import { useReactFlow, type Node } from "@xyflow/react";
import type { ZNode } from "@/viewer/utils";
import type { Table } from "./schema";
import { crash } from "./debug";
import { useDataStore } from "@/data/state";

const elk = new ELK();

type ElkOptions = {
  "elk.algorithm": string;
  "elk.direction": string;
  transformations: boolean;
};

export const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    "elk.algorithm": "layered",
    "elk.layered.spacing.nodeNodeBetweenLayers": 200,
    "elk.spacing.nodeNode": 100,
    transformations: false,
  };

  const getLayoutedElements = useCallback((options: ElkOptions) => {
    const layoutOptions = { ...defaultOptions, ...options };
    const graph = {
      id: "root",
      layoutOptions: layoutOptions,
      children: getNodes().map((node) => {
        switch (node.type) {
          case "transformation":
            return getTransformationNodeProperties(node);
          case "table":
            return getTableNodeProperties(node, options.transformations);
        }
      }),
      edges: getEdges().map((e) => ({
        ...e,
      })),
    };

    getEdges().forEach((edge) => {
      if (
        edge.source === undefined ||
        edge.target === undefined ||
        edge.sourceHandle === undefined ||
        edge.targetHandle === undefined
      )
        crash("edge is invalid", edge, useDataStore.getState());
    });

    // @ts-expect-error todo fix typing
    elk.layout(graph).then(({ children }) => {
      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      children?.forEach((node) => {
        (node as ZNode).position = { x: node.x ?? 0, y: node.y ?? 0 };
        (node as ZNode).data.visible = true;
      });

      setNodes(children as ZNode[]);
      fitView();
    });
  }, []);

  return { getLayoutedElements };
};

const getTransformationNodeProperties = (node: Node) => {
  return {
    ...node,
    width: node.measured?.width,
    height: node.measured?.height,
    draggable: false,
    ports: [
      { id: `${node.id}-s`, properties: { side: "EAST" } },
      { id: `${node.id}-t`, properties: { side: "WEST" } },
    ],
  };
};

const getTableNodeProperties = (node: Node, transformations: boolean) => {
  const table = node.data as Table;
  const fieldTargetPorts = table.fields.flatMap((f) => [
    {
      id: `${f.id}-t`,
      properties: {
        side: "WEST",
      },
    },
    {
      id: `${f.id}-s`,
      properties: {
        side: "EAST",
      },
    },
  ]);
  const tablePorts = [
    { id: `${node.id}-t`, properties: { side: "WEST" } },
    { id: `${node.id}-s`, properties: { side: "EAST" } },
  ];

  return {
    ...node,
    width: node.measured?.width,
    height: node.measured?.height,
    draggable: false,
    ports: transformations ? [...tablePorts, ...fieldTargetPorts] : tablePorts,
  };
};
