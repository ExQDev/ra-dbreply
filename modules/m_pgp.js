import udbi from '../interface/unidb_interface'
import pgp from 'pg-promise'
import clearObject from '../functions/clearObject'
import fail from '../functions/fail'
import constructColumn from '../functions/constructColumn'

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

  async checkTable (tname) {
    let checkQuery = `SELECT EXISTS (SELECT 1 FROM information_schema.tables 
      WHERE  table_name = '${tname}');`
    let checkResp = await this.db.query(checkQuery).catch(err => fail(err, this.robj))
    return checkResp[0].exists
  }

  async makeTable (tname, schema) {
    console.log(`pgp creation of table[${tname}]`)
    let tcols = constructColumn(schema, 'postgre')
    let tquery = `CREATE TABLE "${tname}"(${tcols}, PRIMARY KEY (${schema.primary}));`
    let _table = await this.db.query(tquery).catch(err => fail(err, this.robj))
    return _table
  }

  async collection (name) {
    console.log('>>pgp GET COLLECTION')
    let _col = await this.db.query(`SELECT * FROM ${name}`).catch(err => fail(err, this.robj))
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
    let keys = clearObject(obj, colnames).map(function (item) {
      return `"${item}"`
    })

    let values = Object.values(obj).map(function (item) {
      return `'${item}'`
    })

    let query = `INSERT into ${collection}(${keys}) VALUES(${values})`
    let _ins = await this.db.query(query).catch(err => fail(err, this.robj))

    return _ins
  }
}
