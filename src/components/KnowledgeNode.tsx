import { Handle, Position } from "@xyflow/react";
import { CATEGORY_COLORS } from "../constants/category-colors";
import { wrapTitle } from "../utils/wrap-title";

export const KnowledgeNode = ({ data }: any) => {
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
        fontSize: 12,
        lineHeight: 1.4,
      }}
    >
      <strong>{wrapTitle(data.title)}</strong>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
