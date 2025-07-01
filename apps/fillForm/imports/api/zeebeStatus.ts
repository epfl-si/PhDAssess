import { Mongo } from 'meteor/mongo'
import type {ZBClientOptions} from "zeebe-node";
import {ConnectionStatusEvent, ZBClient, ZBWorker} from "zeebe-node";
import {Meteor} from "meteor/meteor";


export type ZeebeStatus = {
  type: "client" | "worker"
  status: keyof typeof ConnectionStatusEvent | "disconnected" | "starting"
}

export const zeebeStatusCollection = new Mongo.Collection<ZeebeStatus>('zeebeStatus', {connection: null})
// Set the initial status
await zeebeStatusCollection.upsertAsync({ type: 'client' }, { $set: { status: 'disconnected' } })
await zeebeStatusCollection.upsertAsync({ type: 'worker' }, { $set : { status: 'disconnected' } })

// Initial values
export class ZeebeSpreadingClient extends ZBClient {
  constructor(options?: ZBClientOptions) {
    (async () => {
      await zeebeStatusCollection.upsertAsync(
        { type: 'client' },
        { $set: { status: 'starting' } }
      );
    })();

    super(options);

    Object.values(ConnectionStatusEvent).forEach((eventName) => {
      this.on(eventName, async () => {
        try {
          await zeebeStatusCollection.upsertAsync(
            { type: 'client' },
            { $set: { status: eventName } }
          );
        } catch (error) {
          console.error(`Failed to update client status for event "${eventName}":`, error);
        }
      });
    });
  }

  // @ts-ignore
  async createWorker(...args: any[]): Promise<ZBWorker<any, any, any>> {
    await zeebeStatusCollection.upsertAsync({ type: 'worker' }, { $set : { status: 'starting' } })

    // @ts-ignore
    let worker = super.createWorker(...args);

    // Listen to connection status events and update the database
    Object.values(ConnectionStatusEvent).forEach((eventName) => {
      worker.on(eventName, async () => {
        await zeebeStatusCollection.upsertAsync(
          { type: 'worker' },
          { $set: { status: eventName } }
        );
      });
    });

    return worker;
  }
}

Meteor.publish(
  'zeebe.status', function () { return zeebeStatusCollection.find(); }
)
