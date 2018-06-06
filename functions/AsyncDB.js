import Promise from 'bluebird'

export default function AsyncDB (nano, db) {
  var ndb = nano.db.use(db)
  ndb.update = function (obj, key, callback) {
    var db = this
    db.get(key, function (error, existing) {
      if (!error) obj._rev = existing._rev
      db.insert(obj, key, callback)
    })
  }
  Promise.promisifyAll(ndb)
  return ndb
}
