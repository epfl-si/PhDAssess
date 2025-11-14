/**
 * Determines if the provided exception is a nonspecific DDP error,
 * specifically an Internal Server Error from Meteor.
 *
 * @see https://guide.meteor.com/methods#throwing-errors
 * @param {Error} exception - The exception object to check.
 * @returns {boolean} True if the exception is a nonspecific DDP error, otherwise false.
 */
export const isNonspecificDdpError = (exception: Error): boolean => (
  exception instanceof Meteor.Error && `${exception.reason}` === "Internal server error"
)
