module.exports = class {
    constructor() {
        this._data = {};
    }

    get([hi, lo]) {
        return this._data[hi + ':' + lo];
    }

    set([hi, lo], obj) {
        this._data[hi + ':' + lo] = obj;
    }

    *entries() {
        for (const [key, obj] of Object.entries(this._data)) {
            let [hi, lo] = key.split(':');
            yield [[+hi, +lo], obj];
        }
    }
};
