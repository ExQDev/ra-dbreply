import udbI from './../interface/unidb_interface'
import fail from './../functions/fail'
import Sequelize from 'sequelize'
// import SequelizeAuto from 'sequelize-auto'

export default class M_UniSQL extends udbI {   // eslint-disable-line
  constructor (robj, dialect) {
    super()
    this.robj = robj
    this.dialect = dialect
    console.log(`>>unisql[${dialect}] INITIALIZED`)
  }

  connect (host, port, uname, pass) {
    console.log('>>INIT unisql')
    this.uname = uname
    this.pass = pass
    this.host = host
    this.port = port

    console.log('>>DONE')
  }

  async checkTable (tname) {

  }

  use (dbname) {
    console.log(`>>USE [${dbname}]`)
    this.dbname = dbname
    console.log('>>unisql READY')
    this.sequelize = new Sequelize(dbname, this.uname, this.pass, {
      host: this.host,
      dialect: this.dialect, // 'mysql'|'sqlite'|'postgres'|'mssql',
      operatorsAliases: false,

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
    this.sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.')
      })
      .catch(err => fail(err, this.robj))
      // this.auto = new SequelizeAuto(this.dbname, this.uname, this.pass, {
      //   host: this.host,
      //   dialect: this.dialect,
      //   directory: false,
      //   port: this.port
      // })
      // this.auto.run(function(err){
      //   if(err)
      //     fail(err, this.robj)
      //   console.log('>> [unisql] BEGAN autoGen: ')
      //   console.log(this.auto.tables)
      //   console.log('>> [unisql] FKeys: ')
      //   console.log(this.auto.foreignKeys)
      //   console.log('>> [unisql] END')
      // }.bind(this))
  }

  async collection (name) {
    console.log('>>unisql GET COLLECTION')

    let scheme
    let ret = await this.sequelize
      .getQueryInterface()
      .describeTable(name, { freezeTableName: true })
      .catch(err => console.log(err))// fail(err, this.robj))
    if (ret) {
      console.log(ret)
      scheme = []
      for (let retitm in ret) {
        if (!ret[retitm].defaultValue || (!ret[retitm].allowNull && ret[retitm].defaultValue == null) || ret[retitm].primaryKey) { delete ret[retitm].defaultValue }
        scheme[retitm] = ret[retitm]
      }
      console.log(scheme)
    }
    let model
    try {
      model = this.sequelize.define(name, scheme, { freezeTableName: true })
    } catch (err) { fail(err, this.robj) }
    await model.sync()
    const list = await model.findAll()
    return list
  }

  async insert (collection, obj) {
    console.log('>>unisql INSERTION')
    console.log(obj)
    let scheme = await this.sequelize
      .getQueryInterface()
      .showAllTables()
    console.log(scheme)
    let ret = await this.sequelize
      .getQueryInterface()
      .describeTable(collection, { freezeTableName: true })
      .catch(err => fail(err, this.robj))
    if (ret) {
      console.log(ret)
      scheme = ret
    }
    let model
    try {
      model = this.sequelize.define(collection, scheme, { freezeTableName: true })
    } catch (err) { fail(err, this.robj) }
    return model.create(obj).catch(err => fail(err, this.robj))
  }
}
