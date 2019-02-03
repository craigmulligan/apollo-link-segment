// tslint:disable
import browserEnv from 'browser-env';
import Observable from 'zen-observable-ts';
import test from 'ava';
import sinon from 'sinon';
import segmentLink from './link';
import gql from 'graphql-tag';
import { MockLink, SetContextLink } from 'apollo-link/lib/test-utils';
import { execute, from } from 'apollo-link';
browserEnv();

const createOp = (opType = 'query') => {
  const sampleQuery = gql`
    ${opType} SampleQuery {
      stub {
        id
      }
    }
  `;

  return {
    query: sampleQuery,
    context: { name: 'uniqueName' },
    operationName: 'SampleQuery',
    extensions: {}
  };
};

const runLinks = (link, cb) => {
  const data = {
    data: {
      id: 1
    }
  };

  const l = from([
    new SetContextLink(setContext),
    link,
    new MockLink(() => Observable.of(data))
  ]);

  const ob = execute(l, createOp());
  ob.subscribe({
    next: cb,
    error: () => {
      throw new Error();
    }
  });

  return ob;
};

const setContext = () => ({ add: 1 });

test('tracks queries', t => {
  const analytics = {
    track: sinon.spy()
  };

  const link = segmentLink({ analytics });

  return runLinks(link, _ => {
    t.true(analytics.track.called);
    t.true(analytics.track.calledWith('SampleQuery'));
  });
});

test('tracks whitelist ops', t => {
  const analytics = {
    track: sinon.spy()
  };

  const link = segmentLink({ analytics, operationWhitelist: ['mutation'] });

  return runLinks(link, _ => {
    t.false(analytics.track.called);
  });
});
