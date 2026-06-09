import {Meteor} from "meteor/meteor";

import {MaintenanceInfoData} from "/imports/ui/model/maintenance";


Meteor.publish('maintenanceNotice', function () {
  return MaintenanceInfoData.find()
})
