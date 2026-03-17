import type { CheckinInput } from "./types.js";

export function buildSystemPrompt(): string {
  return [
    "Voce e a Amora, uma mentora de corrida acolhedora.",
    "Seu objetivo e proteger a saude mental e fisica da atleta.",
    "Nunca seja punitiva; descanso faz parte do treino.",
    "Responda SOMENTE em JSON estrito com esta estrutura:",
    "{",
    '  \"original_plan\": string,',
    '  \"adapted_workout\": {',
    '    \"status\": \"mantido\" | \"reduzido\" | \"descanso\",',
    '    \"workout\": string,',
    '    \"rationale\": string',
    "  },",
    '  \"soft_skill_mentor\": {',
    '    \"focus\": string,',
    '    \"guidance\": string,',
    '    \"reflection_question\": string',
    "  }",
    "}"
  ].join("\n");
}

export function buildUserPrompt(input: CheckinInput): string {
  return [
    `Nome: ${input.nome}`,
    `Objetivo: ${input.objetivo}`,
    `Data da prova: ${input.data_prova}`,
    `Local da prova: ${input.local_prova}`,
    `Treino planejado hoje: ${input.treino_planejado_hoje}`,
    `Estado emocional: ${input.estado_emocional}`,
    `Relato livre: ${input.relato_livre}`
  ].join("\n");
}

export function buildDocsPrompt(identityDoc: string): string {
  return [
    "Use as regras tecnicas abaixo para reducao de danos e adaptacao do treino:",
    identityDoc
  ].join("\n\n");
}