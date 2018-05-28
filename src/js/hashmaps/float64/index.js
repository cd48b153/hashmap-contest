module.exports = class {
    constructor() {
        this._data = new Map;
        this._i32 = new Int32Array(2);
    }

    get([hi, lo]) {
        this._i32[0] = lo;
        this._i32[1] = hi;
        return this._data.get(new Float64Array(this._i32.buffer)[0]);
    }

    set([hi, lo], obj) {
        this._i32[0] = lo;
        this._i32[1] = hi;
        return this._data.set(new Float64Array(this._i32.buffer)[0]);
    }

    *entries() {
        for (const [key, obj] of this._data.entries()) {
            let [lo, hi] = new Int32Array(key.buffer);
            yield [[+hi, +lo], obj];
        }
    }
};
