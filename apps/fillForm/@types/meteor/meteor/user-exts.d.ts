/**
 * Additional fields in the Meteor.User objects
 *
 * @see imports/model/user
 */

declare module "meteor/meteor" {
    module Meteor {
        interface User {
            displayname: string
            isAdmin: boolean
            isUberProgramAssistant: boolean
            groupList: string[]
            tequila: {
              provider: string
              email: string
              displayname: string
              firstname: string
              name: string
              personaltitle: string
              group: string
              user: string
              org: string
            }
        }
    }
}
