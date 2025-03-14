import {setEntraAuthConfig} from "/server/auth/config";
import "./hooks";

const debug = require('debug')('server/auth')

export const initAuth = () => {
  debug(`Init auth config`)

  setEntraAuthConfig()
}
