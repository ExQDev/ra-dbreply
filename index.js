import errorResponse from './functions/errorResponse'
import getCredentials from './functions/getCredentials'
import bootstrap from './bootstrap/bootstrap'
import migrate from './functions/migrate'
import fail from './functions/fail'
require('babel-polyfill')

async function api (req, res) {
  const robj = {
    code: 400,
    response: errorResponse('Error', 'Something went wrong'),
    send: function () {
      res.status(robj.code).send(robj.response)
      return false
    }
  }
  console.log('>>INIT')
  let credentials = getCredentials(req, robj)
  console.log('>>CRED')
  if (credentials) {
    let db1 = bootstrap(credentials.db1.type, robj)
    console.log('>>BOOT DB1')
    let db2 = bootstrap(credentials.db2.type, robj)
    console.log('>>BOOT DB2')
    if (db1 && db2) {
      console.log('>>DBS INITIATED')
      await migrate(db1, db2, credentials, robj).catch(err => fail(err, robj))
    } else {
      console.log('>>DB1!: ' + db1 + '\n\n>>DB2!: ' + db2)
    }
  }
  console.log('>>FINISH')
  res.status(robj.code).send(robj.response)
}

export { api }
