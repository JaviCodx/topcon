import Database from "better-sqlite3";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    db: Database.Database;
  }
}

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  const dbPath = process.env.DB_PATH || "db/todos.db";
  const db = new Database(dbPath);


  db.transaction(() => {
    db.exec(`
          CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            message TEXT NOT NULL,
            label_id TEXT NOT NULL,
            due_date TEXT NOT NULL
          );
      
          
         CREATE INDEX IF NOT EXISTS todos_label_id ON todos (label_id);
         CREATE INDEX IF NOT EXISTS todos_due_date ON todos (due_date);
        `);
  })();

  // Seed data
  // await db.exec(`
  //   INSERT INTO todos (id, message, label_id, due_date) VALUES
  //   ('1', 'Buy milk', '0001', '2024-12-05T14:30:00Z'),
  //   ('2', 'Buy bread', '0001', '2024-11-05T14:30:00Z'),
  //   ('3', 'Buy eggs', '0002', '2024-10-05T14:30:00Z'),
  //   ('4', 'Buy cheese', '0003', '2024-12-05T14:30:00Z'),
  //   ('5', 'Buy butter', '0004', '2024-12-05T14:30:00Z'),
  //   ('6', 'Buy bread', '0004', '2024-12-05T14:30:00Z')
  // `);

  // Optional: Configure pragmas for better performance
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");

  // Decorating fastify with db instance
  fastify.decorate("db", db);

  // Close database connection when fastify closes
  fastify.addHook("onClose", async (instance) => {
    await instance.db.close();
  });
};

export default fp(dbPlugin, { name: "db" });
