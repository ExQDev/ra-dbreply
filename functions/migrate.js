import fail from './fail'

export default async function migrate (db1, db2, credentials, robj) {
  console.log('>>MIGRATION INIT')
  let cdb1 = credentials.db1
  let cdb2 = credentials.db2
  console.log('>>MIG DB CONNECTION')
  db1.connect(cdb1.host, cdb1.port)
  db1.use(cdb1.db)
  db2.connect(cdb2.host, cdb2.port)
  db2.use(cdb2.db)
  console.log(`>>COPYING from [${cdb1.type}] to [${cdb2.type}]`)
  for (let _obj of await db1.collection(cdb1.collection).catch(err => fail(err, robj))) {
    await db2.insert(cdb2.collection, _obj).catch(err => fail(err, robj))
  }
  if ((await db1.collection(cdb1.collection)).length === (await db2.collection(cdb2.collection)).length) {
    robj.code = 200
    robj.response = {
      ok: true,
      success: true,
      result: 'ok',
      reason: 'collections are identical'
    }
  }
}
