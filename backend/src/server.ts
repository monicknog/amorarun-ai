import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { checkinRoutes } from "./routes/checkin.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "OPTIONS"]
});

app.get("/health", async () => {
  return { ok: true };
});

await app.register(checkinRoutes);

const port = Number(process.env.PORT ?? 3333);

try {
  await app.listen({ port, host: "0.0.0.0" });
  app.log.info(`Servidor Amora Run ativo na porta ${port}`);
} catch (error) {
  app.log.error(error);
  process.exit(1);
}