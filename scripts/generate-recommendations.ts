import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const GRAPH_PATH = path.join(
  process.cwd(),
  "static",
  "data",
  "knowledge-graph.json"
);
const OUTPUT_DIR = path.join(process.cwd(), "meta", "recommendations");
const OUTPUT_PATH = path.join(OUTPUT_DIR, `${today()}.md`);

interface GraphNode {
  id: string;
  title: string;
  category: string;
  importance?: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  strength: number;
}

interface Graph {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface ConnectionSuggestion {
  topic: string;
  connects: string[];
}

interface RecommendationResult {
  highPriority: string[];
  weakAreas: string[];
  connections: ConnectionSuggestion[];
}

/* =========================
 * 1. 그래프 로드
 ========================= */
async function loadGraph(): Promise<Graph> {
  const raw = await fs.readFile(GRAPH_PATH, "utf8");
  return JSON.parse(raw) as Graph;
}

/* =========================
 * 2. Gemini 추천 생성
 ========================= */
async function generateRecommendations(
  graph: Graph
): Promise<RecommendationResult> {
  const nodeSummaries = graph.nodes
    .map(
      (n) => `
ID: ${n.id}
Title: ${n.title}
Category: ${n.category}
Importance: ${n.importance ?? 1}
`
    )
    .join("\n");

  const linkSummaries = graph.links
    .map(
      (l) => `
${l.source} -> ${l.target}
Type: ${l.type}
Strength: ${l.strength}
`
    )
    .join("\n");

  const prompt = `
다음은 프론트엔드 TIL 지식 그래프입니다.

[Nodes]
${nodeSummaries}

[Links]
${linkSummaries}

이 그래프를 분석하여 "오늘 작성하면 좋은 TIL 주제"를 추천하세요.

조건:
- 기존 TIL과 완전히 중복되는 주제는 제외
- 약한 연결 영역을 우선
- 연결 확장 주제 포함

JSON 형식으로만 응답하세요.

{
  "highPriority": ["주제"],
  "weakAreas": ["주제"],
  "connections": [
    {
      "topic": "주제",
      "connects": ["TIL ID"]
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" },
  });

  const text = response.candidates?.[0]?.content?.parts
    ?.map((p) => p.text)
    .join("");

  if (!text) throw new Error("Gemini 응답이 비어 있음");

  return JSON.parse(text) as RecommendationResult;
}

/* =========================
 * 3. Markdown 변환
 ========================= */
function toMarkdown(result: RecommendationResult): string {
  return `# 📌 TIL Recommendations (${today()})

## 🔥 High Priority
${result.highPriority.map((t) => `- ${t}`).join("\n")}

## ⚠️ Weak Areas
${result.weakAreas.map((t) => `- ${t}`).join("\n")}

## 🔗 Connection Suggestions
${result.connections
  .map(
    (c) =>
      `- **${c.topic}**  \n  ↳ connects: ${c.connects.join(", ")}`
  )
  .join("\n")}
`;
}

/* =========================
 * 4. 실행
 ========================= */
async function main() {
  console.log("📊 Loading graph...");
  const graph = await loadGraph();

  console.log("🤖 Generating recommendations...");
  const result = await generateRecommendations(graph);

  const markdown = toMarkdown(result);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_PATH, markdown);

  console.log(`✅ Recommendation saved: ${OUTPUT_PATH}`);
}

main();
