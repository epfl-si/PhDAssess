import {Meteor} from "meteor/meteor";
import React, {CSSProperties, useEffect} from "react";
import {Outlet, useRouteError} from "react-router-dom";
import {FooterLight} from "@epfl/epfl-sti-react-library"
import {Loader} from "@epfl/epfl-sti-react-library";

import {ToasterConfig} from "/imports/ui/components/Toasters";
import {PhDHeader} from "/imports/ui/components/PhDHeader";
import {PhDBreadcrumb} from "/imports/ui/components/Breadcrumb";
import {AsideMenu} from "/imports/ui/components/AsideMenu";
import {ConnectionStatusFooter} from "/imports/ui/components/ConnectionStatus";
import {useAccountContext} from "/imports/ui/contexts/Account";


/**
 * This component oblige user to be connected to continue
 */
const AutoLoginComponent = () => {
  useEffect(() => {
    Meteor.entraSignIn();
  });
  return <></>
}

/**
 * The base UI for all pages, where other pages are rendered into
 */
export default function Main() {
  const mainPanelBackgroundColor: CSSProperties = Meteor.settings.public.isTest && !Meteor.settings.public.ignoreTestBackgroundColor ? {backgroundColor: 'Cornsilk'} : {}

  const account = useAccountContext()
  const error:any = useRouteError();

  if (!account?.loginServiceConfigured) return <div><Loader message={'Signing in...'}/></div>

  if (!account?.userId) {
    return <div><Loader message={'Signing in...'}/><AutoLoginComponent/></div>
  } else {
    return <>
      <ToasterConfig/>
      <PhDHeader/>
      <PhDBreadcrumb/>
      <div className={ 'main nav-toggle-layout nav-aside-layout' }>
        <AsideMenu/>
        <div className="container" style={ mainPanelBackgroundColor }>
          { Meteor.settings.public.isTest &&
            <div className={'alert alert-info'} role={'alert'}><strong>Testing</strong> You are on the testing environment.</div>
          }
          { error ?
            <div id="error-page">
              <h2>Oops!</h2>
              <p>Sorry, an unexpected error has occurred.</p>
              <p>
                {error.statusText || error.message}
              </p>
            </div>
            :
            <Outlet/>
          }
        </div>
      </div>
      <ConnectionStatusFooter/>
      <FooterLight/>
    </>
  }
}
