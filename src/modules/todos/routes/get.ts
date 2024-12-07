import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import {
  GetTodosSchema,
} from "@/modules/todos/schemas/todos.js";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    "/",

    {
      schema: GetTodosSchema,
    },
    async (request) => {
      const { sort_by, sort, limit, offset, label_id } = request.query;

      const todos = fastify.todoRepository.findAll({
        label_id,
        sort_by,
        sort,
        limit,
        offset,
      });

      const labels = await fastify.labelsService.getLabels();

      const todosLabelsPopulated = todos.map((todo) => {
        const label = labels.find((label) => label.id === todo.label_id);
        return { ...todo, label };
      });

      return todosLabelsPopulated;
    }
  );
}