import { MongoInternals } from 'meteor/mongo';


// This one should have a backup and be resilient. Not like the default one that reset everytime it restarts.
let persistentDB: Object | null = null

if (Meteor.isServer) {
  // use the same db for all the collections
  // or, if provided, use the persisting one
  if (!process.env.MONGO_PERSISTENT_URL) {
    throw new Meteor.Error('Missing var env for connecting to the persistent db. Failing.')
  } else {
    // @ts-ignore
    persistentDB = new MongoInternals.RemoteCollectionDriver(process.env.MONGO_PERSISTENT_URL);
  }
}

export default persistentDB
