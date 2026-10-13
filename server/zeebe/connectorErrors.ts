import {MongoInternals} from "meteor/mongo";
const mongodb = MongoInternals.NpmModules.mongodb.module;

// Tricky part: the driver's isRetryableReadError/isRetryableWriteError are
// internal helpers of mongodb/lib/error.js and are NOT exported from the public
// 'mongodb' module, so calling them on the module object fails both in
// TypeScript ("property does not exist") and at runtime ("is not a function").
// We therefore replicate their logic by hand, using only the public API:
// - isRetryableWriteError(error) is just
//   error.hasErrorLabel('RetryableWriteError') (plus an internal pool-retry label)
// - isRetryableReadError(error) checks the error code against the driver's
//   internal RETRYABLE_READ_ERROR_CODES, which RETRYABLE_ERROR_CODES below
//   mirrors (the network-error and legacy-message branches are covered by the
//   MongoNetworkError / MongoServerSelectionError / code checks below)
const RETRYABLE_ERROR_CODES = new Set<number>([
  6, // HostUnreachable
  7, // HostNotFound
  89, // NetworkTimeout
  91, // ShutdownInProgress
  189, // PrimarySteppedDown
  262, // ExceededTimeLimit
  9001, // SocketException
  10107, // NotWritablePrimary
  11600, // InterruptedAtShutdown
  11602, // InterruptedDueToReplStateChange
  13435, // NotPrimaryNoSecondaryOk
  13436, // NotPrimaryOrSecondary
]);

/**
 * Identify if the provided error is a well-known Mongo error that is
 * retryable: true when Mongo (or the driver) would retry the failing
 * operation later, false for any other error.
 * @param error
 */
export const isErrorFromMongoAndRetryable = (error: unknown): boolean => {
  if (error instanceof mongodb.MongoError) {
    // if mongo can retry it later, we can too

    if (
      error.hasErrorLabel(mongodb.MongoErrorLabel.RetryableWriteError) ||
      (typeof error.code === "number" &&
        RETRYABLE_ERROR_CODES.has(error.code))
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

  // the network to mongo can be cut
  if (
    error instanceof Error &&
    (error as NodeJS.ErrnoException).code === "ECONNRESET"
  ) {
    return true;
  }

  return false;
};
