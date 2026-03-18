"use client";

import { useState } from "react";
import { CheckinForm } from "@/_components/checkin-form";
import { ResultCard } from "@/_components/result-card";
import type { CheckinResponse } from "@/types/amora-data.type";

export default function HomePage(): JSX.Element {
  const [result, setResult] = useState<CheckinResponse | null>(null);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#fbe8d3,transparent_35%),radial-gradient(circle_at_90%_20%,#d8eadf,transparent_30%),linear-gradient(140deg,#f2eadf_0%,#e8f3ec_100%)] px-4 py-10">
      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-8 rounded-3xl border border-folha/20 bg-white/60 p-6 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-terra">Mentoria pre-treino</p>
          <h1 className="mt-2 text-4xl font-bold text-folha">Amora Run</h1>
          <p className="mt-3 text-sm text-zinc-700">
            Check-in emocional e fisico antes do treino para apoiar a entrega do treino
            planejado com inteligencia e resiliencia.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <CheckinForm onResult={setResult} />

          {result ? (
            <ResultCard result={result} />
          ) : (
            <section className="rounded-2xl border border-dashed border-terra/30 bg-white/70 p-6 text-sm text-zinc-700 shadow-lg shadow-terra/5">
              Preencha a mentoria pre-treino para visualizar a adaptacao do treino que deve
              ser entregue hoje e o apoio de resiliencia neste painel.
            </section>
          )}
        </div>
      </section>
    </main>
  );
}