Template Base - Mentor Diário de Corrida (Amora Run)
Objetivo

Reproduzir rapidamente um projeto com backend em TypeScript + Fastify e frontend em Next.js.

Coletar dados diários da atleta (físicos e emocionais), enviar para API e receber resposta estruturada.

Gerar adaptação do treino do dia + mentoria de soft skill (resiliência).

1) Estrutura recomendada
projeto-amora-run/
backend/
package.json
tsconfig.json
.env.example
knowledge/
amora-identity.md
src/
server.ts
agent.ts
prompt.ts
types.ts
routes/
checkin.ts
frontend/
package.json
tsconfig.json
next.config.mjs
src/
app/
page.tsx
layout.tsx
globals.css
_components/
checkin-form.tsx
result-card.tsx
types/
amora-data.type.ts
components/
ui/

2) Contrato de entrada da API
Campos esperados no POST /api/checkin:

nome: string

objetivo: '5k' | '10k' | '21k' | '42k'

data_prova: string (ISO date)

local_prova: string

treino_planejado_hoje: string

estado_emocional: 'animada' | 'cansada' | 'ansiosa' | 'focada'

relato_livre: string

3) Fluxo funcional
Frontend mostra o formulário (estética botânica/papelaria) para coletar o check-in do dia.

Frontend valida com Zod e envia para o backend via POST.

Backend valida novamente os tipos e dados com Zod.

Backend monta prompt dinâmico com:

Instruções fixas da agente Amora (System Prompt).

Dados diários da atleta.

Documento técnico em knowledge/amora-identity.md (regras de redução de danos).

Backend chama a IA solicitando um JSON estruturado (ou texto processado).

Backend formata a resposta e devolve para o client.

Frontend lê o JSON e renderiza o ResultCard dividindo a Hard Skill (Treino) da Soft Skill (Mentoria).

4) Dependências mínimas
Backend

fastify

@fastify/cors

zod

dotenv

@google/genai

typescript

tsx

@types/node

Frontend

next

react

react-dom

zod

react-hook-form

@hookform/resolvers

lucide-react (para ícones como o Heart e Sparkles)

tailwindcss

radix ui (opcional, para componentes acessíveis)

5) Variáveis de ambiente
backend/.env.example

GEMINI_API_KEY=sua_chave

PORT=3333

6) Template de prompts
System Prompt (regras fixas)

Você é a Amora, uma mentora de corrida acolhedora.

Seu objetivo é proteger a saúde mental e física da atleta.

Responda sempre em um JSON estrito contendo: original_plan, adapted_workout (com status: mantido, reduzido ou descanso) e soft_skill_mentor.

Nunca seja punitiva; o descanso faz parte do treino.

User Prompt (dados dinâmicos)

Nome, objetivo, data, local, treino planejado e o check-in emocional de hoje.

Docs Prompt (base técnica)

Conteúdo de knowledge/amora-identity.md anexado ao contexto, ensinando a IA a adaptar o pace pelo clima (ex: calor) e cortar volume em caso de exaustão extrema.

7) Roteiro de implementação rápido
Criar backend em TypeScript com Fastify (npm init -y, instalar deps).

Criar schema Zod do Check-in e da Resposta em src/types.ts.

Criar builder de prompts em src/prompt.ts (injetando as variáveis).

Criar integração com a IA em src/agent.ts garantindo o parse seguro do JSON.

Criar rota POST /api/checkin em src/routes/checkin.ts.

Configurar CORS no servidor Fastify.

Criar frontend Next.js com Tailwind e configurar formulário com react-hook-form + zod.

Implementar requisição fetch no frontend.

Renderizar o card final com feedback visual (cores diferentes para treino mantido vs reduzido).

8) Critérios de qualidade
Validação duplicada (frontend e backend) com Zod.

Tipagem forte ponta a ponta (Type Safety).

Prompt separado da camada HTTP (Clean Code).

Tratamento de erro 429 (Rate Limit do Gemini) no backend, retornando um mock/fallback estático para a interface não quebrar na apresentação do PCC.

Separação clara de responsabilidades entre UI e Regra de Negócio.

9) Evoluções recomendadas
Integração com a API do Strava para puxar o "treino planejado" automaticamente.

Autenticação de usuário para salvar o histórico de resiliência.

Persistência de dados (PostgreSQL/Prisma) para acompanhar as flutuações de humor da atleta ao longo do ciclo de maratona.

Logs estruturados e métricas de uso.

Rate limit por IP para proteger custo de API.

10) Comandos padrão
Backend

npm install

npm run dev (configurado no package.json usando tsx watch src/server.ts)

Frontend

npm install

npm run dev

11) Observação de compatibilidade
Se houver incompatibilidade de versão do Next.js no ambiente, prefira next.config.mjs para evitar erro de build em cenários onde next.config.ts não é aceito.