"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type CheckinFormData,
  type CheckinResponse,
  checkinResponseSchema,
  checkinSchema
} from "@/types/amora-data.type";

type CheckinFormProps = {
  onResult: (value: CheckinResponse | null) => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export function CheckinForm({ onResult }: CheckinFormProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckinFormData>({
    resolver: zodResolver(checkinSchema),
    defaultValues: {
      objetivo: "10k",
      estado_emocional: "focada",
      data_prova: new Date().toISOString().slice(0, 10)
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    onResult(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel processar seu check-in agora.");
      }

      const payload = await response.json();
      const parsed = checkinResponseSchema.parse(payload);
      onResult(parsed);
    } catch (submitError) {
      if (
        submitError instanceof TypeError &&
        submitError.message.toLowerCase().includes("fetch")
      ) {
        setError(
          "Nao foi possivel conectar na API. Confirme se o backend esta rodando em http://localhost:3333."
        );
      } else {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Falha inesperada ao enviar check-in."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-terra/20 bg-creme/90 p-6 shadow-xl shadow-terra/10">
      <h2 className="text-2xl font-semibold text-folha">Mentoria Pre-Treino da Atleta</h2>
      <p className="-mt-1 text-sm text-zinc-700">
        Preencha antes de correr para apoiar o treino que deve ser entregue hoje.
      </p>

      <label className="grid gap-1 text-sm">
        <span>Nome da atleta</span>
        <input
          {...register("nome")}
          placeholder="Ex.: Monica"
          className="rounded-lg border border-terra/30 bg-white px-3 py-2 outline-none ring-coral transition focus:ring-2"
        />
        {errors.nome && <span className="text-xs text-red-700">{errors.nome.message}</span>}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span>Distancia alvo da prova</span>
          <select {...register("objetivo")} className="rounded-lg border border-terra/30 bg-white px-3 py-2">
            <option value="5k">5k</option>
            <option value="10k">10k</option>
            <option value="21k">21k</option>
            <option value="42k">42k</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span>Data da prova principal</span>
          <input type="date" {...register("data_prova")} className="rounded-lg border border-terra/30 bg-white px-3 py-2" />
          {errors.data_prova && (
            <span className="text-xs text-red-700">{errors.data_prova.message}</span>
          )}
        </label>
      </div>

      <label className="grid gap-1 text-sm">
        <span>Local da prova</span>
        <input
          {...register("local_prova")}
          placeholder="Ex.: Sao Paulo - SP"
          className="rounded-lg border border-terra/30 bg-white px-3 py-2"
        />
        {errors.local_prova && (
          <span className="text-xs text-red-700">{errors.local_prova.message}</span>
        )}
      </label>

      <label className="grid gap-1 text-sm">
        <span>Treino que deve ser entregue hoje</span>
        <input
          {...register("treino_planejado_hoje")}
          placeholder="Ex.: 10km com 3km em ritmo de prova"
          className="rounded-lg border border-terra/30 bg-white px-3 py-2"
        />
        {errors.treino_planejado_hoje && (
          <span className="text-xs text-red-700">{errors.treino_planejado_hoje.message}</span>
        )}
      </label>

      <label className="grid gap-1 text-sm">
        <span>Como voce chega para o treino de hoje</span>
        <select {...register("estado_emocional")} className="rounded-lg border border-terra/30 bg-white px-3 py-2">
          <option value="animada">animada</option>
          <option value="cansada">cansada</option>
          <option value="ansiosa">ansiosa</option>
          <option value="focada">focada</option>
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        <span>Contexto rapido pre-treino</span>
        <textarea
          {...register("relato_livre")}
          rows={4}
          placeholder="Conte como dormiu, nivel de energia, dor muscular, clima e qualquer ponto importante para ajustar o treino."
          className="rounded-lg border border-terra/30 bg-white px-3 py-2"
        />
        {errors.relato_livre && (
          <span className="text-xs text-red-700">{errors.relato_livre.message}</span>
        )}
      </label>

      {error && <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-folha px-4 py-3 text-sm font-semibold text-creme transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Gerando mentoria pre-treino..." : "Gerar mentoria para o treino de hoje"}
      </button>
    </form>
  );
}