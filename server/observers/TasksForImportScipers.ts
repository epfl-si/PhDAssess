import {ImportScipersList} from "/imports/api/importScipers/schema";
import {Tasks} from "/imports/model/tasks";


/*
 * Set events on tasks changes to reflect the status on ImportScipers lists
 */
const getQuery = () => { return {} }
const getUpdateDocument = (hasAlreadyStarted: boolean) => {
  return {
    $set: {
      "doctorants.$[doctorantInfo].hasAlreadyStarted": hasAlreadyStarted,
      "doctorants.$[doctorantInfo].isBeingImported": false,
      "doctorants.$[doctorantInfo].isSelected": false,
    }
  }
}

const getOptions = (doctorantSciper: string) => {
  return {
    arrayFilters: [{
      "doctorantInfo.doctorant.sciper": doctorantSciper
    }]
  }
}

/**
 * This part takes care of updating the currently displayed
 * import sciper list everytime there is a move in the task collection.
 */
export const observeTasksForImportScipers = async () => {
  Tasks.find({}).observeAsync({
    added: async (task) => {
      if (task.variables?.phdStudentSciper) {
        await ImportScipersList.updateAsync(
          getQuery(),
          getUpdateDocument(true), getOptions(task.variables.phdStudentSciper)
        )
      }
    },
    changed: async (new_task, old_task) => {
      const oldStudentSciper = old_task.variables?.phdStudentSciper
      const newStudentSciper = new_task.variables?.phdStudentSciper

      if (oldStudentSciper && newStudentSciper && oldStudentSciper !== newStudentSciper) {
        await ImportScipersList.updateAsync(
          getQuery(),
          getUpdateDocument(true), getOptions(newStudentSciper)
        )
        await ImportScipersList.updateAsync(
          getQuery(),
          getUpdateDocument(false), getOptions(oldStudentSciper)
        )
      }
    },
    removed: async (task) => {
      if (task.variables?.phdStudentSciper) {
        await ImportScipersList.updateAsync(
          getQuery(),
          getUpdateDocument(false), getOptions(task.variables.phdStudentSciper)
        )
      }
    }
  })
}
