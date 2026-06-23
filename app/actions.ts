"use server";

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function detectIngredients(
  imageBase64: string,
  mimeType: string
): Promise<string[]> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as
                | "image/jpeg"
                | "image/png"
                | "image/gif"
                | "image/webp",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: `이 냉장고 사진에서 보이는 모든 식재료를 한국어로 나열해줘.
JSON 배열 형식으로만 답해줘. 예: ["달걀", "우유", "당근"]
브랜드명 제외, 식재료 이름만, 중복 없이.`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "[]";
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];
  return JSON.parse(match[0]) as string[];
}

export interface Recipe {
  name: string;
  matchRate: number;
  availableIngredients: string[];
  missingIngredients: string[];
  steps: string[];
  cookTime: string;
}

export async function getRecipes(ingredients: string[]): Promise<Recipe[]> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `보유 재료: ${ingredients.join(", ")}

위 재료로 만들 수 있는 레시피 3개를 추천해줘.
보유 재료 일치율 높은 순으로 정렬.

반드시 아래 JSON 형식으로만 응답해:
[
  {
    "name": "요리명",
    "matchRate": 85,
    "availableIngredients": ["있는재료1", "있는재료2"],
    "missingIngredients": ["없는재료1"],
    "steps": ["1단계", "2단계", "3단계"],
    "cookTime": "15분"
  }
]`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "[]";
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];
  return JSON.parse(match[0]) as Recipe[];
}
