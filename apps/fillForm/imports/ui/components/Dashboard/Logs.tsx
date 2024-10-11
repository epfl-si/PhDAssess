/**
 * Put Notification logs (from activity logs, reminders) into the dashboard
 */

import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEnvelope, faPlus} from '@fortawesome/free-solid-svg-icons'

import {ITaskDashboard} from "/imports/policy/dashboard/type";
import {NotificationLog} from "phd-assess-meta/types/notification";
import {Step} from "phd-assess-meta/types/dashboards";
import {DashboardGraph} from "/imports/ui/components/Dashboard/DefinitionGraphed";
import {NotificationLogsListWithIcon} from "/imports/ui/components/Reminder/List";


/**
 * Print follow how many notifications has been sent
 * in the corresponding step
 */
export const NotificationsCountWithAddNewButton = (
  { step, task, canStartReminder }: {
    step: Step, task: ITaskDashboard, canStartReminder: boolean
  }) => {

  const notificationLogsForThisStep = task.notificationLogs.filter(
    // count the normal and the reminders
    (log: NotificationLog) =>
      (log.fromElementId === step.id || log.fromElementId === step.id + '_reminder')
  ) ?? []

  return <div className={
    `notification-log-step-count${ canStartReminder ? ' notification-log-step-count-with-plus-button' : '' }`
  }>
    <span className={ 'notification-log-step-count-number' }>
      { notificationLogsForThisStep.length }
    </span>
    <span className={ 'notification-log-step-count-envelope text-white' }>
      <FontAwesomeIcon icon={ faEnvelope } />
    </span>
    { canStartReminder &&
    <Link to={ `/tasks/${ task._id }/reminders/create` } className={ 'text-white' }>
      <FontAwesomeIcon icon={ faPlus } border className={'notification-log-step-plus'}/>
    </Link>
    }
  </div>
}

export const NotificationLogsAsCol = (
  { definition, workflowInstanceTasks }:
    { definition: DashboardGraph, workflowInstanceTasks: ITaskDashboard[] }
) => {

  return <>
    {
      definition.nodesOrdered().map((node) => {
        const step = definition.node(node) as Step

        return (
          <div
            className="dashboard-notification-log col text-black"
            key={ `${ workflowInstanceTasks[0]._id }-${ step.id }` }
          >
            <NotificationLogInStep
              step={ step }
              workflowInstanceTasks={ workflowInstanceTasks }
            />
          </div>
        )
      })
    }
  </>
}

const NotificationLogInStep = (
  { step, workflowInstanceTasks }:
    { step: Step, workflowInstanceTasks: ITaskDashboard[] }
) => {

  const currentTask = workflowInstanceTasks.find(
    (task) => task.elementId === step.id
  )

  const notificationLogs = currentTask?.notificationLogs.filter(
    (log: NotificationLog) => log.sentAt && log.fromElementId === step.id
  ) as NotificationLog[] ?? []

  return <div className={ `notification-log-step-${ step.id }` }>
    { notificationLogs && notificationLogs.length > 0 ?
      <NotificationLogsListWithIcon logs={ notificationLogs }/> :
      <span>&nbsp;</span>
    }
  </div>
}
