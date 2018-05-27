let fs = require('fs');

let f1 = 'left.log';
let f2 = 'right.log';

let n1 = 1e6;
let n2 = 50e3;

let a1 = []; // -> f1, length = n1
let a2 = []; // -> f2, length = n1 - n2

let base = 0x04562081;
let nmax = 8;
let pref = '400673';
let suff = '00';

let tags = Object.keys(fs);
let rand = (min, max) => min + ((max - min + 1) * Math.random() | 0);
let lpad = (n, c, s) => (c.repeat(n) + s).slice(-n);

console.log('generating a1 and a2...');

let addr = base;

for (let i = 0; i < n1; i++) {
    addr += rand(1, nmax);

    let tag = tags[rand(0, tags.length - 1)];
    let line = '0x' + pref + lpad(8, '0', addr.toString(16)) + suff + ' ' + tag;

    a2.push(line);

    if (rand(1, n1) > n2)
        a1.push(line);
}

console.log(lpad(8, '0', base.toString(16)), '..', lpad(8, '0', addr.toString(16)));
console.log('shuffling a1 and a2...');

function shuffle(a) {
    let n = a.length;

    for (let i = 0; i < n - 1; i++) {
        let j = rand(i + 1, n - 1);

        let ai = a[i];
        let aj = a[j];

        a[i] = aj;
        a[j] = ai;
    }
}

shuffle(a1);
shuffle(a2);

console.log('dumping a1 and a2 to files...');

fs.writeFileSync(f1, a1.join('\n'));
fs.writeFileSync(f2, a2.join('\n'));
