import udbI from './../interface/unidb_interface'
import AsyncDB from './../functions/AsyncDB'
import fail from './../functions/fail'

export default class M_CouchDB extends udbI {   // eslint-disable-line
  constructor (robj) {
    super()
    this.robj = robj
    console.log('>>CouchDB INITIATED')
  }

  connect (host, port) {
    console.log('>>INIT NANO')
    this.nano = require('nano')(`http://${host}:${port}/`)
    console.log('>>NANO READY')
  }

  use (dbname) {
    console.log(`>>USE [${dbname}]`)
    this.dbname = dbname
    this.db = AsyncDB(this.nano, dbname)
    console.log('>>DONE')
  }

  async collection () {
    console.log('>>CDB GET COLLECTION')
    let _col = await this.db.fetchAsync({}).catch(err => fail(err, this.robj))
    if (_col) {
      const _map = _col.rows.map(function (item) {
        item.doc._rev = undefined
        return item.doc
      })
      return _map
    }
    return _col
  }

  async insert (collection, obj) {
    console.log('>>CDB INSERTION')
    return this.db.insertAsync(obj).catch(err => fail(err, this.robj))
  }
}
