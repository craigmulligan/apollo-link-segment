import { OperationTypeNode } from "graphql";
import { ApolloLink } from "apollo-link";

type Opts = {
  analytics?: {
    track: (eventName: string, payload: any) => void;
  };
  operationWhitelist?: OperationTypeNode[];
};

export default function link(opts: Opts): ApolloLink;
