import { ApolloLink } from 'apollo-link';
import { OperationTypeNode } from 'graphql';

type Opts = {
  analytics?: {
    track: (string, any) => void;
  };
  operationWhitelist?: OperationTypeNode[];
};

export default function link(opts: Opts): any {
  // @ts-ignore
  const { analytics, operationWhitelist } = {
    // @ts-ignore
    analytics: (<any>window).analytics,
    operationWhitelist: ['query', 'mutation', 'subscription'],
    ...opts
  };

  return new ApolloLink((operation, forward) => {
    // @ts-ignore
    const operationType = operation.query.definitions[0].operation;
    const shouldTrack = operationWhitelist.includes(operationType);

    // @ts-ignore
    return forward(operation).map(data => {
      const { operationName } = operation;
      if (operationName && shouldTrack) {
        // only track mutations.
        analytics.track(operationName, operation);
      }
      return data;
    });
  });
}
