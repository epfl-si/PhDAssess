import dayjs from "dayjs";
import {auditLogConsoleOut} from "/imports/lib/logging";

import {Task} from "/imports/model/tasks";
import {
  AlfrescoInfo,
  StudentInfo,
  buildStudentName,
  fetchTicket,
  readFolder,
  fetchFileAsBase64,
  uploadPDF,
} from "phdassess-ged-connector";
import {Meteor} from "meteor/meteor";
import {getUserPermittedTaskDetailed} from "/imports/policy/tasks";

const auditLog = auditLogConsoleOut.extend('server/methods/TaskPDF')

/**
 * From a base64, save it to the server and get back the path created from
 * the operation
 * @return path where the file has been saved
 */
export const sendPDFAnnexToAlfresco = async (
  pdfAsBase64String: string,
  task: Task,
) => {

  try {
    const alfrescoInfo: AlfrescoInfo = {
      serverUrl: process.env.ALFRESCO_URL!,
      username: process.env.ALFRESCO_USERNAME!,
      password: process.env.ALFRESCO_PASSWORD!,
    }

    const studentInfo: StudentInfo = {
      doctoralAcronym: task.variables.doctoralProgramName ?? '',
      studentName: buildStudentName(task.variables),
      sciper: task.variables.phdStudentSciper ?? '',
    }

    // get yourself a ticket to the show
    const ticket = await fetchTicket(alfrescoInfo)

    // check if the GED is ready for this
    await readFolder(
      alfrescoInfo,
      studentInfo,
      ticket
    )

    // alright, we may be ready to deposit the file
    const normalizedPDFAnnexName = `Rapport annuel doctorat appendix ${ task.variables.year ?? dayjs().year() }.pdf`

    const annexPdfPath = await uploadPDF(
      alfrescoInfo,
      studentInfo,
      ticket,
      normalizedPDFAnnexName,
      Buffer.from(pdfAsBase64String, 'base64')
    )

    if (annexPdfPath) {
      return annexPdfPath
    } else {
      throw new Error(
        `The uploadDPF method returned nothing when it should have returned the path of uploaded file.`
      )
    }
  } catch (error: any) {
    // here are the error we can write into auditLog, but not for the client
    auditLog(
      `While trying to deposit a PDF appendix on GED, an error raised for ${ task._id }, ` +
      `process instance ${ task.processInstanceKey}. ${ error }`
    )
    // reraise something for the client
    throw new Error('Uploading the PDF failed')
  }
}

Meteor.methods({
  async fetchPdfAnnex(taskId) {
    let user: Meteor.User | null = null
    if (this.userId) {
      user = Meteor.users.findOne({_id: this.userId}) ?? null
    }

    if (!user) return

    const tasks = getUserPermittedTaskDetailed(user, taskId)?.fetch()

    if (!tasks) throw new Meteor.Error(
      403,
      'You are not allowed on this task.'
    )

    const alfrescoInfo: AlfrescoInfo = {
      serverUrl: process.env.ALFRESCO_URL!,
      username: process.env.ALFRESCO_USERNAME!,
      password: process.env.ALFRESCO_PASSWORD!,
    }

    const task = tasks[0]

    if (!task.variables.pdfAnnexPath) {
      throw new Meteor.Error(
        404,
        'There is no PDF annex for this process.'
      )
    }

    try {
      const ticket = await fetchTicket(alfrescoInfo)

      return await fetchFileAsBase64(
        task.variables.pdfAnnexPath,
        ticket,
      )
    } catch (e: any) {
      auditLog(`While trying to download an annex pdf for taskId ${task._id}, ` +
      `it failed to get communicate with Alfresco. URL requested was ${ task.variables.pdfAnnexPath }. ` +
      `Error was ${e.message}.`)
      throw new Error(`Unable to fetch the file.`)
    }
  }
})
