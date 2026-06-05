import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";

import persistentDB from "/imports/db/persistent";


export interface MaintenanceInfoDef {
  _id: string;
  message: string;
}

class MaintenanceInfoCollection extends Mongo.Collection<MaintenanceInfoDef> {
}

export const MaintenanceInfoData = new MaintenanceInfoCollection('maintenanceInfo',
// @ts-ignore
  persistentDB && Meteor.isServer ? { _driver : persistentDB } : {})
