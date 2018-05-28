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

Hashmaps being compared:

- es6 - the built-in [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class.
- naive - the [object literal](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics) `{}` used as a hashmap
- trie - the 32-bit number is considered as a 4-byte string and used to address a 4-level [trie](https://en.wikipedia.org/wiki/Trie)
- list - the classic hashmap that uses lists for items with the same hash
- npmjs [hashmap](https://www.npmjs.com/package/hashmap)
- npmjs [hashtable](https://www.npmjs.com/package/hashtable) - a surprisingly fragile package that needs Python 2.7, VS 2015 build tools, node-gyp and other mess configured in a very particular way - installing it will happily waste many hours of your time; moreover, at runtime it apparently corrupts memory, so it needs to be tested separately, or it just quietly crashes the node process

Results are relative to the es6 hashmap: `2.50` means that this hashmap runs 2.5x slower than `Map`. The es6 `Map` is also used to verify correctness of other hashmaps.

|            |     1M-50K |    2M-100K |      3M-5K |
| ---------- | ---------- | ---------- | ---------- |
|        es6 |       1.00 |       1.00 |       1.00 |
|    hashmap |       2.20 |       2.26 |       2.29 |
|       list |       1.33 |       1.19 |       1.29 |
|      naive |       1.40 |       1.41 |       1.71 |
|       trie |       1.84 |       1.48 |       1.61 |
|  hashtable |       2.39 |       2.26 |          - |

# Build & Run

```
git clone ...
npm install
npm test
```

However if you don't have all the tools for compiling the npmjs `hashtable`, then remove it from `package.json` and from `/src/js/hashmaps`. Alternatively, you can change the glob pattern in `package.json` to skip loading `hastable`:

```
src/js/hashmaps/!(hashtable)/index.js
```

# License

MIT
