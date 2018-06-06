import config from './../config'
import errorResponse from '../functions/errorResponse'

export default function bootstrap (dbType, robj) {
  console.log(`>>BOOTSTRAPING... [${dbType}]`)
  for (var mdl of config.modules) {
    if (mdl && mdl.type === dbType) {
      const MDL = mdl.module
      const _md = new MDL(robj)
      return _md
    }
  }
  robj.code = 404
  robj.response = errorResponse('no_driver', `specific driver for dbtype [${dbType}] was not found`)
  return false
}
