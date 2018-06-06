import mongo from './modules/m_mongodb'
import couchDB from './modules/m_couchdb'

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
    }
  ]
}
