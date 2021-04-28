import React from 'react';
import {
  BrowserRouter as Router, RouteProps, Route, Switch,
  useParams, useRouteMatch
} from "react-router-dom"
import {Footer} from "epfl-sti-react-library"
import {PhDHeader} from "./components/PhDHeader"
import {Breadcrumbs} from "epfl-sti-react-library"
import TaskList from "./components/TaskList"
import {Task} from "./components/Task"
import WorkflowLauncher from "./components/WorkflowLauncher"

const PageRoute: React.FC<RouteProps> = (props) => (
  <Route {...props}>
    <PhDHeader/>
    <PhDBreadcrumbs/>
    <div className="nav-toggle-layout nav-aside-layout">
      <div className="container">
        {props.children}
      </div>
    </div>
    <Footer/>
  </Route>
)

export const App = () => (
  <Router>
    <Switch>
      <PageRoute exact path="/">
        <TaskList/>
        <WorkflowLauncher/>
      </PageRoute>
      <PageRoute path="/tasks/:key">
        <TheTask/>
      </PageRoute>
    </Switch>
  </Router>
)

function TheTask() {
  const {key} = useParams<{ key: string }>()
  return <Task workflowKey={key}/>
}

function PhDBreadcrumbs() {
  const breadcrumbs = [
    {link: "https://www.epfl.ch/education/phd/", anchor: "École Doctorale"},
    // TODO: We should fashion this out of a <Link>
    {link: "/", anchor: "PhDperf"}
  ]

  const {path} = useRouteMatch()
  if (path.includes("/tasks/")) {
    // TODO: here, too
    breadcrumbs.push({link: "/", anchor: "Tasks"})
  }

  return <Breadcrumbs items={breadcrumbs}/>
}
