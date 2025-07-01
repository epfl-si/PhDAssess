
import {ImportScipersList} from "/imports/api/importScipers/schema";


export const refreshAlreadyStartedImportScipersList = async (doctoralSchoolAcronym: string,
                                                       hasAlreadyStarted: boolean,
                                                       doctorantSciper: string) => {
  return await ImportScipersList.updateAsync(
    {doctoralSchoolAcronym: doctoralSchoolAcronym},
    {
      $set: {
        "doctorants.$[doctorantInfo].hasAlreadyStarted": hasAlreadyStarted,
      }
    },
    {
      arrayFilters: [{
        "doctorantInfo.doctorant.sciper": doctorantSciper
      }]
    }
  )
}
