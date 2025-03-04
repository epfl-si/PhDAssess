import {Meteor} from 'meteor/meteor'
import {findUp} from 'find-up-simple'
import { PrometheusSource } from '/server/prometheus'

import Tequila from 'meteor/epfl:accounts-tequila'

import packageJson from '/package.json'
import './zeebe'
import './fixtures/doctoralSchools'
import './methods'
import './publish'
import '/imports/policy'

import {setEntraAuthConfig} from "/server/entraAuth";

import ZeebeClient from './zeebe/connector'
import {validateEnv} from "/server/validateEnv";


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

  setEntraAuthConfig()

  PrometheusSource.start()

})
