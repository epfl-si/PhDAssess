import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  useParams
} from "react-router-dom";

import {DoctoralSchoolsList} from "/imports/ui/components/DoctoralSchools/List";
import {Dashboard} from "/imports/ui/components/Dashboard";

import {ImportScipersForSchool, ImportScipersSchoolSelector} from "/imports/ui/components/ImportSciper/List";
import TaskList from "/imports/ui/components/TaskList";
import React from "react";

import {TaskForm} from "/imports/ui/components/TaskForm";
import Main from "/imports/ui/Main";
import {Meteor} from "meteor/meteor";


function TaskEdit() {
  const {_id} = useParams<{ _id: string }>()
  return <TaskForm _id={_id!}/>
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Main />}
      errorElement={<Main />}
    >
      <Route index element={<TaskList />} />
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route
        path="/tasks/:_id"
        element={<TaskEdit/>}
        loader={
          async ({ params }) => {
            // @ts-ignore
            const task = await Meteor.applyAsync(
              'getTaskForm',
              [params._id],
              { wait: true }
            )

            return task ?? null
          }
        }
      />
      <Route path="/tasks/" element={<Navigate replace to="/" />} />
      <Route path="/doctoral-programs" element={<DoctoralSchoolsList/>}/>
      <Route path="/import-scipers/:doctoralSchool" element={<ImportScipersForSchool/>}/>
      <Route path="/import-scipers/" element={<ImportScipersSchoolSelector/>} />
    </Route>
  )
)
