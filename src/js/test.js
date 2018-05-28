const fs = require('fs');
const path = require('path');
const glob = require('glob');

const diffByAddrGroupByType = require('./diff');

const COL_WIDTH = 12;
const DEFAULT_TAGS = Object.keys(fs);
const REFERENCE_IMPL = 'naive';

let implsGlob = process.argv[2];
let testsGlob = process.argv[3];

function log(...args) {
    let time = new Date().toJSON().slice(11, -1);
    console.log('[', time, ']', ...args);
}

log('getting hashmap implementations from', implsGlob);

let impls = {}; // impls["es6"] = require("/src/js/hashmaps/es6/index.js")
let tests = {}; // tests["1M-50K"] = config

for (let filepath of glob.sync(implsGlob)) {
    filepath = path.resolve(filepath);
    let name = path.dirname(filepath).split(path.sep).pop();
    log(name, '=', filepath);
    impls[name] = require(filepath);
}

log('loading testcases from', testsGlob);

for (let filepath of glob.sync(testsGlob)) {
    filepath = path.resolve(filepath);
    let testname = path.basename(filepath, path.extname(filepath));
    log(testname, '=', filepath);
    tests[testname] = JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

log('running the testcases');

let results = {}; // results["1M-50K"]["es6"] = 550 ms

let rand = (min, max) => min + ((max - min + 1) * Math.random() | 0);
let lpad = (n, c, s) => (c.repeat(n) + s).slice(-n);

function swap(a, i, j) {
    let ai = a[i];
    let aj = a[j];

    a[i] = aj;
    a[j] = ai;
}

function shuffle(keys, vals) {
    let n = keys.length;

    for (let i = n - 1; i > 0; i--) {
        let j = rand(0, i - 1);

        swap(keys, i, j);
        swap(vals, i, j);
    }
}

function generateTestCase(config) {
    let tags = config.tags || DEFAULT_TAGS;

    let lkeys = [];
    let lvals = [];
    let rkeys = [];
    let rvals = [];

    for (let i = 0; i < config.size; i++) {
        let addr_lo = (Math.random() - 0.5) * 0x7FFFFFFF | 0;
        let addr_hi = (Math.random() - 0.5) * 0x7FFFFFFF | 0;

        let tag = tags[rand(0, tags.length - 1)];
        let key = [addr_hi, addr_lo];

        rkeys.push(key);
        rvals.push(tag);

        if (rand(1, config.size) > config.diff) {
            lkeys.push(key);
            lvals.push(tag);
        }
    }

    shuffle(lkeys, lvals);
    shuffle(rkeys, rvals);

    return [lkeys, lvals, rkeys, rvals];
}

function compareDiffs(a, b) {
    if (a === b)
        return true;

    for (let x in a)
        if (a[x] != b[x])
            return false;

    for (let x in b)
        if (a[x] != b[x])
            return false;

    return true;
}

for (let [testname, testconfig] of Object.entries(tests)) {
    log('generating testcase', testname);

    let [lkeys, lvals, rkeys, rvals] = generateTestCase(testconfig); // this can be over 1 GB

    log('testcase size:', lkeys.length, 'vs', rkeys.length, 'entries');

    let diffs = {}; // diffs["es6"] = {foo:4, bar:5}
    let times = {}; // times["es6"] = 400 ms
    let valid = {}; // valid["es6"] = true

    let runTestCase = implname => {
        log('diffing', testname, 'with', implname);
        let impl = impls[implname];
        let time = Date.now();
        let diff = diffByAddrGroupByType(impl, [lkeys, lvals], [rkeys, rvals]);
        time = Date.now() - time;
        times[implname] = time;
        diffs[implname] = diff;
        valid[implname] = compareDiffs(diffs[implname], diffs[REFERENCE_IMPL]);
        log('result:', time, 'ms,', 'valid:', valid[implname]);
    };

    runTestCase(REFERENCE_IMPL); // it's the reference so run it first
    log('diff size:', Object.values(diffs[REFERENCE_IMPL]).reduce((s, x) => s + x, 0));

    for (let name in impls)
        if (name != REFERENCE_IMPL)
            runTestCase(name);

    results[testname] = {};

    for (let name in impls)
        results[testname][name] = valid[name] ? times[name] / times[REFERENCE_IMPL] : 0;
}

let cells = [];

cells.push(['', ...Object.keys(tests)]);
cells.push('-'.repeat(Object.keys(tests).length + 1).split('').map(c => c.repeat(COL_WIDTH)))

for (let implname in impls)
    cells.push([implname, ...Object.keys(tests).map(testname => results[testname][implname].toFixed(2))]);

log('results:\n' + cells.map(
    line => '| ' + line.map(
        cell => lpad(COL_WIDTH, ' ', cell))
        .join(' | ') + ' |')
    .join('\n'));
