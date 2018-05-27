module.exports = class {
    constructor() {
        this._size = 0;
        this._indx = [];
        this._next = [];
        this._keys = [];
        this._data = [];
    }

    reserve(size) {
        this._indx.length = size * 2;
        this._next.length = size + 1;
        this._keys.length = size + 1;
        this._data.length = size + 1;
    }

    has(key) {
        let hash = this._hash(key);
        let node = this._indx[hash] || 0;

        while (node > 0 && this._keys[node] != key)
            node = this._next[node];

        return node > 0;
    }

    get(key) {
        let hash = this._hash(key);
        let node = this._indx[hash] || 0;

        while (node > 0 && this._keys[node] != key)
            node = this._next[node];

        if (node > 0)
            return this._data[node];
    }

    set(key, obj) {
        let hash = this._hash(key);
        let node = this._indx[hash] || 0, prev = 0;

        while (node > 0 && this._keys[node] != key)
            node = this._next[prev = node];

        if (node > 0) {
            this._data[node] = obj;
        } else {
            node = ++this._size;

            this._data[node] = obj;
            this._keys[node] = key;

            if (prev > 0)
                this._next[prev] = node;
            else
                this._indx[hash] = node;
        }
    }

    *entries() {
        for (let i = 0; i < this._size; i++)
            yield [this._keys[i + 1], this._data[i + 1]];
    }

    _hash(key) {
        let key_hi = parseInt(key.slice(0, 8), 16);
        let key_lo = parseInt(key.slice(8), 16);

        let hash = key_hi ^ key_lo;

        hash %= this._indx.length;

        if (hash < 0)
            hash += this._indx.length

        return hash;
    }
};
