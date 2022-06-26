import { OperationTypeNode } from "graphql";

type Opts = {
  analytics?: {
    track: (eventName: string, payload: any) => void;
  };
  operationWhitelist?: OperationTypeNode[];
};

// TODO update any to ApolloLink
type link = (opts: Opts) => any;
export default link;
