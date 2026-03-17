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
  const byEmotion: Record<
    CheckinInput["estado_emocional"],
    CheckinResponse["adapted_workout"]
  > = {
    animada: {
      status: "mantido",
      workout: `${input.treino_planejado_hoje} com inicio progressivo e final soltando.` ,
      rationale:
        "Como voce esta animada, mantemos o plano com controle de esforco para preservar consistencia."
    },
    focada: {
      status: "mantido",
      workout: `${input.treino_planejado_hoje} com ritmo confortavel e tecnica atenta.` ,
      rationale:
        "Seu foco permite executar o treino planejado com qualidade e boa percepcao de esforco."
    },
    ansiosa: {
      status: "reduzido",
      workout: "Reduza entre 15% e 20% do volume e mantenha respiracao ritmada durante o treino.",
      rationale:
        "Em dia de ansiedade, reduzir um pouco a carga ajuda a manter o treino seguro e produtivo."
    },
    cansada: {
      status: "reduzido",
      workout: "Reduza o volume em 30% e mantenha ritmo conversavel.",
      rationale:
        "Com sinais de cansaco, a reducao de carga protege recuperacao e evita acumulo de fadiga."
    }
  };

  const adapted = byEmotion[input.estado_emocional];

  return {
    original_plan: input.treino_planejado_hoje,
    adapted_workout: adapted,
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