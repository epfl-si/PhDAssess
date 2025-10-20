/**
 * Additional fields in the 'Meteor.User' objects
 *
 * @see imports/model/user
 */

declare module "meteor/meteor" {
    module Meteor {
        interface User {
            displayName: string
            isAdmin: boolean
            isUberProgramAssistant: boolean
            groupList: string[]
            // this one is kept as a generated field
            // as some formio fields use them
            tequila: {
              displayname: string
            }
        }
    }
}

// used in User.services
export type UserServiceEntra = {
  entra: {
    id: string
    groups: string[]
    uniqueid: string
    gaspar: string
    given_name: string
    family_name: string
    mail: string
    idToken: string
    accessToken: string
    scope: string[]
    expiresAt: number
  }
}
