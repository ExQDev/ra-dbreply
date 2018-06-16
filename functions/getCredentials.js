import errorResponse from './errorResponse'

export default function getCredentials (req, robj) {
  if (!req.body.from || !req.body.from.host || !req.body.from.port || !req.body.from.type) {
    robj.response = errorResponse('no_credentials', 'no credentials for Database 1 provided')
    return null
  } else if (!req.body.to || !req.body.to.host || !req.body.to.port || !req.body.to.type) {
    robj.response = errorResponse('no_credentials', 'no credentials for Database 2 provided')
    return null
  } else {
    return {
      db1: req.body.from,
      db2: req.body.to
    }
  }
}
