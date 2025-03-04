# Install

?? service-configuration ??
meteor add epfl-si:entra-oauth
meteor add epfl-si:accounts-entra

# Setup

Create entraAuth.ts in server side with this content: 
```
import { ServiceConfiguration } from "meteor/service-configuration";


export const setEntraAuthConfig = () => {
  // Validate the env values
  const clientId = process.env.AUTH_ENTRA_CLIENT_ID
  const secret = process.env.AUTH_ENTRA_SECRET
  const tenantId = process.env.AUTH_ENTRA_TENANT_ID

  if ( !(
    clientId && secret && tenantId
  )) {
    throw Error(`
      Missing env vars: 
        AUTH_ENTRA_CLIENT_ID or
        AUTH_ENTRA_SECRET or
        AUTH_ENTRA_TENANT_ID
      `)
  }

  // set the entra config
  ServiceConfiguration.configurations.upsert(
    { service: "entra" },
    {
      $set: {
        getTokenBaseURL: "https://login.microsoftonline.com",
        getTokenAfterTenantURL: "oauth2/v2.0/token",

        refreshTokenBaseURL: "https://login.microsoftonline.com",
        refreshTokenAfterTenantURL: "oauth2/v2.0/token",

        loginBaseURL: "https://login.microsoftonline.com",
        loginAfterTenantURL: "oauth2/v2.0/authorize",

        clientId: clientId,
        secret: secret,
        tenantId: tenantId,
        loginStyle: 'popup', //'redirect',
      },
    }
  );
}
```

# For React
Be reactive (aka add usable component):
```
/**
 * Provide a reactive context for user info
 */
import {Meteor} from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import React, {useContext} from 'react'
import {createContext} from "react";
import {useTracker} from 'meteor/react-meteor-data'

interface AccountContextInterface {
  user: Meteor.User | null;
  userId: string | null;
  isLoggedIn: boolean;
  loginServiceConfigured: boolean;
}

const useAccount = () => useTracker(() => {
  const user = Meteor.user()
  const userId = Meteor.userId()
  const loginServiceConfigured = Accounts.loginServicesConfigured()
  return {
    user,
    userId,
    isLoggedIn: !!userId,
    loginServiceConfigured: loginServiceConfigured
  }
}, [])

export const AccountContext = createContext<AccountContextInterface | null>(null)

export const AccountProvider = (props: any) => (
  <AccountContext.Provider value={useAccount()}>
    {props.children}
  </AccountContext.Provider>
)

export const useAccountContext = () => useContext(AccountContext)
```
With, as blocker any login before this :
```
const account = useAccountContext()
if (!account.userId() && !account?.loginServiceConfigured) return <>Loading auth info...</>
```

# UI

Add this:
```
    <a
      href={''}
      onClick={
        () => {
          Meteor.loginWithEntra(
            options = {},
            callback = (error: any) => {
              if (error) {
                alert(`Login failed: ${ JSON.stringify(error) }`);
              } else {
                alert(`Successful login !`);
              }
            },
          );
        }
      }
    >Login Entra</a>
```

# For dev

Add your ROOT_URL in your current env. Should be a https, as Entra force it.
That's why I added a nginx conf locally to redirect https to http.
