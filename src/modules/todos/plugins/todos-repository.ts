import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Database } from "better-sqlite3";
import {
  TODO,
  TODOSortDirection,
  TODOSortBy,
} from "@/modules/todos/schemas/todos.js";

export interface TodoRepository {
  create(todo: {
    id: string;
    message: string;
    label_id: string;
    due_date: string;
  }): TODO;
  findAll(params: {
    label_id?: string;
    sort_by?: TODOSortBy;
    sort?: TODOSortDirection;
    limit?: number;
    offset?: number;
  }): TODO[];
  delete(id: string): void;
  findById(id: string): TODO | undefined;
  update(params: {
    id: string;
    message: string;
    label_id: string;
    due_date: string;
  }): TODO;
}

declare module "fastify" {
  interface FastifyInstance {
    todoRepository: TodoRepository;
  }
}

class TodoRepositoryImpl implements TodoRepository {
  constructor(private db: Database) {}
  update({
    id,
    message,
    label_id,
    due_date,
  }: {
    id: string;
    message: string;
    label_id: string;
    due_date: string;
  }): TODO {
    return this.db
      .prepare(
        `
        UPDATE todos 
        SET message = ?, label_id = ?, due_date = ? 
        WHERE id = ?
        RETURNING *
      `
      )
      .get(message, label_id, due_date, id) as TODO;
  }
  findById(id: string): TODO | undefined {
    return this.db.prepare("SELECT id FROM todos WHERE id = ?").get(id) as
      | TODO
      | undefined;
  }

  delete(id: string): void {
    this.db.prepare("DELETE FROM todos WHERE id = ?").run(id);
  }

  findAll({
    label_id,
    sort_by,
    sort,
    limit,
    offset,
  }: {
    label_id?: string;
    sort_by?: TODOSortBy;
    sort?: TODOSortDirection;
    limit: number;
    offset: number;
  }): TODO[] {
    const where = this.buildWhereClause({ label_id });
    const order = this.buildOrderClause({ sort_by, sort });

    const query = `
      SELECT * 
      FROM todos 
      ${where.clause}
      ${order}
      ${this.buildPaginationClause()}
    `.trim();

    const findStm = this.db.prepare(query);
    const params = [...where.params, limit, offset];

    return findStm.all(params) as TODO[];
  }

  private buildWhereClause({ label_id }: { label_id?: string }): {
    clause: string;
    params: (string | number)[];
  } {
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (label_id) {
      conditions.push("label_id = ?");
      params.push(label_id);
    }

    if (conditions.length === 0) {
      return { clause: "", params: [] };
    }

    return {
      clause: `WHERE ${conditions.join(" AND ")}`,
      params,
    };
  }

  private buildOrderClause({
    sort_by,
    sort,
  }: {
    sort_by?: TODOSortBy;
    sort?: TODOSortDirection;
  }): string {
    return sort_by ? `ORDER BY datetime(${sort_by}) ${sort}` : "";
  }

  private buildPaginationClause(): string {
    return "LIMIT ? OFFSET ?";
  }

  create(todo: {
    id: string;
    message: string;
    label_id: string;
    due_date: string;
  }): TODO {
    return this.db
      .prepare(
        `
        INSERT INTO todos (id, message, label_id, due_date) 
        VALUES (?, ?, ?, ?) 
        RETURNING *
      `
      )
      .get(todo.id, todo.message, todo.label_id, todo.due_date) as TODO;
  }
}

const todoRepositoryPlugin: FastifyPluginAsync = async (fastify) => {
  const repository = new TodoRepositoryImpl(fastify.db);
  fastify.decorate("todoRepository", repository);
};

export default fp(todoRepositoryPlugin, {
  name: "todoRepository",
  dependencies: ["db"],
});
