import {Meteor} from "meteor/meteor";
import {MaintenanceInfoData} from "/imports/ui/model/maintenance";


Meteor.methods({
  async setMaintenanceNotice(
    message: string | undefined
  ) {
    let user: Meteor.User | null = null
    if (this.userId) {
      user = await Meteor.users.findOneAsync({ _id: this.userId }) ?? null
    }

    if (!user?.isAdmin) {
      throw new Meteor.Error(403, 'You are not allowed to set a maintenance message.')
    }

    await MaintenanceInfoData.upsertAsync(
      { _id: "0" },
      { $set: { message: message } }
    )
  }
})
