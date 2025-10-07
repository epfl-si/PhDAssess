import { Accounts } from "meteor/accounts-base";

const debug = require('debug')('server/auth')


Accounts.beforeExternalLogin((serviceName: string, serviceData: any, user: any) => {
  debug(`beforeExternalLogin called:
    ${JSON.stringify(serviceName)},
    ${JSON.stringify(serviceData)},
    ${JSON.stringify(user)}
  `);

  return true; // allow connecting
});

Accounts.onExternalLogin((options:any, user: any) => {
  debug(`onExternalLogin called:
    ${JSON.stringify(options)},
    ${JSON.stringify(user)}`
  );
});

/**
 * Use sciper as Mongo _id
 */
Accounts.onLogin((loginDetails: any) => {
  debug(`onLogin called: ${JSON.stringify(loginDetails)}`);
});

/**
 * Fix some Entra specific cases that are not compatible with our usage
 */
Accounts.onCreateUser((options, user) => {
  debug(`onCreateUser called: ${JSON.stringify(options)}, ${JSON.stringify(user)}`);

  // Use sciper as Mongo _id
  user._id = user.services.entra.uniqueid;

  // When setting groups, remove ending suffix in Entra groups that were added by entra
  user.groupList = user.services.entra.groups?.map(
    ( groupName: string ) => groupName.replace(/_AppGrpU$/, '')
  )

  return user;
});
