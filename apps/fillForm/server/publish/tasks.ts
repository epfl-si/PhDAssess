import {Meteor} from "meteor/meteor";
import _ from "lodash";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat)

import {getUserPermittedTaskDetailed} from "/imports/policy/tasks";
import {getUserPermittedTasksForList} from "/imports/policy/tasksList/tasks";
import {isObsolete} from "/imports/model/tasks";


Meteor.publish('taskDetailed', async function (args: [string]) {
  if (this.userId) {
    const user: Meteor.User | null = await Meteor.users.findOneAsync({ _id: this.userId }) ?? null
    return getUserPermittedTaskDetailed(user, args[0])
  } else {
    this.ready()
  }
})

Meteor.publish('tasksList', async function () {
  if (this.userId) {
    const user = await Meteor.users.findOneAsync({ _id: this.userId }) ?? null

    // we do not send directly the journal.lastSeen on tasks list, as it trigger updates all the time.
    // Instead, we provide a new boolean attribute 'isObsolete' that changes only when his time as come
    const tasksList = getUserPermittedTasksForList(user)

    if (!user || !tasksList) {
      this.ready()
    } else {
      const handle = await tasksList.observeChangesAsync({
        added: (id, fields) => {
          this.added('tasks',  id,{
            isObsolete: isObsolete(fields.journal?.lastSeen),
            ..._.omit(fields, 'journal.lastSeen')
          })
        },
        changed: (id, fields) => {
          this.changed('tasks', id,{
            isObsolete: isObsolete(fields.journal?.lastSeen),
            ..._.omit(fields, 'journal.lastSeen')
          })
        },
        removed: (id: string) => {
          this.removed('tasks', id)
        }
      })

      this.ready()

      if (handle) this.onStop(() => handle.stop());
    }
  } else {
    this.ready()
  }
})
