import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  MiniMap,
  EdgeChange,
  NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useBaseUrl from "@docusaurus/useBaseUrl";

import graphData from "@site/static/data/knowledge-graph.json";

import { KnowledgeNode } from "./KnowledgeNode";
import { applyDagreLayout } from "../utils/layout";
import { RELATION_LABELS } from "../constants/relation-labels";

const nodeTypes = {
  knowledge: KnowledgeNode,
};

const KnowledgeGraph = () => {
  const docsBaseUrl = useBaseUrl("/docs");

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = graphData.nodes.map((n) => ({
      id: n.id,
      type: "knowledge",
      position: { x: 0, y: 0 },
      data: n,
    }));

    const edges: Edge[] = graphData.links.map((l, i) => ({
      id: `e-${i}`,
      source: l.source,
      target: l.target,
      type: "smoothstep",
      label: RELATION_LABELS[l.type] ?? l.type,
      animated: l.strength >= 4,
    }));

    const layoutedNodes = applyDagreLayout(nodes, edges, "LR");

    return {
      initialNodes: layoutedNodes,
      initialEdges: edges,
    };
  }, []);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback((changes: NodeChange<Node>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - var(--ifm-navbar-height))",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => {
          window.location.href = `${docsBaseUrl}/${node.id}`;
        }}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default KnowledgeGraph;
