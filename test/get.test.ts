import { test } from "node:test";
import assert from "assert";
import { createTestServer, seedData, clearDatabase } from "./setup.js";

let app;

function getTimestamp(date: string) {
  return new Date(date).getTime();
}

test("GET /todos", async (t) => {
  app = await createTestServer();
  await seedData(app);

  await t.test("gets all todos successfully", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/todos",
    });

    const data = response.json();
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(data?.length > 0, true);
  });

  await t.test("fails on invalid query param", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/todos",
      query: {
        limit: "invalid",
      },
    });

    assert.strictEqual(response.statusCode, 400);
  });

  await clearDatabase(app);
  await app.close();
});

test("GET /todos filtering", async (t) => {
  app = await createTestServer();
  await seedData(app);

  await t.test("filters by label_id", async () => {
    const label_id = "0001";
    const response = await app.inject({
      method: "GET",
      url: "/todos",
      query: {
        label_id,
      },
    });

    const data = response.json();
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(
      data.every((todo) => todo.label_id === label_id),
      true
    );
  });

  // Cleanup
  await clearDatabase(app);
  await app.close();
});

test("GET /todos sorting", async (t) => {
  // Setup
  app = await createTestServer();
  await seedData(app);

  await t.test("sorts by due_date ASC", async () => {
    const responseASC = await app.inject({
      method: "GET",
      url: "/todos",
      query: {
        sort_by: "due_date",
        sort: "ASC",
      },
    });

    const dataASC = responseASC.json();
    assert.strictEqual(responseASC.statusCode, 200);
    assert.strictEqual(
      dataASC.every((todo, index) => {
        if (index === 0) return true;

        return (
          getTimestamp(dataASC[index - 1].due_date) <=
          getTimestamp(todo.due_date)
        );
      }),
      true
    );
  });

  await t.test("sorts by due_date DESC", async () => {
    const responseDSC = await app.inject({
      method: "GET",
      url: "/todos",
      query: {
        sort_by: "due_date",
        sort: "DESC",
      },
    });

    const dataDSC = responseDSC.json();
    assert.strictEqual(responseDSC.statusCode, 200);
    assert.strictEqual(
      dataDSC.every((todo, index) => {
        if (index === 0) return true;

        return (
          getTimestamp(dataDSC[index - 1].due_date) >=
          getTimestamp(todo.due_date)
        );
      }),
      true
    );
  });

  // Cleanup
  await clearDatabase(app);
  await app.close();
});
