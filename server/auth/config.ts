import {ServiceConfiguration} from "meteor/service-configuration";


export const setEntraAuthConfig = async () => {
  // Validate the env values
  const clientId = process.env.AUTH_ENTRA_CLIENT_ID
  const secret = process.env.AUTH_ENTRA_SECRET
  const tenantId = process.env.AUTH_ENTRA_TENANT_ID

  if ( !(
    clientId && secret && tenantId
  )) {
    throw Error(`
      Missing env vars:
        AUTH_ENTRA_CLIENT_ID or
        AUTH_ENTRA_SECRET or
        AUTH_ENTRA_TENANT_ID
      `)
  }

  // set the entra config
  await ServiceConfiguration.configurations.upsertAsync(
    { service: "entra" },
    {
      $set: {
        clientId: clientId,
        secret: secret,
        tenantId: tenantId,
        loginStyle: 'redirect',
        // fields: []  // if you want to get specific fields.
      },
    }
  );
}
