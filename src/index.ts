import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import express from "express";
import http from "http";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import { readFileSync } from "node:fs";
import { join } from "node:path";

const typeDefs = readFileSync(join(__dirname, "schema.graphql"), "utf8");
import resolvers from "./resolvers";

const PORT = process.env.PORT || 4000;

async function startApolloServer() {
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();
  server.applyMiddleware({
    app,
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
