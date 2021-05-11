import {Meteor} from 'meteor/meteor'
import WorkersClient from './workflow'
import Tequila from 'meteor/epfl:accounts-tequila'
import {encrypt} from './encryption'
import _ from 'lodash'
import findUp from 'find-up'
import '/imports/policy'
import {ZBClient} from "zeebe-node";
import {get_user_permitted_tasks,
  is_allowed_to_submit} from './permission/tasks'

const debug = require('debug')('server/main')

require("dotenv").config({path: findUp.sync(".env")})

Meteor.startup(() => {
  WorkersClient.start()
  Tequila.start({
    getUserId: (tequila: any) => {
      return tequila.uniqueid;
    },
    request: ['uniqueid', 'username', 'name', 'firstname', 'displayname', 'personaltitle', 'email', 'group'],
  })
})

Meteor.publish('tasks', function () {
  return get_user_permitted_tasks()
})

Meteor.methods({
  start_workflow() {  // aka start a new instance in Zeebe terms
    // TODO: check the right to start a workflow
    const diagramProcessId = 'Process_PhDAssess'

    debug(`calling for a new "Process_PhDAssess" instance`)
    const zbc = new ZBClient()
    zbc.createWorkflowInstance(diagramProcessId, {}).then(
      (res) => {
        debug(`created new instance ${diagramProcessId}, response: ${JSON.stringify(res)}`)
      })
  },
  submit(key, data, metadata) {
    if (!is_allowed_to_submit(key)) {
      throw new Meteor.Error(403, 'Error 403: Not allowed', 'Check your permission');
    }

    delete data['submit']  // no thanks, I already know that
    delete data['cancel']  // no thanks, I already know that

    data = _.mapValues(data, x => encrypt(x))  // encrypt all data
    data['metadata'] = encrypt(JSON.stringify(metadata))  // add some info on the submitter

    WorkersClient.success(key, data)
    debug("Submitted form result")
  },
})
