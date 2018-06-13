import fail from './fail'

export default async function migrate (db1, db2, credentials, robj) {
  console.log('>>MIGRATION INIT')
  let cdb1 = credentials.db1
  let cdb2 = credentials.db2
  console.log('>>MIG DB CONNECTION')
  await db1.connect(cdb1.host, cdb1.port, cdb1.uname, cdb1.password)
  db1.use(cdb1.db)
  await db2.connect(cdb2.host, cdb2.port, cdb2.uname, cdb2.password)
  db2.use(cdb2.db)
  console.log(`>>COPYING from [${cdb1.type}] to [${cdb2.type}]`)
  const _initCollection = await db1.collection(cdb1.collection).catch(err => fail(err, robj))
  if (!(await db2.checkTable(cdb2.collection))) { await db2.makeTable(cdb2.collection, cdb2.schema) }
  const _prefinalCollection = (await db2.collection(cdb2.collection))
  for (let _obj of _initCollection) {
    await db2.insert(cdb2.collection, _obj).catch(err => fail(err, robj))
  }
  const finalCollection = (await db2.collection(cdb2.collection))
  if (_initCollection.length === (finalCollection.length - _prefinalCollection.length)) {
    robj.code = 200
    robj.response = {
      ok: true,
      success: true,
      result: 'ok',
      reason: 'successfylly replicated'
    }
  } else {
    robj.code = 400
    robj.response = {
      ok: false,
      success: false,
      result: 'unknown',
      reason: `collections are different: first collection length: ${_initCollection.length}, second: ${finalCollection.length}, see logs for more information`
    }
  }
}
