import { ApolloLink } from 'apollo-link';

/**
 * Raise the value of the first parameter to the power of the second using the es7 `**` operator.
 *
 * ### Example (es module)
 * ```js
 * import { power } from 'typescript-starter'
 * console.log(power(2,3))
 * // => 8
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var power = require('typescript-starter').power;
 * console.log(power(2,3))
 * // => 8
 * ```
 */

export default function link(opts: any): any {
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
