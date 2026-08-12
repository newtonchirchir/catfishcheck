import path from "path";
import { prisma } from "../lib/prisma.js";
import { analyzeImage } from "./image-analysis.service.js";

export async function processScan(scanId: string) {
  const scan = await prisma.scan.findUnique({
    where: { id: scanId },
  });

  if (!scan) {
    throw new Error("Scan not found");
  }

  await prisma.scan.update({
    where: { id: scanId },
    data: {
      status: "PROCESSING",
    },
  });

  try {
    const imagePath = path.join(
      process.cwd(),
      scan.imageUrl.replace(/^\/+/, ""),
    );

    const result = await analyzeImage(imagePath);

    return await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: "COMPLETED",
        aiGenerated: result.aiGenerated,
        aiConfidence: result.aiConfidence,
        manipulationDetected: result.manipulationDetected,
        reuseDetected: result.reuseDetected,
        riskLevel: result.riskLevel,
        explanation: result.explanation,
      },
    });
  } catch (error) {
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: "FAILED",
        explanation: "AI analysis could not be completed.",
      },
    });

    throw error;
  }
}
