import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    helloWorld: String
  }
`;

export default typeDefs;
