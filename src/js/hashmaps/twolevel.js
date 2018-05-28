// HashMap<[int, int], T> -> HashMap<HashMap<T>>

module.exports = HashMap => class {
    constructor() {
        this._root = new HashMap;
    }

    get([hi, lo]) {
        let node = this._root.get(hi);
        return node && node.get(lo);
    }

    set([hi, lo], obj) {
        let root = this._root;
        let node = root.get(hi);

        if (!node)
            root.set(hi, node = new HashMap);

        node.set(lo, obj);
    }

    *entries() {
        for (let [hi, node] of this._root.entries())
            for (let [lo, obj] of node.entries())
                yield [[hi, lo], obj];
    }
};