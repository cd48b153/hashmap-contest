# Benchmark for JS hashmaps

[![Build Status](https://travis-ci.org/cd48b153/hashmap-contest.svg?branch=master)](https://travis-ci.org/cd48b153/hashmap-contest)

Comparing different hashmaps that map 64-bit numbers to strings. The benchmark asks each hashmap implementation to diff two arrays with (key, value) pairs and summarize the diff by the value. Example:

```
0x400673046f13a400 openSync
0x40067304892cca00 watchFile
0x4006730491a04c00 Stats
0x400673049a84e900 FileReadStream
0x4006730456798300 chownSync
0x400673046f164800 mkdtempSync
0x4006730496292b00 readFileSync

0x400673046f13a400 openSync
0x40067304892cca00 watchFile
0x4006730491a04c00 Stats
0x400673049a84e900 FileReadStream
0x4006730456798300 chownSync
0x400673046f164800 mkdtempSync
0x4006730496292b00 readFileSync
0x4006730456400800 chmod
0x4006730483929900 createWriteStream
0x4006730485bd9900 createWriteStream
```

The diff should be `{createWriteStream:2, chmod:1}`.

If keys were 32 bit, then the es6 `Map` would be hard to outperform.

Hashmaps being compared:

- es6 - the built-in [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class stacked as `Map<Map<int, string>>` and addressed with `map.get(key_hi).get(key_lo)`
- naive - the [object literal](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics) `{}` used as a hashmap; the two 32 bit keys are stringified and merged
- trie - the 64 bit key is split into 4-30-30 bit sequence which is used to address a 3-level [trie](https://en.wikipedia.org/wiki/Trie)
- list - the classic hashmap that uses lists for items with the same hash
- npmjs [hashmap](https://www.npmjs.com/package/hashmap) stacked like `HashMap<HashMap<int, string>>`

Results are relative to the `{}`/naive hashmap: `2.50` means that this hashmap runs 2.5x slower than `{}`. The `{}`/naive hashmap is also used to verify correctness of other implementations.

|            |     1M-50K |    2M-100K |      3M-5K |
| ---------- | ---------- | ---------- | ---------- |
|        es6 |       0.55 |       0.45 |       0.42 |
|    hashmap |       2.13 |       1.90 |       2.16 |
|       list |       0.30 |       0.24 |       0.22 |
|      naive |       1.00 |       1.00 |       1.00 |
|       trie |       0.68 |       0.55 |       0.52 |

# Build & Run

```
git clone ...
npm install
npm test
```

# License

MIT
