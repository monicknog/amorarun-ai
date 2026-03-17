import { z } from "zod";

export const checkinSchema = z.object({
  nome: z.string().min(2, "Nome precisa ter ao menos 2 caracteres"),
  objetivo: z.enum(["5k", "10k", "21k", "42k"]),
  data_prova: z.string().date(),
  local_prova: z.string().min(2),
  treino_planejado_hoje: z.string().min(3),
  estado_emocional: z.enum(["animada", "cansada", "ansiosa", "focada"]),
  relato_livre: z.string().min(3)
});

export const checkinResponseSchema = z.object({
  original_plan: z.string(),
  adapted_workout: z.object({
    status: z.enum(["mantido", "reduzido", "descanso"]),
    workout: z.string(),
    rationale: z.string()
  }),
  soft_skill_mentor: z.object({
    focus: z.string(),
    guidance: z.string(),
    reflection_question: z.string()
  })
});

export type CheckinInput = z.infer<typeof checkinSchema>;
export type CheckinResponse = z.infer<typeof checkinResponseSchema>;