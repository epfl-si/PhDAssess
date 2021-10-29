import {useTracker} from "meteor/react-meteor-data"
import {Meteor} from "meteor/meteor"
import {Task, Tasks} from "/imports/api/tasks"
import _ from "lodash"
import React from "react"
import {Loader} from "@epfl/epfl-sti-react-library";
import {canAccessDashboard} from "/imports/policy/tasks";
import {Link} from "react-router-dom";
import {getAssignee} from "/imports/model/participants";


/*
 * TODO: manage unknown steps, it can happens in the future if we had a step without extending phdAssessSteps
 * TODO: load directly from bpmn ?
 */

/*
 * Define every steps, like in the bpmn. If there are parallel steps, put them inside an array
 */
const phdAssesSteps = [
  {
    id: 'Activity_PHD_fills_annual_report',
    label: 'Phd fills annual report',
  },
  [
    {
      id: 'Activity_Thesis_Co_Director_fills_annual_report',
      label: 'Co-Dir fills annual report',
    },
    {
      id: 'Activity_Thesis_Director_fills_annual_report',
      label: 'Thesis Dir fills annual report',
    },
  ],
  {
    id: 'Activity_Thesis_Director_Collaborative_Review_Signs',
    label: 'Collaborative review',
  },
  {
    id: 'Activity_Thesis_Co_Director_Signs',
    label: 'Co-Dir signature',
  },
  {
    id: 'Activity_Thesis_Director_Signs',
    label: 'Thesis Dir signature',
  },
  {
    id: 'Activity_PHD_Signs',
    label: 'PhD signature',
  },
  [
    {
      id: 'Activity_Post_Mentor_Meeting_Mentor_Signs',
      label: 'Mentor signature',
    },
    {
      id: 'Activity_Post_Mentor_Meeting_PHD_Signs',
      label: 'PhD signature after mentor',
    },
  ],
  {
    id: 'Activity_Program_Director_Signs',
    label: 'Program Director signature',
  },
]

/*
 * only for admins && programAssistant (can see all?)
 *
 */
// here we can get multiple task, as they should be grouped by workflow instance id
// if they are multiple, that means we are waiting for two steps = 2 blue color
type DrawProgressProps = {
  tasks: Task[]
}

const DrawProgress = ({tasks}: DrawProgressProps) => {

  let pendingDone = false
  let parallelPendingDone = false
  let pendingTasksIds = tasks.map(task => task.elementId)

  return (<>
    {
    phdAssesSteps.map((x, i) => {
      if (Array.isArray(x)) {
        // having an array means we can have multiple pending, or some pending, some finished. Let's discover it
        const multipleSteps = x.map((y, j) => {
          const task = tasks.find(t => t.elementId === y.id)
          const taskKey = `${task?.key}_${i}_${j}`
          if (pendingDone) {
            return <div key={ taskKey } className="participant border col m-1 p-2 text-white"/>
          } else if (pendingTasksIds.includes(y.id)) {
            parallelPendingDone = true
            return <div key={ taskKey }
                        className="participant border col m-1 p-2 bg-awaiting text-white"
                        data-toggle="tooltip"
                        data-html="true"
                        title={ `${getAssignee(task!.variables.assigneeSciper, task!.participants)?.name} (${task!.variables.assigneeSciper}), Last updated :${task!.updated_at!.toLocaleString('fr-CH')}` }
            />
          } else {
            return <div key={ taskKey } className="participant border col m-1 p-2 bg-success text-white"/>
          }
        })

        if (parallelPendingDone) pendingDone = true
        return multipleSteps
      }
      else {
        const task = tasks.find(t => t.elementId === x.id)
        const taskKey = `${task?.key}_${i}`
        if (pendingTasksIds.includes(x.id)) {
          pendingDone = true
          return <div key={ taskKey }
                      className="participant border col m-1 p-2 bg-awaiting text-white"
                      data-toggle="tooltip"
                      data-html="true"
                      title={ `${getAssignee(task!.variables.assigneeSciper, task!.participants)?.name} (${task!.variables.assigneeSciper}), Last updated :${task!.updated_at!.toLocaleString('fr-CH')}` }
          />
        } else if (pendingDone) {
          return <div key={ taskKey } className="participant border col m-1 p-2 text-white"/>
        }
        else {
          return <div key={ taskKey } className="participant border col m-1 p-2 bg-success text-white"/>
        }
      }
    })
  }</>)
}

export function Dashboard() {
  const userLoaded = !!useTracker(() => {
    return Meteor.user();
  }, []);

  if (!userLoaded) return (<div>Loading user</div>)
  if (userLoaded && !canAccessDashboard()) return (<div>Your permission does not allow you to see the dashboard </div>)

  const listLoading = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    const handle = Meteor.subscribe('tasksDashboard');
    return !handle.ready();
  }, []);

  const allTasks = useTracker(
    () => Tasks.find({}, { sort: { 'variables.created_at': 1 } })
      .fetch())
      .filter((task) => task.elementId !== 'Activity_Program_Assistant_Assigns_Participants')
  const groupByWorkflowInstanceTasks = _.groupBy(allTasks, 'workflowInstanceKey')

  return (
    <>
      {listLoading ? (
        <Loader message={'Fetching tasks...'}/>
      ) : (
        allTasks.length === 0 ? (
          <div>There is currently no task</div>
          ) : (
          <div className="container small dashboard">
            <div className="row" key={ `dashboard_title_row` }>
              <div className="participant col-2 m-1 p-2 text-black align-self-end">Name</div>
              <div className="participant col m-1 p-2 text-black align-self-end">Program</div>
              {
                _.flatten(phdAssesSteps).map((step) => <div className="participant col m-1 p-2 text-black align-self-end" key={step.id}>{step.label}</div>)
              }
            </div>
            {
              Object.keys(groupByWorkflowInstanceTasks).map((taskGrouper: string) => {
                const workflowInstanceTasks = groupByWorkflowInstanceTasks[taskGrouper]
                return (
                  <div className="row" key={ `${workflowInstanceTasks[0].key}_main_div` }>
                    <div className="participant col-2 m-1 p-2 text-black" key={ `${workflowInstanceTasks[0].key}_phdStdentName` } >{ workflowInstanceTasks[0].variables.phdStudentName }</div>
                    <div className="participant col m-1 p-2 text-black" key={ `${workflowInstanceTasks[0].key}_doctoralProgramName` } >{ workflowInstanceTasks[0].variables.doctoralProgramName }</div>
                    <DrawProgress tasks={ workflowInstanceTasks }  key={ workflowInstanceTasks[0].key } />
                  </div>
                )
              })
            }
          </div>)
      )}
    </>
  )
}

export const LinkToDashboard = () => {
  const userLoaded = useTracker(() => {
    return Meteor.user();
  }, []);

  return (<>
    {
      userLoaded && canAccessDashboard() &&
      <div className={'mb-3'}>
        <Link to={`/dashboard`}>Dashboard</Link>
      </div>
    }
  </>)
}