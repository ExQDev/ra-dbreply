import errorResponse from './errorResponse'

export default function getCredentials (req, robj) {
  if (!req.body.db1 || !req.body.db1.host || !req.body.db1.port || !req.body.db1.type) {
    robj.response = errorResponse('no_credentials', 'no credentials for Database 1 provided')
    return null
  } else if (!req.body.db2 || !req.body.db2.host || !req.body.db2.port || !req.body.db2.type) {
    robj.response = errorResponse('no_credentials', 'no credentials for Database 2 provided')
    return null
  } else {
    return {
      db1: req.body.db1,
      db2: req.body.db2
    }
  }
}
