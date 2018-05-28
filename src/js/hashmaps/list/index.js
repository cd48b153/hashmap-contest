module.exports = class {
    constructor() {
        this._size = 0;
        this._indx = [];
        this._next = [];
        this._keys = [];
        this._data = [];

        this._key = null;
        this._node = null;
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

        this._key = key;
        this._node = node;

        return node > 0;
    }

    get(key) {
        if (key == this._key)
            return this._data[this._node];

        let hash = this._hash(key);
        let node = this._indx[hash] || 0;

        while (node > 0 && this._keys[node] != key)
            node = this._next[node];

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
        let n = this._indx.length;

        let h1 = hash & 255;
        let h2 = hash >> 8 & 255;
        let h3 = hash >> 16 & 255;
        let h4 = hash >> 24 & 255;

        let w1 = 0x81cb45;
        let w2 = 0xb67181;
        let w3 = 0x018a73;
        let w4 = 0x72bc17;

        hash = (hash + h1 * w1 % n) % n;
        hash = (hash + h2 * w2 % n) % n;
        hash = (hash + h3 * w3 % n) % n;
        hash = (hash + h4 * w4 % n) % n;

        return hash < 0 ? hash + n : hash;
    }
};
