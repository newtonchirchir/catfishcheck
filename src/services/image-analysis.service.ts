import { analyzeImageWithAI } from "./ai-provider.service.js";

export interface ImageAnalysisResult {
  aiGenerated: boolean;
  aiConfidence: number;
  manipulationDetected: boolean;
  reuseDetected: boolean;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  explanation: string;
}

export async function analyzeImage(
  imageBuffer: Buffer,
  mediaType: "image/jpeg" | "image/png" | "image/webp",
): Promise<ImageAnalysisResult> {
  const rawResult = await analyzeImageWithAI(
    imageBuffer,
    mediaType,
  );

  let parsed: {
    aiGenerated: boolean;
    aiConfidence: number;
    manipulationDetected: boolean;
    manipulationConfidence: number;
    explanation: string;
  };

  try {
    parsed = JSON.parse(rawResult);
  } catch {
    throw new Error("AI provider returned invalid JSON");
  }

  const riskLevel =
    parsed.aiGenerated && parsed.aiConfidence >= 0.8
      ? "HIGH"
      : parsed.aiGenerated && parsed.aiConfidence >= 0.5
        ? "MEDIUM"
        : "LOW";

  return {
    aiGenerated: parsed.aiGenerated,
    aiConfidence: parsed.aiConfidence,
    manipulationDetected: parsed.manipulationDetected,
    reuseDetected: false,
    riskLevel,
    explanation: parsed.explanation,
  };
}
