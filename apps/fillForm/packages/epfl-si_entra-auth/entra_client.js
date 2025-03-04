import Entra from './namespace.js';


/**
 *
 * @param credentialRequestCompleteCallback {Function} Callback function to call on
 *  completion. Takes one argument, credentialToken on success, or Error on error.
 * @param options {optional}
 * @returns {Promise<void>}
 */
Entra.requestCredential = async (
  options = {},
  credentialRequestCompleteCallback
) => {
  const config = await ServiceConfiguration.configurations.findOneAsync(
    { service: 'entra' }
  );

  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  const credentialToken = Random.secret();

  const scopes = [
    'https://graph.microsoft.com/.default',
    ...(options.requestPermissions || []),
  ];

  const loginStyle = OAuth._loginStyle('entra', config, options);

  const loginUrlParameters = {
    ...(config.loginUrlParameters || {}),
    ...(options.loginUrlParameters || {}),
    prompt: options.prompt != null ? options.prompt : (options.forceApprovalPrompt ? 'consent' : undefined),
    response_type: "code",
    client_id:  config.clientId,
    scope: scopes.join(' '), // space delimited
    redirect_uri: OAuth._redirectUri('entra', config),
    state: OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl)
  };

  const loginUrl = new URL(`${ config.loginBaseURL }/${config.tenantId}/${ config.loginAfterTenantURL }`);

  Object.entries(loginUrlParameters).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    if (['redirect_uri', 'scope', 'state'].includes(key)) {
      loginUrl.searchParams.append(key, value);

      return;
    }

    loginUrl.searchParams.append(encodeURIComponent(key), encodeURIComponent(value));
  });

  OAuth.launchLogin({
    loginService: "entra",
    loginStyle,
    loginUrl: loginUrl.toString(),
    credentialRequestCompleteCallback,
    credentialToken,
    popupOptions: { width: 1024, height: 768 }
  });
};
