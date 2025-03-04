import { ServiceConfiguration } from "meteor/service-configuration";


export const setEntraAuthConfig = () => {
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
  ServiceConfiguration.configurations.upsert(
    { service: "entra" },
    {
      $set: {
        getTokenBaseURL: "https://login.microsoftonline.com",
        getTokenAfterTenantURL: "oauth2/v2.0/token",

        refreshTokenBaseURL: "https://login.microsoftonline.com",
        refreshTokenAfterTenantURL: "oauth2/v2.0/token",

        loginBaseURL: "https://login.microsoftonline.com",
        loginAfterTenantURL: "oauth2/v2.0/authorize",

        clientId: clientId,
        secret: secret,
        tenantId: tenantId,
        loginStyle: 'popup', //'redirect',
      },
    }
  );
}
