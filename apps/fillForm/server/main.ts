import {Meteor} from 'meteor/meteor'
import {findUp} from 'find-up-simple'
import { PrometheusSource } from '/server/prometheus'

import packageJson from '/package.json'
import './zeebe'
import './fixtures/doctoralSchools'
import './methods'
import './publish'
import '/imports/policy'

import ZeebeClient from './zeebe/connector'
import {validateEnv} from "/server/validateEnv";

import {initAuth} from "/server/auth";

Meteor.startup(async () => {
  console.log("dotenv: loading...")
  require("dotenv").config({path: await findUp(".env")})
  console.log("dotenv: loaded")

  console.log(`Starting fillForm version ${ packageJson.version }`)


  // add custom methods for the devs
  if (Meteor.isDevelopment) {
    import('./methods/Fixtures');
  }

  validateEnv()

  ZeebeClient.start()

  initAuth()

  PrometheusSource.start()
})
