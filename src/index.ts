import express from "express";
import { graphqlHTTP } from "express-graphql";
import expressPlayground from "graphql-playground-middleware-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";

// Importing resolvers and type definitions
import { Context, resolvers } from "./resolver";
import typeDefs from "./typeDefs";

// Made the check a variable as the check can change from environment to enviroment
const isInProduction = process.env.NODE_ENV === "production";

// Loading local env variables in development.
if (!isInProduction) {
  import("path").then(async ({ resolve }) => {
    const { config } = await import("dotenv");
    config({
      path: resolve(__dirname, ".env.local"),
    });
  });
}

const app = express();

app.use(cors());

const PORT = process.env.PORT ?? 4000;

// Creating the executable schema
const schema = makeExecutableSchema<Context>({
  typeDefs,
  resolvers,
});

// Redirecting to playground in development
app.get("/", (_, res) => {
  if (!isInProduction) {
    return res.redirect("/playground");
  }
  return res.send("<pre>Cannot GET /</pre>");
});

// Defining the graphql server as middleware.
app.use("/graphql", (req, res) => {
  return graphqlHTTP({
    schema,
    context: { req, res },
  })(req, res);
});

// Configuring the graphql-playground as much better UI than Graphiql
app.get(
  "/playground",
  expressPlayground({
    endpoint: "/graphql/",
  })
);

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
