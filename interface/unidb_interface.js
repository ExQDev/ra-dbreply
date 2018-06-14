export default class UDBInterface {
  async connect (host, port, uname, pass) {}
  use (dbname) {}
  async insert (obj) {}
  async checkTable (tname) {}
  async makeTable (tname) {}
  delete (obj) {}
  async collection (name) {}
}
