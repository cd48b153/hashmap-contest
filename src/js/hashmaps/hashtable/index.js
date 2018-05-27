const HashTable = require('hashtable');

module.exports = class {
    constructor() {
        this._ht = new HashTable;
    }

    reserve(size) {
        this._ht.reserve(size);
    }

    has(key) {
        return this._ht.has(key);
    }

    get(key) {
        return this._ht.get(key);
    }

    set(key, obj) {
        this._ht.put(key, obj);
    }

    *entries() {
        let keys = this._ht.keys(); // this is just an array

        for (let key of keys)
            yield [key, this._ht.get(key)];
    }
};
