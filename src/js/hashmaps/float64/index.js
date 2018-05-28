module.exports = class {
    constructor() {
        this._data = new Map;
        this._i32 = new Int32Array(2);
        this._f64 = new Float64Array(this._i32.buffer);
        this._nan = {};
    }

    get([hi, lo]) {
        this._i32[0] = lo;
        this._i32[1] = hi;

        let key = this._f64[0];

        return Number.isFinite(key) && key != 0 ?
            this._data.get(key) :
            this._nan[hi + ':' + lo];

    }

    set([hi, lo], obj) {
        this._i32[0] = lo;
        this._i32[1] = hi;

        let key = this._f64[0];

        if (Number.isFinite(key) && key != 0)
            this._data.set(key, obj);
        else
            this._nan[hi + ':' + lo] = obj;
    }

    *entries() {
        for (const [key, obj] of this._data.entries()) {
            this._f64[0] = key;
            let lo = this._i32[0];
            let hi = this._i32[1];
            yield [[hi, lo], obj];
        }

        for (let [key, obj] of Object.entries(this._nan)) {
            let [hi, lo] = key.split(':');
            yield [[+hi, +lo], obj];
        }
    }
};
