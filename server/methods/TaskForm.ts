import {Meteor} from "meteor/meteor";
import {encrypt} from "/server/encryption";
import {Tasks} from "/imports/model/tasks";
import {FormioActivityLog} from "/imports/model/tasksTypes";
import {
  filterUnsubmittableVars, canSubmit,
  getUserPermittedTaskDetailed
} from "/imports/policy/tasks";
import _ from "lodash";

import WorkersClient from '../zeebe_broker_connector'
import {getParticipantsToUpdateFromSciper} from "/server/userFetcher";
import {auditLogConsoleOut} from "/imports/lib/logging";

// load methods from shared js
import '/imports/api/doctoralSchools/methods'
import '/server/methods/ImportScipers'
import '/server/methods/DoctoralSchools'

const auditLog = auditLogConsoleOut.extend('server/methods/TaskForm')


Meteor.methods({

  async getTaskForm(_id) {
    let user: Meteor.User | null = null
    if (this.userId) {
      user = Meteor.users.findOne({_id: this.userId}) ?? null
    }

    if (!user) return

    const task = getUserPermittedTaskDetailed(user, _id)?.fetch()

    if (task && task[0]) {
      return task[0]
    } else {
      auditLog(`Error: the task that is trying to be edited can not be found or the user has no the correct rights. Task key requested: ${_id}.`)
      throw new Meteor.Error(404, 'Unknown task or unallowed permission', 'Check the task exist by refreshing your browser')
    }
  },

  async submit(_id, formData, formMetaData: FormioActivityLog) {
    let user: Meteor.User | null = null
    if (this.userId) {
      user = Meteor.users.findOne({_id: this.userId}) ?? null
    }

    if (!user) return

    const task = Tasks.findOne({_id: _id})
    if (!task) {
      auditLog(`Error: the task that is being submitted can not be found. Task key requested: ${_id}.`)
      throw new Meteor.Error(404, 'Unknown task', 'The task does not exist anymore.')
    }

    if (!canSubmit(user, _id)) {
      auditLog(`Unallowed user ${user._id} is trying to submit the task ${_id}`)
      throw new Meteor.Error(403, 'You are not allowed to submit this task')
    }

    formData = filterUnsubmittableVars(
      formData,
      task.customHeaders.formIO,
      ['cancel', 'submit'],
      [
        'created_at',
        'created_by',
      ]
    )

    if (formData.length == 0) {
      auditLog(`Error: the form being submitted by ${user._id} as insufficient data.`)
      throw new Meteor.Error(400, 'There is not enough valid data to validate this form. Canceling.')
    }

    // update Users info, based on sciper, if possible. Block only if we don't have any data on the PhD
    try {
      let participantsToUpdate: any
      if (!task.variables.phdStudentSciper) {
        // look like a first step if we do not have the phdStudentSciper in task.variables.
        // let's fetch with formData then
        participantsToUpdate = await getParticipantsToUpdateFromSciper(formData)
      } else {
        participantsToUpdate = await getParticipantsToUpdateFromSciper(task.variables)
      }

      formData = {...formData, ...participantsToUpdate}
    } catch (e: any) {
      if (e.name == 'AbortError') {
        // Look like the fetching of user info has got a timeout,
        // make it bad only if we don't have already some data, or ignore it
        auditLog(`Error: Timeout while fetching scipers.`)
        if (!task.variables.phdStudentEmail) throw new Meteor.Error(422, 'Unable to get users information, aborting. Please contact the administrator or try again later.')
      } else {
        auditLog(`Error: parsing a participant ${e} has failed. Aborting.`)
        throw new Meteor.Error(422, `There is a problem with a participant: ${e}`)
      }
    }

    formData.updated_at = new Date().toJSON()

    formData = _.mapValues(formData, x => encrypt(x))  // encrypt all data

    // append the current activity over other activities
    // but only keep the pathName of the current task, as it inform about the jobId
    const jobURLs = []

    if (task.variables.activityLogs) {  // do we have already some activities logged ?
      let activitiesLogs: FormioActivityLog[] = JSON.parse(task.variables.activityLogs)
      // cleanup other data that were put inside in old code, only keep pathName
      for (let activitiesLog of activitiesLogs) {
        jobURLs.push(_.pick(activitiesLog, 'pathName'))
      }
    }

    jobURLs.push(_.pick(formMetaData, 'pathName'))  // push the actual one

    formData.activityLogs = encrypt(JSON.stringify(jobURLs))

    auditLog(`Sending success: job ${task._id} of process instance ${task.processInstanceKey} with data ${JSON.stringify(formData)}`)
    await WorkersClient.success(task._id!, formData)
    Tasks.markAsSubmitted(task._id!)
    auditLog(`Successfully submitted form for task id ${task._id}.`)
  },
})
