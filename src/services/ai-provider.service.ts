import fs from "fs/promises";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeImageWithAI(
  imagePath: string,
): Promise<string> {
  if (process.env.AI_PROVIDER === "mock") {
    await fs.access(imagePath);

    return JSON.stringify({
      aiGenerated: false,
      aiConfidence: 0.12,
      manipulationDetected: false,
      manipulationConfidence: 0.08,
      explanation:
        "Development-mode analysis. No external AI provider was called.",
    });
  }

  const imageBuffer = await fs.readFile(imagePath);
  const base64Image = imageBuffer.toString("base64");

  const extension = path.extname(imagePath).toLowerCase();

  const mediaType =
    extension === ".png"
      ? "image/png"
      : extension === ".webp"
        ? "image/webp"
        : "image/jpeg";

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: "text",
            text: `
Analyze this image for CatfishCheck.

Return ONLY valid JSON:

{
  "aiGenerated": boolean,
  "aiConfidence": number,
  "manipulationDetected": boolean,
  "manipulationConfidence": number,
  "explanation": string
}

Rules:
- aiConfidence must be between 0 and 1.
- manipulationConfidence must be between 0 and 1.
- Analyze observable visual characteristics only.
- Do not claim certainty that an image is AI-generated based solely on visual inspection.
- Keep the explanation concise.
`,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find(
    (block) => block.type === "text",
  );

  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Anthropic returned no text response");
  }

  return textBlock.text;
}

