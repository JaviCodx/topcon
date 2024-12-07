import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { CreateTodoSchema } from "@/modules/todos/schemas/todos.js";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    "/",

    {
      schema: CreateTodoSchema,
    },
    async (request, response) => {
      const { message, due_date, label_id } = request.body;

      const label = await fastify.labelsService.getLabel(label_id).catch(() => {
        response.code(400).send(fastify.labelsService.createBadRequestError("Label not found"));
      });

      if (!label) {
        response.code(400).send(fastify.labelsService.createBadRequestError("Label not found"));
        return;
      }

      const id = crypto.randomUUID();

      const insertedTodo = fastify.todoRepository.create({
        id,
        message,
        label_id,
        due_date,
      });

      return response.status(201).send({ ...insertedTodo, label });
    }
  );
}
