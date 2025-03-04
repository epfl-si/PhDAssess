import { Accounts } from 'meteor/accounts-base';
Accounts.oauth.registerService('entra');

if (Meteor.isClient) {
  const convertError = err => {
    if (err && err instanceof Meteor.Error &&
      err.error === Accounts.LoginCancelledError.numericError)
      return new Accounts.LoginCancelledError(err.reason);
    else
      return err;
  };

  const loginWithEntra = async (options= {}, callback) => {
    if (!callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    const credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);

    return Entra.requestCredential(
      options,
      credentialRequestCompleteCallback
    );
  };

  const entraSignIn = async (options, callback) => {
    if (!callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    const credentialRequestCompleteCallback = (credentialToken) => {
      if(credentialToken && credentialToken instanceof Error) {
        callback && callback(credentialToken);

        return;
      }

      const credentialSecret = OAuth._retrieveCredentialSecret(credentialToken);

      return Accounts.callLoginMethod({
        methodArguments: [{
          'entraSignIn': true,
          credentialToken,
          credentialSecret,
        }],
        userCallback: callback && (err => callback(convertError(err))),
      });
    }

    return Entra.requestCredential(options, credentialRequestCompleteCallback);
  };

// Register
  Accounts.registerClientLoginFunction('entra', loginWithEntra);
  Accounts.registerClientLoginFunction('entra-sign-in', entraSignIn);

// Apply
  Meteor.loginWithEntra = (...args) =>
    Accounts.applyLoginFunction('entra', args);

  Meteor.entraSignIn = (...args) =>
    Accounts.applyLoginFunction('entra-sign-in', args);
}
