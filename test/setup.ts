// test/helpers/setup.ts
import Fastify from "fastify";
import createServer from "../src/server.js";

export async function createTestServer() {
  const fastify = Fastify();
  const app = await createServer(fastify);
  
  return app;
}

export const seedData = async (app) => {
  await app.db.exec(`
    INSERT INTO todos (id, message, label_id, due_date) VALUES
    ('1', 'Buy milk', '0001', '2024-12-05T14:30:00Z'),
    ('2', 'Buy bread', '0001', '2024-11-05T14:30:00Z'),
    ('3', 'Buy eggs', '0002', '2024-10-05T14:30:00Z'),
    ('4', 'Buy cheese', '0003', '2024-12-05T14:30:00Z'),
    ('5', 'Buy butter', '0004', '2024-12-05T14:30:00Z'),
    ('6', 'Buy bread', '0004', '2024-12-05T14:30:00Z')
  `);
};

export const clearDatabase = async (app) => {
  await app.db.exec('DELETE FROM todos');
};