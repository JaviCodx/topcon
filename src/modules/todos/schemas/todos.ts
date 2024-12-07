import { BadRequest } from "@/modules/todos/schemas/http.js";
import { Static, Type } from "@fastify/type-provider-typebox";

export enum TODOSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export const Label = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export type Label = Static<typeof Label>;

export enum TODOSortBy {
  due_date = "due_date",
}

export const TODO = Type.Object({
  id: Type.String(),
  message: Type.String(),
  label_id: Type.String(),
  due_date: Type.String(),
  label: Type.Optional(Label),
});

export type TODO = Static<typeof TODO>;

const tags = ["Todos"];

export const CreateTodoSchema = {
  tags,
  summary: "Create a todo",
  description: "Create a todo",
  body: Type.Object({
    label_id: Type.String(),
    message: Type.String(),
    due_date: Type.String({
      pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:?\\d{2})$",
    }),
  }),
  response: {
    201: TODO,
    400: BadRequest,
    500: Type.Null(),
  },
}


export const GetTodosSchema = {
  tags,
  summary: "Get Todos",
  description: "Get Todos",
  querystring: Type.Object({
    sort_by: Type.Optional(Type.Enum(TODOSortBy)),
    sort: Type.Optional(
      Type.Enum(TODOSortDirection, { default: TODOSortDirection.ASC })
    ),
    label_id: Type.Optional(Type.String()),
    limit: Type.Optional(Type.Number({ minimum: 1, default: 100 })),
    offset: Type.Optional(Type.Number({ minimum: 0, default: 0 })),
  }),
  response: {
    200: Type.Array(TODO),
    400: BadRequest,
    500: Type.Null(),
  },
};


export const DeleteTodoSchema = {
  tags,
  summary: "Delete a todo",
  description: "Delete a todo",
  params: Type.Object(
    {
      id: Type.String(),
    },
    {
      examples: [
        {
          id: "2",
        },
      ],
    }
  ),
  response: {
    204: Type.Null(),
    404: Type.Null(),
    400: BadRequest,
    500: Type.Null(),
  },
};

export const UpdateTodoSchema = {
  tags,
  summary: "Update a todo",
  description: "Update a todo",
  params: Type.Object(
    {
      id: Type.String(),
    },
    {
      examples: [
        {
          id: "2",
        },
      ],
    }
  ),
  body: Type.Object({
    label_id: Type.String(),
    message: Type.String(),
    due_date: Type.String({
      pattern:
        "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:?\\d{2})$",
    }),
  }),
  response: {
    201: TODO,
    400: BadRequest,
    500: Type.Null(),
  },
};