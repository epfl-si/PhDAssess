import {Meteor} from "meteor/meteor";
import {encrypt} from "/server/encryption";
import {FormioActivityLog, TaskData, TasksCollection} from "/imports/model/tasks";
import {filter_unsubmittable_vars, is_allowed_to_submit, isAllowedDeleteProcessInstance} from "/server/permission/tasks";
import _ from "lodash";
import {zBClient} from "/server/zeebe_broker_connector";
import WorkersClient from './zeebe_broker_connector'

const tasks = TasksCollection<TaskData>()
const debug = require('debug')('server/methods')

Meteor.methods({

  async startWorkflow() {  // aka start a new instance in Zeebe terms
    // TODO: check the right to start a workflow, into the "Start workflow button"?
    const diagramProcessId = 'phdAssessProcess'

    debug(`calling for a new "phdAssessProcess" instance`)

    try {
      const createProcessInstanceResponse = await Promise.resolve(zBClient.createProcessInstance(diagramProcessId, {
        created_at: encrypt(new Date().toJSON()),
        created_by: encrypt(Meteor.userId()!),
        updated_at: encrypt(new Date().toJSON()),
      }))
      debug(`created new instance ${diagramProcessId}, response: ${JSON.stringify(createProcessInstanceResponse)}`)
      return createProcessInstanceResponse?.processKey
    } catch (e) {
      throw new Meteor.Error(500, `Unable to start a new workflow. Please contact the admin to verify the server. ${e}`)
    }
  },

  async submit(key, formData, formMetaData: FormioActivityLog) {
    if (!is_allowed_to_submit(key)) {
      debug(`Unallowed user is trying to sumbit the task ${key}`)
      throw new Meteor.Error(403, 'You are not allowed to submit this task')
    }

    const task:TaskData | undefined = tasks.findOne({ _id: key } )

    if (task) {
      formData = filter_unsubmittable_vars(
        formData,
        task.customHeaders.formIO,
        ['cancel', 'submit'],
        [
          'created_at',
          'created_by',
        ]
      )

      if (formData.length == 0) {
        throw new Meteor.Error(400, 'There is not enough valid data to validate this form. Canceling.')
      }

      formData.updated_at = new Date().toJSON()

      formData = _.mapValues(formData, x => encrypt(x))  // encrypt all data

      // append activity over other activities
      let activitiesLog: FormioActivityLog[] = []
      if (task.variables.activityLogs) {
        activitiesLog = JSON.parse(task.variables.activityLogs)
        activitiesLog.push(formMetaData)
      }
      formData.activityLogs = encrypt(JSON.stringify(activitiesLog))

      await WorkersClient.success(task._id, formData)
      tasks.remove({_id: task._id})
      debug("Submitted form result")
    } else {
      debug("Error can not find the task that is trying to be submitted")
      throw new Meteor.Error(404, 'Unknown task', 'Check the task exist by refreshing your browser')
    }
  },

  async deleteProcessInstance(jobKey, processInstanceKey) {
    if (!isAllowedDeleteProcessInstance(processInstanceKey)) {
      debug(`Unallowed user to delete the process instance key ${processInstanceKey}`)
      throw new Meteor.Error(403, 'You are not allowed to delete a process instance')
    }

    try {
      const cancelMessage = await zBClient.cancelProcessInstance(processInstanceKey)
      // delete in db too the job key
      tasks.remove({_id: jobKey})
      return cancelMessage
    } catch (error) {
      debug("Error can not cancel process instance")
      throw new Meteor.Error(500, `Unable to cancel the task. ${error}`, 'Check the task exist by refreshing your browser')
    }
  },
})