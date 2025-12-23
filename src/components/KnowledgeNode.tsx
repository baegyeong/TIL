import { Handle, Position } from "@xyflow/react";
import { CATEGORY_COLORS } from "../constants/category-colors";
import { wrapTitle } from "../utils/wrap-title";
import { Node } from "../types/graph-data";

export const KnowledgeNode = ({ data }: { data: Node }) => {
  const color = CATEGORY_COLORS[data.category] ?? CATEGORY_COLORS.default;

  return (
    <div
      style={{
        background: color,
        borderRadius: 10,
        padding: "10px 12px",
        border: "1px solid #374151",
        minWidth: 120,
        textAlign: "center",
        whiteSpace: "pre-line",
        lineHeight: 1.4,
      }}
    >
      <strong style={{ fontSize: 12 }}>{wrapTitle(data.title)}</strong>
      <div style={{ fontSize: 10, color: "#616161ff" }}>{data.category}</div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
