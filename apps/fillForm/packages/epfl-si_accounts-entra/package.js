Package.describe({
  name: 'epfl-si:accounts-entra',
  version: '0.0.1',
  summary: 'Accounts connector for epfl-si:entra-oauth package, frozen to Meteor 2.16 dependencies. Inspired by telnowedge:accounts-microsoft-entra',
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('2.16');

  api.use('ecmascript');
  api.use('oauth');
  api.use('accounts-base');
  api.use('accounts-oauth');

  api.addFiles('entra.js');
});
