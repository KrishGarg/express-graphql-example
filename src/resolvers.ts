import { Resolvers } from "./generated/graphql";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const resolvers: Resolvers = {
  Query: {
    hi: () => "Hello World!",
  },
  Subscription: {
    greeting: {
      subscribe: () => ({
        [Symbol.asyncIterator]: () => pubsub.asyncIterator("GREETING"),
      }),
    },
  },
};

const greets = ["Hello", "Hola", "Bonjour", "Ciao", "Hallo", "Hej", "Olá"];

setInterval(() => {
  pubsub.publish("GREETING", {
    greeting: greets[Math.floor(Math.random() * greets.length)],
  });
}, 2000);

export default resolvers;
