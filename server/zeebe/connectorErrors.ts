import {MongoInternals} from "meteor/mongo";
const mongodb = MongoInternals.NpmModules.mongodb.module;

/**
 * Identify if the provided error is well-known from Mongo
 * @param error
 */
export const isErrorFromMongoAndRetryable = (error: unknown) => {
  if (error instanceof mongodb.MongoError) {
    // if mongo can retry it later, we can too

    if (
      // @ts-ignore
      mongodb.isRetryableReadError(error) ||
      // @ts-ignore
      mongodb.isRetryableWriteError(error)
    ) {
      return true
    }
  }

  // battle tested in prod errors
  if (
    error instanceof mongodb.MongoServerSelectionError ||
    error instanceof mongodb.MongoNetworkError) {
    return true
  }
};
