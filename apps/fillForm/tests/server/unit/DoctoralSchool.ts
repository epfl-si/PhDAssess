import {Meteor} from "meteor/meteor";

import {assert} from 'chai'

import {DoctoralSchools} from "/imports/api/doctoralSchools/schema";
import {initialEcolesDoctorales} from "/server/fixtures/doctoralSchools";


describe('Unit tests DoctoralSchools', function () {
  beforeEach(async function () {
    if ( await DoctoralSchools.find({}).countAsync() === 0 ) {
      for (const doctoralSchool of initialEcolesDoctorales) {
        await DoctoralSchools.insertAsync(doctoralSchool);
      }
    }
  });

  if (Meteor.isServer) {
    it('should have doctoral schools data', async function () {
      // _dburlesFactory.Factory.create("doctoralSchool");

      const ds = DoctoralSchools.find({})
      assert.notStrictEqual(await ds.countAsync(), 0)
    });
  }
});
