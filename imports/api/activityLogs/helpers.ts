import {ActivityLog, ActivityLogs} from "/imports/api/activityLogs/schema";
import {PhDZeebeJob} from "/server/zeebe/in";
import {Task} from "/imports/model/tasks";


export const bumpActivityLogsOnTaskNewArrival = async (
  job: PhDZeebeJob
)=>  {

  const processInstance = await ActivityLogs.findOneAsync(
    { _id: job.processInstanceKey }
  )

  const isEventAlreadySet = processInstance?.logs?.filter(
    log => log.elementId === job.elementId && log.event === 'started'
  )
  if ( isEventAlreadySet && isEventAlreadySet.length > 0 ) return

  const log : ActivityLog = {
    jobKey: job.key,
    elementId: job.elementId,
    event: 'started',
    datetime: new Date().toJSON(),
  }

  if ( processInstance ) {
    await ActivityLogs.updateAsync(
      { _id: job.processInstanceKey },
      { $push: {
          'logs': log
        }})
  } else {
    await ActivityLogs.insertAsync({
      '_id': job.processInstanceKey,
      'logs': [log],
      })
  }
}

export const bumpActivityLogsOnTaskSubmit = async (
  task: Task
)=>  {
  const processInstance = await ActivityLogs.findOneAsync(
    { _id: task.processInstanceKey }
  )

  const log : ActivityLog = {
    jobKey: task.key,
    elementId: task.elementId,
    event: 'completed',
    datetime: new Date().toJSON(),
  }

  if ( processInstance ) {
    await ActivityLogs.updateAsync(
      { _id: task.processInstanceKey },
      { $push: {
          'logs': log
        }})
  } else {
    await ActivityLogs.insertAsync({
      '_id': task.processInstanceKey,
      'logs': [log],
    })
  }
}
