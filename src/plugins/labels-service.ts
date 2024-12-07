import { Label } from "@/modules/todos/schemas/todos.js";
import axios from "axios";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { createCache } from "cache-manager";

import { Keyv } from "keyv";
import QuickLRU from "quick-lru";

const labelsCache = createCache({
  stores: [
    //  High performance in-memory cache with LRU
    new Keyv({
      store: new QuickLRU({
        maxSize: 1000,
      }),
      ttl: 1000 * 60 * 60,
    }),
  ],
});

const labelsInstance = axios.create({
  baseURL: "https://nptwpxthvb.eu-west-1.awsapprunner.com",
  timeout: 60000,
});


declare module "fastify" {
  interface FastifyInstance {
    labelsService: typeof labelsService;
  }
}

async function getLabels() {
  const labels = await labelsCache.wrap(
    "labels",
    async () =>
      await labelsInstance.get<Label[]>("/labels").then((res) => res.data),
    1000 * 60 * 60
  );

  return labels;
}

async function getLabel(id: string) {
  const label = await labelsCache.wrap(
    `labels_${id}`,
    async () =>
      await labelsInstance.get<Label>(`/labels/${id}`).then((res) => res.data),
    1000 * 60 * 60
  );

  return label;
}


 const createBadRequestError = (message: string) => ({
  message,
  statusCode: 400,
  error: "Bad Request",
  code: "LABEL_SERVICE_ERROR",
});

const labelsService = {
  getLabels,
  getLabel,
  createBadRequestError
};

async function labelsServicePlugin(fastify: FastifyInstance) {
  fastify.decorate("labelsService", labelsService);
}

export default fp(labelsServicePlugin, {
  name: "labelsService"
});
