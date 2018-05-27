module.exports = class {
    constructor() {
        this._root = [];
    }

    has(key) {
        let key_hi = key.slice(0, 8);
        let key_lo = key.slice(8);

        let hash_hi = parseInt(key_hi, 16);
        let hash_lo = parseInt(key_lo, 16);

        let hash = hash_hi ^ hash_lo;

        let h1 = hash >> 24 & 255;
        let h2 = hash >> 16 & 255;
        let h3 = hash >> 8 & 255;
        let h4 = hash & 255;

        let node = this._root;

        if (!node) return false; node = node[h1];
        if (!node) return false; node = node[h2];
        if (!node) return false; node = node[h3];
        if (!node) return false; node = node[h4];

        return !!node;
    }

    get(key) {
        let key_hi = key.slice(0, 8);
        let key_lo = key.slice(8);

        let hash_hi = parseInt(key_hi, 16);
        let hash_lo = parseInt(key_lo, 16);

        let hash = hash_hi ^ hash_lo;

        let h1 = hash >> 24 & 255;
        let h2 = hash >> 16 & 255;
        let h3 = hash >> 8 & 255;
        let h4 = hash & 255;

        let node = this._root;

        if (!node) return; node = node[h1];
        if (!node) return; node = node[h2];
        if (!node) return; node = node[h3];
        if (!node) return; node = node[h4];

        return node && node[1];
    }

    set(key, obj) {
        let key_hi = key.slice(0, 8);
        let key_lo = key.slice(8);

        let hash_hi = parseInt(key_hi, 16);
        let hash_lo = parseInt(key_lo, 16);

        let hash = hash_hi ^ hash_lo;

        let h1 = hash >> 24 & 255;
        let h2 = hash >> 16 & 255;
        let h3 = hash >> 8 & 255;
        let h4 = hash & 255;

        let node = this._root;

        node = node[h1] || (node[h1] = []);
        node = node[h2] || (node[h2] = []);
        node = node[h3] || (node[h3] = []);

        node[h4] = [key, obj];
    }

    *entries() {
        let r1 = this._root;

        for (let h1 = 0; r1 && h1 < 256; h1++) {
            let r2 = r1[h1];

            for (let h2 = 0; r2 && h2 < 256; h2++) {
                let r3 = r2[h2];

                for (let h3 = 0; r3 && h3 < 256; h3++) {
                    let r4 = r3[h3];

                    for (let h4 = 0; r4 && h4 < 256; h4++) {
                        let entry = r4[h4];

                        if (entry)
                            yield entry;
                    }
                }
            }
        }
    }
};
