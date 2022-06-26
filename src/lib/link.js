import { ApolloLink } from "apollo-link";

export default function link(opts) {
  const { analytics, operationWhitelist } = {
    analytics: window.analytics,
    operationWhitelist: ["query", "mutation", "subscription"],
    ...opts,
  };

  return new ApolloLink((operation, forward) => {
    const operationType = operation.query.definitions[0].operation;
    const shouldTrack = operationWhitelist.includes(operationType);

    return forward(operation).map((data) => {
      const { operationName } = operation;
      if (operationName && shouldTrack) {
        // only track mutations.
        analytics.track(operationName, operation);
      }
      return data;
    });
  });
}
