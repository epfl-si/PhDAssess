import { Accounts } from "meteor/accounts-base";

const debug = require('debug')('server/auth')


Accounts.beforeExternalLogin((serviceName: string, serviceData: any, user: any) => {
  debug(`beforeExternalLogin called:
    ${JSON.stringify(serviceName)},
    ${JSON.stringify(serviceData)},
    ${JSON.stringify(user)}
  `);

  return true; // allow to connect
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
Accounts.onCreateUser((options, user) => {
  debug(`onCreateUser called: ${JSON.stringify(options)}, ${JSON.stringify(user)}`);
  user._id = user.services.entra.employeeId;
  return user;
});
