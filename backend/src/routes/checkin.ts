import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { generateMentorResponse } from "../agent.js";
import { checkinSchema } from "../types.js";

export async function checkinRoutes(app: FastifyInstance): Promise<void> {
  app.post("/api/checkin", async (request, reply) => {
    try {
      const payload = checkinSchema.parse(request.body);
      const response = await generateMentorResponse(payload);
      return reply.status(200).send(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: "Dados invalidos no check-in",
          issues: error.flatten()
        });
      }

      request.log.error(error, "Falha ao processar check-in");
      return reply.status(500).send({
        message: "Erro interno ao processar check-in"
      });
    }
  });
}

export default checkinRoutes;