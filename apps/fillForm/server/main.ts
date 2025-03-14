import {Meteor} from 'meteor/meteor'
import {findUpSync} from 'find-up'

import ZeebeClient from './zeebe/connector'
import {initAuth} from "/server/auth";
import {PrometheusSource} from '/server/prometheus'

import './zeebe'
import './fixtures/doctoralSchools'
import './methods'
import './publish'
import '/imports/policy'

// load .env
require("dotenv").config({path: findUpSync(".env")})


Meteor.startup(() => {
  // add custom methods for the devs
  if (Meteor.isDevelopment) {
    import('./methods/Fixtures');
  }

  ZeebeClient.start()
  initAuth()
  PrometheusSource.start()
})
