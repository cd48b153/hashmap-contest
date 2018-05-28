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

    get(key) {
        let hash = this._hash(key);
        let node = this._indx[hash] || 0;

        while (node > 0 && !this._test(node, key))
            node = this._next[node];

        return this._data[node];
    }

    set(key, obj) {
        let hash = this._hash(key);
        let node = this._indx[hash] || 0, prev = 0;

        while (node > 0 && !this._test(node, key))
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

    _hash([hi, lo]) {
        let n = this._indx.length;
        let h = (hi ^ lo) % n;
        return h < 0 ? h + n : h;
    }

    _test(node, key) {
        let k = this._keys[node];
        return k[0] == key[0] && k[1] == key[1];
    }
};
