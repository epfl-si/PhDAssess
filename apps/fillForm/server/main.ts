import {Meteor} from 'meteor/meteor'
import {findUpSync} from 'find-up'
import { PrometheusSource } from '/server/prometheus'

import './zeebe'
import './fixtures/doctoralSchools'
import './methods'
import './publish'
import '/imports/policy'

import ZeebeClient from './zeebe/connector'
import {setEntraAuthConfig} from "/server/entraAuth";

require("dotenv").config({path: findUpSync(".env")})


Meteor.startup(() => {

  // add custom methods for the devs
  if (Meteor.isDevelopment) {
    import('./methods/Fixtures');
  }

  ZeebeClient.start()

  setEntraAuthConfig()

  PrometheusSource.start()
})
