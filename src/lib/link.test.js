/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";
import Observable from "zen-observable";
import segmentLink from "./link";
import gql from "graphql-tag";
import { MockLink, SetContextLink } from "apollo-link/lib/test-utils";
import { execute, from } from "apollo-link";

const createOp = (opType = "query") => {
  const sampleQuery = gql`
    ${opType} SampleQuery {
      stub {
        id
      }
    }
  `;

  return {
    query: sampleQuery,
    context: { name: "uniqueName" },
    operationName: "SampleQuery",
    extensions: {},
  };
};

const runLinks = (link, cb) => {
  const data = {
    data: {
      id: 1,
    },
  };

  const l = from([
    new SetContextLink(setContext),
    link,
    new MockLink(() => Observable.of(data)),
  ]);

  const ob = execute(l, createOp());
  ob.subscribe({
    next: cb,
    error: () => {
      throw new Error();
    },
  });

  return ob;
};

const setContext = () => ({ add: 1 });

describe("analytics", () => {
  test("tracks queries", (done) => {
    const analytics = {
      track: jest.fn(),
    };

    const link = segmentLink({ analytics });

    runLinks(link, (_) => {
      expect(analytics.track).toHaveBeenCalledWith(
        "SampleQuery",
        expect.anything()
      );
      done();
    });
  });

  test("tracks whitelist ops", (done) => {
    const analytics = {
      track: jest.fn(),
    };

    const link = segmentLink({ analytics, operationWhitelist: ["mutation"] });

    runLinks(link, (_) => {
      expect(analytics.track).not.toHaveBeenCalled();
      done();
    });
  });
});
