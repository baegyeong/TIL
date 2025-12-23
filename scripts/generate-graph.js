import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/* =========================
 * 1. TIL 파일 읽기
 ========================= */
async function getAllTILs() {
  const docsPath = path.join(__dirname, "..", "docs");
  const tils = [];

  const categories = await fs.readdir(docsPath);
  for (const category of categories) {
    const categoryPath = path.join(docsPath, category);
    const stat = await fs.stat(categoryPath);

    if (!stat.isDirectory() || category.startsWith(".")) continue;

    const files = await fs.readdir(categoryPath);
    for (const file of files) {
      if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;

      const filePath = path.join(categoryPath, file);
      const content = await fs.readFile(filePath, "utf-8");

      const titleMatch = content.match(/title:\s*(.+)/);
      const slugMatch = content.match(/slug:\s*(.+)/);

      const title = titleMatch ? titleMatch[1].trim() : file;
      const slug = slugMatch
        ? slugMatch[1].trim()
        : file.replace(/\.mdx?$/, "");

      const summary = content
        .replace(/---[\s\S]*?---/, "")
        .slice(0, 300)
        .trim();

      tils.push({
        id: `${category}/${slug}`,
        category,
        title,
        summary,
      });
    }
  }

  return tils;
}

/* =========================
 * 2. Gemini 관계 분석
 ========================= */
async function analyzeRelationships(tils) {
  const tilSummaries = tils
    .map(
      (til) => `
ID: ${til.id}
Category: ${til.category}
Title: ${til.title}
Summary: ${til.summary}
`
    )
    .join("\n---\n");

  const idList = tils.map((t) => t.id).join("\n");

  const prompt = `
다음 프론트엔드 TIL 목록을 분석하여 지식 그래프를 생성하세요.

${tilSummaries}

다음은 실제 존재하는 TIL 문서 ID 목록입니다:

${idList}

이 ID 목록에 포함된 값만 사용하여 관계를 생성하세요.

⚠️ 매우 중요:
- 반드시 제공된 ID 목록에 포함된 ID만 사용하세요
- 새로운 ID를 생성하지 마세요
- 존재하지 않는 문서는 절대 추가하지 마세요

관계(type)는 반드시 아래 값 중 하나만 사용하세요:

- DEPENDS_ON (의존함)
- RELATED_TO (관련 있음)
- EXTENDS (확장함)
- IMPLEMENTS (구현함)
- USES (사용함)
- PREREQUISITE (선행 지식)
- SIMILAR_TO (유사함)

JSON 형식으로만 응답하세요:

{
  "nodes": [
    { "id": "ID", "title": "제목", "category": "카테고리", "importance": 1 }
  ],
  "links": [
    {
      "source": "ID",
      "target": "ID",
      "strength": 1,
      "type": "DEPENDS_ON"
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" },
  });

  const rawText = response.candidates?.[0]?.content?.parts
    ?.map((p) => p.text)
    .join("");

  if (!rawText) throw new Error("Gemini 응답이 비어 있음");

  return JSON.parse(rawText);
}

function filterInvalidNodes(graph, validIds) {
  return graph.nodes.filter((node) => validIds.has(node.id));
}

function sanitizeGraph(graph, validIds) {
  const nodes = filterInvalidNodes(graph, validIds);
  const nodeIdSet = new Set(nodes.map((n) => n.id));

  const links = graph.links.filter(
    (l) => nodeIdSet.has(l.source) && nodeIdSet.has(l.target)
  );

  return { nodes, links };
}

/* =========================
 * 3. 저장 
 ========================= */
async function main() {
  console.log("📚 TIL 읽는 중...");
  const tils = await getAllTILs();
  if (!tils.length) return;

  console.log("🤖 Gemini 분석 중...");
  const rawGraph = await analyzeRelationships(tils);

  console.log("🧹 그래프 정제 중...");
  const validIds = new Set(tils.map((t) => t.id));
  const graph = sanitizeGraph(rawGraph, validIds);

  const outputPath = path.join(
    __dirname,
    "..",
    "static",
    "data",
    "knowledge-graph.json"
  );

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(graph, null, 2));

  console.log("✅ 도메인 지식 그래프 생성 완료!");
}

main();
