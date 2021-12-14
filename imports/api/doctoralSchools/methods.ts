/// <reference path="../../../node_modules/@types/meteor-mdg-validated-method/index.d.ts" />
// have to reference the type file because the ':' in the package name. See :
// https://forums.meteor.com/t/typescript-trouble-importing-types-for-meteor-packages-in-vscode/54756
import {Meteor} from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import {canAccessDoctoralSchoolEdition} from "/imports/policy/doctoralSchools"
import {DoctoralSchool, DoctoralSchools} from "/imports/api/doctoralSchools/schema"
import {auditLogConsoleOut} from "/imports/lib/logging";


export const insertDoctoralSchool = new ValidatedMethod({
  name: 'doctoralSchools.methods.insert',

  validate: DoctoralSchools.schema!.validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run(newDoctoralSchool: DoctoralSchool) {
    if (!canAccessDoctoralSchoolEdition()) {
      if (Meteor.isServer) {
        const auditLog = auditLogConsoleOut.extend('server/methods')
        auditLog(`Unallowed user trying to add a doctoral school`)
      }
      throw new Meteor.Error(403, 'You are not allowed to add a doctoral school')
    }
    if (Meteor.isServer) {
      const auditLog = auditLogConsoleOut.extend('server/methods')
      auditLog(`Inserting a new doctoral school ${JSON.stringify(newDoctoralSchool)}`)
    }

    try {
      return DoctoralSchools.insert(newDoctoralSchool)
    } catch (e: any) {
      if (e.name === 'BulkWriteError' && e.code === 11000) {
        throw new Meteor.Error('Create Error',
          `Duplicate acronym found`);
      } else {
        throw new Meteor.Error('Create Error',
          `${JSON.stringify(e)}`);
      }
    }
  }
});

export const updateDoctoralSchool = new ValidatedMethod({
  name: 'doctoralSchools.methods.update',

  validate: DoctoralSchools.schema!.validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({ _id, acronym, label, helpUrl, creditsNeeded, programDirectorSciper }: DoctoralSchool) {

    if (!canAccessDoctoralSchoolEdition()) {
        if (Meteor.isServer) {
          const auditLog = auditLogConsoleOut.extend('server/methods')
          auditLog(`Unallowed user trying to edit a doctoral school`)
        }
        throw new Meteor.Error(403, 'You are not allowed to add a doctoral school')
    }

    const doctoralSchool = DoctoralSchools.findOne(_id);

    if (!doctoralSchool) {
      throw new Meteor.Error('DoctoralSchools.methods.update',
        'Cannot find a doctoral schools to update.');
    }
    try {
      return DoctoralSchools.update(
        _id!, {
          $set: {
            acronym,
            label,
            helpUrl,
            creditsNeeded,
            programDirectorSciper,
          }
        })
    } catch (e: any) {
      if (e.name === 'MongoError' && e.code === 11000) {
        throw new Meteor.Error('Update Error',
          `Duplicate acronym found ${JSON.stringify(e.keyValue)}`);
      } else {
        throw new Meteor.Error('Create Error',
          `${JSON.stringify(e)}`);
      }
    }
  }
});
