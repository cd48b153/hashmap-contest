module.exports = class {
    constructor() {
        this._data = {};
    }

    has(key) {
        return key in this._data;
    }

    get(key) {
        return this._data[key];
    }

    set(key, obj) {
        this._data[key] = obj;
    }

    *keys() {
        yield* Object.keys(this._data);
    }

    *values() {
        yield* Object.values(this._data);
    }

    *entries() {
        yield* Object.entries(this._data);
    }
};
