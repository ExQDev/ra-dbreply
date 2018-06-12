import mongo from './modules/m_mongodb'
import couchDB from './modules/m_couchdb'
import pgp from './modules/m_pgp'
import mysql from './modules/m_mysql'

export default {
  modules: [
    {
      name: 'mongo',
      type: 'mongo',
      module: mongo
    },
    {
      name: 'couchdb',
      type: 'couchdb',
      module: couchDB
    },
    {
      name: 'postgre',
      type: 'postgre',
      module: pgp
    },
    {
      name: 'mysql',
      type: 'mysql',
      module: mysql
    }
  ]
}
