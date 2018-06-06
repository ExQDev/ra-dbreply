export default function fail (err, robj) {
  console.error(err)
  if (robj) {
    robj.code = err.statusCode
    robj.response = {
      result: 'fail',
      success: false,
      ok: false,
      name: err.name,
      error: err.error,
      reason: err.reason
    }
    robj.send() // --Was in use, I don`t know is it neccesary for now? Maybe smth broken after I comment that.
  }
}
