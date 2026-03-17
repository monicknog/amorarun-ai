import { Heart, Sparkles } from "lucide-react";
import type { CheckinResponse } from "@/types/amora-data.type";

type ResultCardProps = {
  result: CheckinResponse;
};

const statusStyles: Record<CheckinResponse["adapted_workout"]["status"], string> = {
  mantido: "bg-emerald-100 text-emerald-800",
  reduzido: "bg-amber-100 text-amber-800",
  descanso: "bg-sky-100 text-sky-800"
};

export function ResultCard({ result }: ResultCardProps): JSX.Element {
  return (
    <section className="grid gap-4 rounded-2xl border border-emerald-900/20 bg-white/80 p-6 shadow-lg shadow-emerald-950/10 backdrop-blur">
      <div className="flex items-center gap-2 text-folha">
        <Heart className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Hard Skill - Treino do Dia</h2>
      </div>

      <p className="text-sm text-zinc-700">
        <span className="font-semibold">Plano original:</span> {result.original_plan}
      </p>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[result.adapted_workout.status]}`}>
            {result.adapted_workout.status.toUpperCase()}
          </span>
        </div>
        <p className="font-medium text-zinc-900">{result.adapted_workout.workout}</p>
        <p className="mt-2 text-sm text-zinc-700">{result.adapted_workout.rationale}</p>
      </div>

      <div className="mt-2 flex items-center gap-2 text-folha">
        <Sparkles className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Soft Skill - Mentoria de Resiliencia</h3>
      </div>

      <div className="rounded-xl border border-coral/30 bg-coral/10 p-4">
        <p className="font-semibold text-zinc-900">Foco: {result.soft_skill_mentor.focus}</p>
        <p className="mt-2 text-sm text-zinc-800">{result.soft_skill_mentor.guidance}</p>
        <p className="mt-3 text-sm italic text-zinc-700">
          Pergunta de reflexao: {result.soft_skill_mentor.reflection_question}
        </p>
      </div>
    </section>
  );
}