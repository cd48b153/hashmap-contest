module.exports = class {
    constructor() {
        this._data = new Map;
    }

    get([hi, lo]) {
        return this._data.get(hi + ':' + lo);
    }

    set([hi, lo], obj) {
        this._data.set(hi + ':' + lo, obj);
    }

    *entries() {
        for (const [key, obj] of this._data.entries()) {
            let [hi, lo] = key.split(':');
            yield [[+hi, +lo], obj];
        }
    }
};
