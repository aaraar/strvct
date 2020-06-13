require('dotenv').config();
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_SERVER}/strvct?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let database;

client.connect((err, db) => {
    assert.strictEqual(null, err);
    database = db;
});

// Returns DB object when called
module.exports.get = function() {
    return database;
}
