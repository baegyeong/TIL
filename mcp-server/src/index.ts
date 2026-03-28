#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";

// TIL 저장소 경로 (프로젝트 루트 기준)
const TIL_PATH = process.env.TIL_PATH || path.join(process.cwd(), "..");

interface TILFile {
  category: string;
  filename: string;
  path: string;
  content: string;
  title?: string;
}

const server = new Server(
  {
    name: "til-knowledge-graph",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

async function getAllTILs(): Promise<TILFile[]> {
  const docsPath = path.join(TIL_PATH, "docs");
  const tils: TILFile[] = [];

  try {
    const categories = await fs.readdir(docsPath);

    for (const category of categories) {
      const categoryPath = path.join(docsPath, category);
      const stat = await fs.stat(categoryPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(categoryPath);

        for (const file of files) {
          if (file.endsWith(".md") || file.endsWith(".mdx")) {
            const filePath = path.join(categoryPath, file);
            const content = await fs.readFile(filePath, "utf-8");

            const titleMatch = content.match(/title:\s*(.+)/);
            const title = titleMatch ? titleMatch[1].trim() : file;

            tils.push({
              category,
              filename: file,
              path: filePath,
              content,
              title,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("TIL 파일을 읽는 중 오류:", error);
  }

  return tils;
}

async function readTIL(category: string, filename: string): Promise<string> {
  const filePath = path.join(TIL_PATH, "docs", category, filename);
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    throw new Error(`파일을 찾을 수 없습니다: ${category}/${filename}`);
  }
}

async function searchTILs(query: string): Promise<TILFile[]> {
  const allTILs = await getAllTILs();
  const lowerQuery = query.toLowerCase();

  return allTILs.filter(
    (til) =>
      til.title?.toLowerCase().includes(lowerQuery) ||
      til.content.toLowerCase().includes(lowerQuery) ||
      til.category.toLowerCase().includes(lowerQuery)
  );
}

async function findRelatedTILs(
  category: string,
  filename: string
): Promise<TILFile[]> {
  const allTILs = await getAllTILs();
  const tilPath = path.join(TIL_PATH, "docs", category, filename);
  const targetTIL = allTILs.find((t) => t.path === tilPath);

  if (!targetTIL) {
    return [];
  }

  const keywords = extractKeywords(targetTIL.content);

  const related = allTILs
    .filter((til) => til.path !== tilPath)
    .map((til) => {
      const matchCount = keywords.filter((keyword) =>
        til.content.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      return { til, matchCount };
    })
    .filter((item) => item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 5)
    .map((item) => item.til);

  return related;
}

function extractKeywords(content: string): string[] {
  const cleaned = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/---[\s\S]*?---/g, "");

  const words = cleaned.toLowerCase().match(/[a-z가-힣]{3,}/g) || [];

  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_tils",
        description: "모든 TIL 파일 목록을 가져옵니다",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "read_til",
        description: "특정 TIL 파일을 읽습니다",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "카테고리 이름 (예: React, TypeScript)",
            },
            filename: {
              type: "string",
              description: "파일 이름 (예: hooks.md)",
            },
          },
          required: ["category", "filename"],
        },
      },
      {
        name: "search_tils",
        description: "TIL을 검색합니다",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "검색어",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "find_related_tils",
        description: "특정 TIL과 관련된 다른 TIL을 찾습니다",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "카테고리 이름",
            },
            filename: {
              type: "string",
              description: "파일 이름",
            },
          },
          required: ["category", "filename"],
        },
      },
      {
        name: "get_categories",
        description: "모든 카테고리 목록을 가져옵니다",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (request.params.name === "list_tils") {
      const tils = await getAllTILs();
      const summary = tils.map(
        (til) => `[${til.category}] ${til.title || til.filename}`
      );
      return {
        content: [
          {
            type: "text",
            text: `총 ${tils.length}개의 TIL:\n\n${summary.join("\n")}`,
          },
        ],
      };
    }

    if (request.params.name === "read_til") {
      const { category, filename } = request.params.arguments as {
        category: string;
        filename: string;
      };
      const content = await readTIL(category, filename);
      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    }

    if (request.params.name === "search_tils") {
      const { query } = request.params.arguments as { query: string };
      const results = await searchTILs(query);
      const summary = results.map(
        (til) => `[${til.category}] ${til.title || til.filename}`
      );
      return {
        content: [
          {
            type: "text",
            text:
              results.length > 0
                ? `검색 결과 (${results.length}개):\n\n${summary.join("\n")}`
                : "검색 결과가 없습니다.",
          },
        ],
      };
    }

    if (request.params.name === "find_related_tils") {
      const { category, filename } = request.params.arguments as {
        category: string;
        filename: string;
      };
      const related = await findRelatedTILs(category, filename);
      const summary = related.map(
        (til) => `[${til.category}] ${til.title || til.filename}`
      );
      return {
        content: [
          {
            type: "text",
            text:
              related.length > 0
                ? `관련된 TIL (${related.length}개):\n\n${summary.join("\n")}`
                : "관련된 TIL을 찾지 못했습니다.",
          },
        ],
      };
    }

    if (request.params.name === "get_categories") {
      const docsPath = path.join(TIL_PATH, "docs");
      const categories = await fs.readdir(docsPath);
      const validCategories = [];

      for (const cat of categories) {
        const stat = await fs.stat(path.join(docsPath, cat));
        if (stat.isDirectory()) {
          validCategories.push(cat);
        }
      }

      return {
        content: [
          {
            type: "text",
            text: `카테고리 목록:\n\n${validCategories.join("\n")}`,
          },
        ],
      };
    }

    throw new Error(`알 수 없는 도구: ${request.params.name}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `오류: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TIL MCP 서버가 시작되었습니다");
}

main().catch((error) => {
  console.error("서버 시작 실패:", error);
  process.exit(1);
});
