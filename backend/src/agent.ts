import { readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { buildDocsPrompt, buildSystemPrompt, buildUserPrompt } from "./prompt.js";
import {
  type CheckinInput,
  type CheckinResponse,
  checkinResponseSchema
} from "./types.js";

function sanitizeJsonText(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    return trimmed.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
  }
  return trimmed;
}

function buildFallbackResponse(input: CheckinInput): CheckinResponse {
  return {
    original_plan: input.treino_planejado_hoje,
    adapted_workout: {
      status: input.estado_emocional === "cansada" ? "reduzido" : "mantido",
      workout:
        input.estado_emocional === "cansada"
          ? "Reduza o volume em 30% e mantenha ritmo conversavel."
          : input.treino_planejado_hoje,
      rationale:
        "Fallback acionado para manter o fluxo da interface sem interromper o check-in."
    },
    soft_skill_mentor: {
      focus: "Resiliencia com autoescuta",
      guidance:
        "Seu progresso melhora quando voce ajusta o treino ao seu estado real de hoje.",
      reflection_question:
        "Qual ajuste inteligente voce fez hoje para proteger sua consistencia?"
    }
  };
}

export async function generateMentorResponse(
  input: CheckinInput
): Promise<CheckinResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return buildFallbackResponse(input);
  }

  const identityPath = path.resolve(process.cwd(), "knowledge", "amora-identity.md");
  const identityDoc = await readFile(identityPath, "utf8");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        buildSystemPrompt(),
        buildDocsPrompt(identityDoc),
        buildUserPrompt(input)
      ].join("\n\n"),
      config: {
        responseMimeType: "application/json"
      }
    });

    const rawText = sanitizeJsonText(response.text ?? "");
    const parsed = JSON.parse(rawText);
    return checkinResponseSchema.parse(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const maybeStatus =
      typeof error === "object" && error !== null && "status" in error
        ? Number((error as { status?: unknown }).status)
        : NaN;

    if (message.includes("429") || maybeStatus === 429) {
      return buildFallbackResponse(input);
    }

    throw error;
  }
}