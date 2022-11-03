import {Link, matchPath, useLocation} from "react-router-dom";
import React from "react";
import {useSubscribe} from "meteor/react-meteor-data";

import {useAccountContext} from "/imports/ui/components/Account";
import {canEditAtLeastOneDoctoralSchool} from "/imports/policy/doctoralSchools";
import {canImportScipersFromISA} from "/imports/policy/importScipers";


export const AsideMenu = () => {
  const account = useAccountContext()
  const { pathname } = useLocation()
  useSubscribe('doctoralSchools');

  return (
    <aside className="nav-aside-wrapper">
      <nav id="nav-aside" className="nav-aside" role="navigation" aria-describedby="nav-aside-title">
        <ul>
          { account && account.user && canEditAtLeastOneDoctoralSchool(account.user) &&
            <li>
              <a href="#">
                Doctoral Programs
              </a>
              <ul>
                <li className={matchPath("/doctoral-programs", pathname) ? 'active' : undefined}><Link
                  to={`/doctoral-programs`}>Administration</Link></li>
              </ul>
            </li>
          }
          <li>
            <a href="#">
              Tasks
            </a>
            <ul>
              <li className={matchPath("/", pathname) ? 'active' : undefined }><Link to={`/`}>List</Link></li>
              <li className={matchPath("/dashboard", pathname) ? 'active' : undefined}><Link
                to={`/dashboard`}>Dashboard</Link></li>
                { account && account.user && canImportScipersFromISA(account.user) &&
                  <li className={matchPath("/import-scipers", pathname) ? 'active' : undefined }><Link
                    to={`/import-scipers`}>Import scipers</Link></li>
                }
            </ul>
          </li>
        </ul>
    </nav>
    </aside>
  )
}
