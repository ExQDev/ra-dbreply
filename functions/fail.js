export default function fail (err, robj) {
  console.error(err)
  if (robj) {
    robj.response = {
      result: 'fail',
      success: false,
      ok: false,
      name: err.name,
      error: err.error || err.name,
      reason: err.reason || err.message
    }
    if (err.statusCode && err.statusCode !== 0) { robj.code = err.statusCode }
    if (err.code) {
      switch (err.code) {
        case 11000:
          robj.code = 409
          robj.response.error = 'conflict'
          break
        case 0:
          robj.code = 400
          break
        default:
          robj.code = 400
          break
      }
    }

    robj.send() // --Was in use, I don`t know is it neccesary for now? Maybe smth broken after I comment that.
  }
}
