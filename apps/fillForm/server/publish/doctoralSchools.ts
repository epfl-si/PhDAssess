import {Meteor} from "meteor/meteor";
import {canEditAtLeastOneDoctoralSchool, canEditDoctoralSchool} from "/imports/policy/doctoralSchools";
import {DoctoralSchools} from "/imports/api/doctoralSchools/schema";


Meteor.publish('doctoralSchools', async function() {
  let user: Meteor.User | null = null
  if (this.userId) {
    user = await Meteor.users.findOneAsync({_id: this.userId}) ?? null
  }

  if (user && await canEditAtLeastOneDoctoralSchool(user)) {
    const sub = await DoctoralSchools.find({}).observeChangesAsync({
      added: async (id, data) => {
        const ds = await DoctoralSchools.findOneAsync({_id: id});
        this.added('doctoralSchools', id, {...data, readonly: !(ds && canEditDoctoralSchool(user, ds))});
      },
      changed: async (id, data) => {
        const ds = await DoctoralSchools.findOneAsync({_id: id});
        this.changed('doctoralSchools', id, {...data, readonly: !(ds && canEditDoctoralSchool(user, ds))});
      },
      removed: (id) => {
        this.removed('doctoralSchools', id);
      }
    });
    this.onStop(() => {
      sub.stop();
    });
    this.ready();
  } else {
    this.ready()
  }
})
