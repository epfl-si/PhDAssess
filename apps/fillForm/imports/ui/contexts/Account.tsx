/**
 * Provide a reactive context for user info
 */
import {Meteor} from "meteor/meteor";
import {Accounts} from 'meteor/accounts-base';
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
