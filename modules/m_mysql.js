import udbi from '../interface/unidb_interface'
import mysql from 'mysql2'
import Promise from 'bluebird'
import fail from '../functions/fail'
import clearObject from '../functions/clearObject'
import constructColumn from '../functions/constructColumn'

export default class M_MySQLDB extends udbi {   // eslint-disable-line
  constructor (robj) {
    super()
    this.robj = robj
    console.log('>>mysql INITIALIZED')
  }

  async connect (host, port, uname, pass) {
    console.log('>>INIT mysql')
    this.uname = uname
    this.pass = pass
    this.host = host
    this.port = port
    let connection = mysql.createConnection({
      host: this.host,
      user: this.uname,
      password: this.pass
    }
    )
    this.mysql = Promise.promisifyAll(connection)
    await this.mysql.connectAsync().catch(err => fail(err, this.robj))
    console.log('>>DONE')
  }

  use (dbname) {
    console.log(`>>USE [${dbname}]`)
    this.dbname = dbname
    console.log('>>mysql READY')
  }

  async checkTable (tname) {
    console.log(`mysql check table [${tname}]`)
    let checkQuery = `SELECT 1 FROM information_schema.tables WHERE table_name = '${tname}';`
    let checkResp = await this.mysql.queryAsync(checkQuery).catch(err => fail(err, this.robj))
    return checkResp.length > 0
  }

  async makeTable (tname, schema) {
    console.log(`mysql creation of table[${tname}]`)
    let tcols = constructColumn(schema, 'mysql')
    let tquery = `CREATE TABLE ${this.dbname}.${tname}(${tcols}) ENGINE=${schema.engine};`
    let _table = await this.mysql.queryAsync(tquery).catch(err => fail(err, this.robj))
    return _table
  }

  async collection (name) {
    console.log('>>mysql GET COLLECTION')
    let query = `SELECT * from ${this.dbname}.${name}`
    let ar = await this.mysql.queryAsync(query)
      .catch(err => fail(err, this.robj))
    ar = ar.map(function (item) {
      return JSON.parse(JSON.stringify(item))
    })
    return ar
  }

  async insert (collection, obj) {
    console.log('>>mysql INSERTION')

    let iquery = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='${collection}';`
    let cols = await this.mysql.queryAsync(iquery)
      .catch(err => fail(err, this.robj))
    let colnames = cols.map(function (element) {
      return element.COLUMN_NAME
    })
    let keys = clearObject(obj, colnames)

    let values = Object.values(obj).map(function (item) {
      return `'${item}'`
    })

    let query = `INSERT into ${this.dbname}.${collection}(${keys}) VALUES(${values})`

    let _resp = await this.mysql.queryAsync(query)
      .catch(err => fail(err, this.robj))

    return _resp
  }
}
