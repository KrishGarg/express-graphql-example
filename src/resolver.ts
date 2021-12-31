import { Request, Response } from "express";
import { IResolvers } from "@graphql-tools/utils";

interface Context {
  req: Request;
  res: Response;
}

const resolvers: IResolvers<any, Context> = {
  Query: {
    helloWorld: (_, args, ctx) => {
      return "Hello World";
    },
  },
};

export { Context, resolvers };
