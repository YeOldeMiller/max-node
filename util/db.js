const mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = cb => {
  MongoClient.connect('mongodb+srv://alt-muller:nXLUFaniM5w8sIYT@cluster0-yqoow.mongodb.net/shop?retryWrites=true', { useNewUrlParser: true })
    .then(client => {
      _db = client.db();
      cb();
    })
    .catch(err => {
      throw err
    });
};

const getDb = () => {
  if(_db) return _db;
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;