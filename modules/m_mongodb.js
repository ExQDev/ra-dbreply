import mongodb from 'mongodb'
import udbI from './../interface/unidb_interface'
import fail from './../functions/fail'
import Promise from 'bluebird'

const mongo = Promise.promisifyAll(mongodb.MongoClient)

export default class M_MongoDB extends udbI {       // eslint-disable-line
  constructor (robj) {
    super()
    this.robj = robj
    console.log('>>MongoDB INITIALIZED')
  }

  connect (host, port) {
    console.log('>>INIT mongo URL')
    this.url = 'mongodb://' + host + ':' + port + '/'
    console.log(`>>URL [${this.url}] READY`)
  }

  use (dbname) {
    console.log(`>>USE ${dbname}`)
    this.dbname = dbname
  }

  async collection (name) {
    console.log('>>MONGO GET COLLECTION')
    let _out
    const client = await mongo.connectAsync(this.url).catch(err => fail(err, this.robj))
    const arr = await client.db(this.dbname).collection(name).find()
    let _arr = Promise.promisifyAll(arr)
    _out = await _arr.toArrayAsync().catch(err => fail(err, this.robj))
    return _out
  }

  async insert (collection, obj) {
    console.log('>>MONGO INSERTION')
    const _client1 = await mongo.connectAsync(this.url).catch(err => fail(err, this.robj))
    let arr
    try {
      arr = await _client1.db(this.dbname).collection(collection)
    } catch (err) {
      fail(err, this.robj)
    }
    let _arr = Promise.promisifyAll(arr)
    await _arr.insertOneAsync(obj).catch(err => fail(err, this.robj))
  }
}
