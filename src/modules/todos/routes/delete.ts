import { DeleteTodoSchema } from "@/modules/todos/schemas/todos.js";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().delete(
    "/:id",
    {
      schema: DeleteTodoSchema,
    },
    async (request, response) => {
      const { id } = request.params;

      const existingTodo = fastify.todoRepository.findById(id);

      if (!existingTodo) {
        response.code(404).send();
        return;
      }

      fastify.todoRepository.delete(id);
      response.code(204).send();
    }
  );
}
