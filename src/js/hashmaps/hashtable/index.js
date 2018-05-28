const HashTable = require('hashtable');

HashTable.prototype.set = HashTable.prototype.put;
HashTable.prototype.entries = function* () {
    let keys = this.keys(); // this is just an array

    for (let key of keys)
        yield [key, this.get(key)];
};

module.exports = HashTable;
