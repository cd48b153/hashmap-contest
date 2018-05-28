module.exports = class {
    constructor() {
        this.data = [];

        for (let i = 0; i < 16; i++)
            this.data[i] = [];
    }

    get([key_hi, key_lo]) {
        const a = key_hi & 3 | (key_lo & 3) << 2;
        const b = key_hi >>> 2;
        const c = key_lo >>> 2;

        const t = this.data[a][b];

        return t && t[c];
    }

    set([key_hi, key_lo], value) {
        const a = key_hi & 3 | (key_lo & 3) << 2;
        const b = key_hi >>> 2;
        const c = key_lo >>> 2;

        const q = this.data[a];

        if (!q[b])
            q[b] = [];

        q[b][c] = value;
    }

    *entries() {
        for (let a = 0; a < 16; a++) {
            let p = this.data[a];

            for (let _b in p) {
                let b = +_b;
                let q = p[_b];

                for (let _c in q) {
                    let c = +_c;
                    let obj = q[_c];
                    let key_hi = (a & 3) << 30 | b << 2;
                    let key_lo = (a >> 2 & 3) | c << 2;
                    yield [[key_hi, key_lo], obj];
                }
            }
        }
    }
};