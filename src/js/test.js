const fs = require('fs');
const path = require('path');
const glob = require('glob');

const diffByAddrGroupByType = require('./diff');

const REFERENCE_IMPL = 'es6';
const LINE_PATTERN = /^0x([0-9a-f]{16}) (\w+)$/;

let implsGlob = process.argv[2];
let testsGlob = process.argv[3];

function log(...args) {
    let time = new Date().toJSON().slice(11, -1);
    console.log('[', time, ']', ...args);
}

log('getting hashmap implementations from', implsGlob);

let impls = {}; // impls["es6"] = require("/src/js/hashmaps/es6/index.js")
let tests = {}; // tests["1M-50K"] = {left: [keys, vals], right: [keys, vals]}

for (let filepath of glob.sync(implsGlob)) {
    filepath = path.resolve(filepath);
    let name = path.dirname(filepath).split(path.sep).pop();
    log(name, '=', filepath);
    impls[name] = require(filepath);
}

log('loading testcases from', testsGlob);

function parseTestCase(text) {
    let lines = text.split(/\r?\n/); // this might seem slow, but try to do better

    log(text.length >> 20, 'MB', lines.length, 'lines');

    let keys = new Array(lines.length);
    let vals = new Array(lines.length);

    let i = 0;

    for (let line of lines) {
        let match = LINE_PATTERN.exec(line);

        if (!match)
            throw new SyntaxError(`Line ${JSON.stringify(line)} doesn't match pattern ${LINE_PATTERN}`);

        keys[i] = match[1];
        vals[i] = match[2];

        i++;
    }

    return [keys, vals];
}

for (let filepath of glob.sync(testsGlob)) {
    filepath = path.resolve(filepath);
    let testname = path.dirname(filepath).split(path.sep).pop();
    let filename = path.basename(filepath, path.extname(filepath));
    log(testname + ' : ' + filename, '=', filepath);
    tests[testname] = tests[testname] || {};
    let text = fs.readFileSync(filepath, 'utf8');
    let [keys, vals] = parseTestCase(text);
    tests[testname][filename] = [keys, vals];
}

log('running the testcases');

let results = {}; // results["1M-50K"]["es6"] = 550 ms

function compareDiffs(a, b) {
    for (let x in a)
        if (a[x] != b[x])
            return false;

    for (let x in b)
        if (a[x] != b[x])
            return false;

    return true;
}

for (let [testname, test] of Object.entries(tests)) {
    let left = test.left;
    let right = test.right;

    if (!left || !right)
        throw new Error(`Testcase ${testname} doesn't have either "left" or "right" data`);

    let diffs = {}; // diffs["es6"] = {foo:4, bar:5}
    let times = {}; // times["es6"] = 400 ms
    let valid = {}; // valid["es6"] = true

    let runTestCase = implname => {
        log('diffing', testname, 'with', implname);
        let impl = impls[implname];
        let time = Date.now();
        let diff = diffByAddrGroupByType(impl, left, right);
        time = Date.now() - time;
        times[implname] = time;
        diffs[implname] = diff;
    };

    runTestCase(REFERENCE_IMPL); // it's the reference and others will check against this result
    valid[REFERENCE_IMPL] = true;

    for (let name in impls) {
        if (name == REFERENCE_IMPL)
            continue;

        runTestCase(name);

        let same = compareDiffs(diffs[name], diffs[REFERENCE_IMPL]);
        !same && log('hashmap', JSON.stringify(name), 'produced a wrong diff');
        valid[name] = same;
    }

    results[testname] = {};

    for (let name in impls)
        results[testname][name] = valid[name] ? times[name] / times[REFERENCE_IMPL] : 0;
}

let colwidth = 10;
let lpad = (s, n = colwidth, c = ' ') => (c.repeat(n) + s).slice(-n);
let cells = [];

cells.push(['', ...Object.keys(tests)]);
cells.push('-'.repeat(Object.keys(tests).length + 1).split('').map(c => c.repeat(colwidth)))

for (let implname in impls)
    cells.push([implname, ...Object.keys(tests).map(testname => results[testname][implname].toFixed(2))]);

log('results:\n' + cells.map(
    line => '| ' + line.map(
        cell => lpad(cell))
        .join(' | ') + ' |')
    .join('\n'));
