import udbi from '../interface/unidb_interface'
import pgp from 'pg-promise'
import clearObject from '../functions/clearObject'
import fail from '../functions/fail'

export default class M_PostgreDB extends udbi {   // eslint-disable-line
  constructor (robj) {
    super()
    this.robj = robj
    console.log('>>pgp INITIALIZED')
  }

  connect (host, port, uname, pass) {
    console.log('>>INIT pgp')
    this.uname = uname
    this.pass = pass
    this.host = host
    this.port = port
    console.log('>>DONE')
  }

  use (dbname) {
    console.log(`>>USE [${dbname}]`)
    this.dbname = dbname
    this.db = pgp()(`postgres://${this.uname}:${this.pass}@${this.host}:${this.port}/${this.dbname}`)
    console.log('>>pgp READY')
  }

  async collection (name) {
    console.log('>>pgp GET COLLECTION')
    let _col = await this.db.query(`SELECT * FROM ${name}`).catch(err => fail(err, this.robj))
    console.log(_col)
    return _col
  }

  async insert (collection, obj) {
    console.log('>>pgp INSERTION')
    let iquery = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='${collection}';`
    let cols = await this.db.query(iquery)
      .catch(err => fail(err, this.robj))
    let colnames = cols.map(function (element) {
      return element.column_name
    })
    let keys = clearObject(obj, colnames)

    console.log(obj)
    console.log(keys)
    let values = Object.values(obj).map(function (item) {
      return `'${item}'`
    })

    let query = `INSERT into ${collection}(${keys}) VALUES(${values})`
    let _ins = await this.db.query(query).catch(err => fail(err, this.robj))
    console.log(_ins)

    return _ins
  }
}
