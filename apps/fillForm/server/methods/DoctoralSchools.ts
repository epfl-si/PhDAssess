import {Meteor} from "meteor/meteor";
import {canImportScipersFromISA} from "/imports/policy/importScipers";
import {getUserInfoMemoized} from "/server/userFetcher";
import {DoctoralSchools} from "/imports/api/doctoralSchools/schema";


Meteor.methods({
  async refreshDoctoralSchoolsProgramNameFromSciper(doctoralSchoolAcronym: string) {
    let user: Meteor.User | null = null
    if (this.userId) {
      user = await Meteor.users.findOneAsync( { _id: this.userId } ) ?? null
    }

    if (!user) return

    if (!await canImportScipersFromISA(user)) {
      throw new Meteor.Error(403, 'You are not allowed to refresh this data')
    }

    const doctoralSchool = await DoctoralSchools.findOneAsync( { acronym: doctoralSchoolAcronym } )

    if (doctoralSchool) {
      const programDirector = await getUserInfoMemoized(doctoralSchool.programDirectorSciper)

      if (programDirector && programDirector.firstname && programDirector.lastname) {
        await DoctoralSchools.updateAsync(
          { _id: doctoralSchool._id },
          { $set: { programDirectorName: `${programDirector.firstname} ${programDirector.lastname}` } }
        )
      }
    }
  },
})
