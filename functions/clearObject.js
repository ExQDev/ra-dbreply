export default function clearObject (obj, colnames) {
  let _keys = Object.keys(obj)

  let keys = colnames.filter(function (colname) { return _keys.indexOf(colname) !== -1 })

  for (let xkey in obj) {
    if (keys.indexOf(xkey) === -1) { delete obj[xkey] }
  }

  return keys
}
