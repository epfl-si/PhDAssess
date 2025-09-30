import {setEntraAuthConfig} from "/server/auth/config";
import "./hooks";

const debug = require('debug')('server/auth')

export const initAuth = async () => {
  debug(`Init auth config`)

  await setEntraAuthConfig()
}
