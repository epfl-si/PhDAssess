/**
 * Declare the account package connecting through Entra
 *
 * @see {@link https://github.com/epfl-si/meteor-account-entra}
 */
declare module "meteor/meteor" {
  module Meteor {
    function entraSignIn(
      options?: {
        requestPermissions: string[];
      },
      callBack?: (error: any) => void
    ): void
  }
}

/**
 * Declare the missing methods from the account-base package
 */
declare module "meteor/accounts-base" {
  namespace Accounts {
    function beforeExternalLogin(
      func:(
        serviceName: string,
        serviceData: any,
        user: any
      ) => boolean
    ): void
    function onExternalLogin(
      func:(
        options: string,
        user: any
      ) => void
    ): void
  }
}
