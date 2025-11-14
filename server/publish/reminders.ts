import {Meteor} from "meteor/meteor";
import {getRemindersForDashboardTasks, getUserPermittedTaskReminder} from "/imports/policy/reminders";


Meteor.publish('taskReminder', async function (taskId: [string]) {
  if (this.userId) {
    const user = await Meteor.users.findOneAsync({ _id: this.userId }) ?? null
    return getUserPermittedTaskReminder(user, taskId[0])
  } else {
    this.ready()
  }
})

Meteor.publish('remindersForDashboardTasks', async function () {
  if (this.userId) {
    const user = await Meteor.users.findOneAsync({ _id: this.userId }) ?? null
    return await getRemindersForDashboardTasks(user)
  } else {
    this.ready()
  }
})
