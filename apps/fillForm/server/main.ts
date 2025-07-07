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

  Tequila.start({
    getUserId: (tequila: any) => {
      return tequila.uniqueid;
    },
    service: 'PhD Annual Report',
    allows: 'categorie=epfl-guests',
    request: ['uniqueid', 'username', 'name', 'firstname', 'displayname', 'personaltitle', 'email', 'group'],
    fakeLocalServer: Meteor.settings.fake_tequila,
    bypass: Tequila.defaultOptions.bypass.concat("/metrics"),
    tequila_fetchattributes_options: {
      allowedrequesthosts: process.env.TEQUILA_ALLOWED_REQUEST_HOSTS,
    }
  })

  PrometheusSource.start()

})
