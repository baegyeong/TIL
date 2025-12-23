import { type RELATION_LABELS } from "../constants/relation-labels";

export interface Node {
  id: string;
  title: string;
  category: string;
  importance: number;
}

interface Link {
  source: string;
  target: string;
  strength: number;
  type: keyof typeof RELATION_LABELS;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}
