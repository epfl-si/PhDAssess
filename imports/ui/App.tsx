import React, {CSSProperties} from 'react';
import {
  BrowserRouter, Route, Routes,
  useParams, useLocation, matchPath, Navigate
} from "react-router-dom"
import {FooterLight, Breadcrumbs} from "@epfl/epfl-sti-react-library"
import {PhDHeader} from "./components/PhDHeader"
import TaskList from "./components/TaskList"
import {Task} from "./components/Task"
import {ZeebeStatus} from "/imports/ui/components/ZeebeStatus"
import {Toaster} from "react-hot-toast";
import {DoctoralSchoolsList} from "/imports/ui/components/DoctoralSchools/list";
import {Dashboard} from "/imports/ui/components/Dashboard";
import {useTracker} from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";
import {canAccessDashboard} from "/imports/policy/tasks";
import {AsideMenu} from "/imports/ui/components/AsideMenu";


export const App = () => {
  const userLoaded = useTracker(() => {
    return Meteor.user();
  }, []);

  const mainPanelBackgroundColor: CSSProperties = Meteor.settings.public.isTest ? { backgroundColor: 'Cornsilk'} : {}

  return (
    <BrowserRouter>
      <Toaster/>
      <PhDHeader/>
      <PhDBreadcrumbs/>
      <div className={ 'nav-toggle-layout nav-aside-layout' }>
        {userLoaded && canAccessDashboard() &&
          <AsideMenu/>
        }
        <div className="container" style={ mainPanelBackgroundColor }>
          { Meteor.settings.public.isTest &&
            <div className={'alert alert-info'} role={'alert'}><strong>Testing</strong> You are on the testing environment.</div>
          }
          <Routes>
            <Route path="/doctoral-schools" element={<DoctoralSchoolsList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks/:key" element={<TheTask />} />
            <Route path="/tasks/" element={<Navigate replace to="/" />} />
            <Route path="/" element={<TaskList />} />
          </Routes>
        </div>
      </div>
      <ZeebeStatus/>
      <FooterLight/>
    </BrowserRouter>
  );
}

function TheTask() {
  const {key} = useParams<{ key: string }>()
  return <Task workflowKey={key!}/>
}

function PhDBreadcrumbs() {
  const breadcrumbs = [
    {link: "https://www.epfl.ch/education/phd/", anchor: "Doctoral School"},
    // TODO: We should fashion this out of a <Link>
    {link: "/", anchor: "Annual Report"}
  ]

  const { pathname } = useLocation()

  matchPath("/", pathname) && breadcrumbs.push({link: "/", anchor: "Tasks list"})
  matchPath("tasks/*", pathname) && breadcrumbs.push({link: "/", anchor: "Tasks"}) &&  breadcrumbs.push({link: pathname, anchor: "Proceeding"})
  matchPath("/dashboard", pathname) &&breadcrumbs.push({link: "/dashboard", anchor: "Tasks dashboard"})
  matchPath("/doctoral-schools", pathname) && breadcrumbs.push({link: "/doctoral-schools", anchor: "Doctoral schools administration"})

  return <Breadcrumbs items={breadcrumbs}/>
}
