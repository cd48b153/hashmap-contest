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

- es6-stack - the built-in [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class stacked as `Map<Map<int, string>>` and addressed with `map.get(key_hi).get(key_lo)`
- es6-concat - the same es6 `Map`, but now the two 32 bit keys are stringified and concatenated
- naive - the [object literal](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics) `{}` used as a hashmap; the two 32 bit keys are stringified and merged
- naive-stack - now the two keys aren't concatenated, but used to address a 2-level `{}` hashmap, which still results in stringifying the keys are yields even worse performance
- trie - the 64 bit key is split into 4-30-30 bit sequence which is used to address a 3-level [trie](https://en.wikipedia.org/wiki/Trie)
- list - the classic hashmap that uses lists for items with the same hash
- npmjs [hashmap](https://www.npmjs.com/package/hashmap) stacked like `HashMap<HashMap<int, string>>`
- float64 - converts `(int32, int32)` to `float64` with typed arrays - an idea [suggested](https://habr.com/post/360533/#comment_15991339) by dom1n1k

Results are relative to the `{}`/naive hashmap: `2.50` means that this hashmap runs 2.5x slower than `{}`. The `{}`/naive hashmap is also used to verify correctness of other implementations.

|              |       1M-50K |      2M-100K |        3M-5K |
| ------------ | ------------ | ------------ | ------------ |
|   es6-concat |         1.02 |         0.98 |         0.81 |
|    es6-stack |         0.58 |         0.49 |         0.57 |
|      float64 |         0.43 |         0.42 |         0.38 |
|      hashmap |         1.98 |         2.11 |         2.22 |
|         list |         0.31 |         0.26 |         0.24 |
|  naive-stack |         1.50 |         1.28 |         1.27 |
|        naive |         1.00 |         1.00 |         1.00 |
|         trie |         0.67 |         0.76 |         0.55 |

# Build & Run

```
git clone ...
npm install
npm test
```

# How to add a new hashmap implementation

Add a new `index.js` file at `/src/js/hashmaps/<name>/index.js`. The `npm test` script will see the new file and run it.

# License

MIT
