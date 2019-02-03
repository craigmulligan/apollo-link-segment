# apollo-link-segment

Auto analytics for apollo apps

## Installing / Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

A quick introduction of the minimal setup you need to get a hello world up & running.

```shell
npm install apollo-link-segment
```

### Prerequisites

- Apollo Link.

### Usage

By default the link assumes segment is ready for use at `window.analytics`.

```javascript
import apolloSegment from 'apollo-link-segment';

ApolloLink.from([apolloLogger()]);
```

But you can pass a custom analytics instance to use

```javascript
import apolloSegment from 'apollo-link-segment';

ApolloLink.from([
  apolloLogger({
    analytics: segmentInstance
  })
]);
```

By default all operation types will be tracked by you can optionally provide a whitelist.

```javascript
import apolloSegment from 'apollo-link-segment';

ApolloLink.from([
  apolloLogger({
    // only mutations will be tracked
    operationWhitelist: ['mutation']
  })
]);
```
