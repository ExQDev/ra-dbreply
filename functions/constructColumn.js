import typedb from '../interface/typedb.json'

export default function constructColumn (schema, driver) {
  let colNames = Object.keys(schema)
  colNames = colNames.filter(colname => schema[colname].type)

  let columns = colNames.map(function (col) {
    let colname = col
    if (driver === 'postgre') { colname = `"${col}"` }

    let _out = `${colname}   ${typedb[driver][schema[col].type]}${schema[col].size !== undefined ? '(' + schema[col].size + ')' : ''}   ${(schema[col].addition !== undefined) ? schema[col].addition : ''} `
    if (driver === 'mysql') {
      if (schema.primary === col) { _out += 'PRIMARY KEY' }
    }
    return _out
  })
  return columns
}
