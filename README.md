# Amora Run

Mentor diario de corrida com backend em Fastify + TypeScript e frontend em Next.js.

O fluxo principal coleta o check-in da atleta, envia para a API, processa com a agente Amora (Gemini) e retorna uma resposta estruturada com:

- adaptacao do treino (hard skill)
- mentoria de resiliencia (soft skill)

## 1. Requisitos

- Node.js 20+
- npm 10+

## 2. Estrutura do projeto

- `backend/`: API Fastify, validacao, prompts e integracao com IA
- `frontend/`: App Next.js com formulario e card de resultado
- `template.md`: especificacao base utilizada para gerar o projeto

## 3. Configuracao de ambiente

No backend, crie o arquivo `.env` a partir de `.env.example`.

Windows PowerShell:

```powershell
Set-Location backend
Copy-Item .env.example .env
```

Depois, edite `backend/.env`:

```env
GEMINI_API_KEY=sua_chave
PORT=3333
```

Observacoes:

- Se `GEMINI_API_KEY` nao for definida, a API usa fallback estatico para nao quebrar a interface.
- Se houver erro 429 da IA (rate limit), a API tambem retorna fallback estatico.

## 4. Instalacao de dependencias

Backend:

```powershell
Set-Location backend
npm install
```

Frontend:

```powershell
Set-Location ..\frontend
npm install
```

## 5. Execucao local

### 5.1 Subir backend

Em um terminal:

```powershell
Set-Location backend
npm run dev
```

API esperada em `http://localhost:3333`.

### 5.2 Subir frontend

Em outro terminal:

```powershell
Set-Location frontend
npm run dev
```

Aplicacao esperada em `http://localhost:3000`.

Opcional: para trocar o endpoint da API no frontend, configure `NEXT_PUBLIC_API_URL`.

Exemplo (PowerShell, sessao atual):

```powershell
$env:NEXT_PUBLIC_API_URL="http://localhost:3333"
npm run dev
```

## 6. Fluxo de teste ponta a ponta

## 6.1 Teste da API (sem frontend)

Com backend rodando, execute:

```powershell
Invoke-RestMethod -Uri "http://localhost:3333/api/checkin" -Method Post -ContentType "application/json" -Body (@{
  nome = "Marina"
  objetivo = "10k"
  data_prova = "2026-05-10"
  local_prova = "Sao Paulo"
  treino_planejado_hoje = "8km leve com 4 tiros curtos"
  estado_emocional = "cansada"
  relato_livre = "Dormi pouco e senti pernas pesadas no aquecimento"
} | ConvertTo-Json)
```

Resultado esperado: JSON com `original_plan`, `adapted_workout` e `soft_skill_mentor`.

## 6.2 Teste via interface (E2E)

1. Acesse `http://localhost:3000`.
2. Preencha o formulario de check-in.
3. Clique em **Gerar adaptacao com Amora**.
4. Verifique se o card final exibe:
   - status do treino (`mantido`, `reduzido` ou `descanso`)
   - treino adaptado e justificativa
   - foco e orientacao de resiliencia

## 6.3 Cenarios recomendados de validacao

- Cenario A (cansada): deve tender a reduzir volume ou sugerir descanso.
- Cenario B (focada): pode manter treino com pequenos ajustes.
- Cenario C (sem chave Gemini): deve responder com fallback sem erro 500 na UI.
- Cenario D (payload invalido): backend deve retornar 400 com detalhes de validacao.

Exemplo de payload invalido (objetivo fora do enum):

```powershell
Invoke-RestMethod -Uri "http://localhost:3333/api/checkin" -Method Post -ContentType "application/json" -Body (@{
  nome = "Ana"
  objetivo = "7k"
  data_prova = "2026-06-01"
  local_prova = "Campinas"
  treino_planejado_hoje = "5km"
  estado_emocional = "focada"
  relato_livre = "ok"
} | ConvertTo-Json)
```

Esperado: resposta 400 por validacao Zod.

## 7. Build de producao

Backend:

```powershell
Set-Location backend
npm run build
```

Frontend:

```powershell
Set-Location ..\frontend
npm run build
```

## 8. Solucao de problemas

- Porta em uso: altere `PORT` no `backend/.env`.
- Frontend nao conecta na API: confirme URL e CORS; por padrao backend aceita origem liberada.
- Incompatibilidade de config Next: projeto usa `next.config.mjs` por compatibilidade.

## 9. Contrato da API (resumo)

Endpoint: `POST /api/checkin`

Entrada:

```json
{
  "nome": "string",
  "objetivo": "5k | 10k | 21k | 42k",
  "data_prova": "YYYY-MM-DD",
  "local_prova": "string",
  "treino_planejado_hoje": "string",
  "estado_emocional": "animada | cansada | ansiosa | focada",
  "relato_livre": "string"
}
```

## 10. Deploy (GitHub e Vercel)

### 10.1 Publicar no GitHub

1. Inicialize o repositório local (se ainda nao tiver feito):

```powershell
Set-Location c:\Users\monhe\OneDrive\Projetos\amora-run-ia
git init
```

2. Configure identidade Git (necessario para commit):

```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

3. Crie o commit inicial:

```powershell
git add .
git commit -m "feat: initial amora run project"
```

4. Crie um repositório vazio no GitHub (pela web) e conecte o remoto:

```powershell
git remote add origin https://github.com/SEU_USUARIO/amora-run-ia.git
git branch -M main
git push -u origin main
```

### 10.2 Deploy na Vercel (frontend)

Recomendacao: deploy do frontend na Vercel e backend em um provedor Node dedicado.

1. No painel da Vercel, clique em New Project e importe o repositório GitHub.
2. Em Root Directory, selecione `frontend`.
3. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL` = URL publica do backend (ex.: https://api-amora-run.onrender.com)
4. Deploy.

### 10.3 Deploy do backend (Node)

Para o backend Fastify, prefira Render/Railway/Fly.io (processo Node continuo).

Configuracoes sugeridas:

- Start command: `npm run dev` (ou `npm start` apos build)
- Root: `backend`
- Env vars:
  - `GEMINI_API_KEY`
  - `PORT` (conforme plataforma)

Depois de publicar o backend, atualize `NEXT_PUBLIC_API_URL` no projeto da Vercel e redeploy do frontend.

### 10.4 Deploy backend na Render (recomendado para este projeto)

Este repositorio ja inclui o blueprint [render.yaml](render.yaml), entao a forma mais rapida e:

1. Acesse Render Blueprint: https://dashboard.render.com/blueprint/new
2. Conecte o repo `monicknog/amorarun-ai`.
3. A Render vai detectar [render.yaml](render.yaml) e criar o servico `amora-run-backend`.
4. Em Environment, preencha `GEMINI_API_KEY`.
5. Clique em Apply.

Quando finalizar, valide:

- Health check: `https://SEU_BACKEND.onrender.com/health`
- API: POST `https://SEU_BACKEND.onrender.com/api/checkin`

Depois, na Vercel, ajuste:

- `NEXT_PUBLIC_API_URL=https://SEU_BACKEND.onrender.com`

Saida:

```json
{
  "original_plan": "string",
  "adapted_workout": {
    "status": "mantido | reduzido | descanso",
    "workout": "string",
    "rationale": "string"
  },
  "soft_skill_mentor": {
    "focus": "string",
    "guidance": "string",
    "reflection_question": "string"
  }
}
```
