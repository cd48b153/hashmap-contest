# Benchmark for JS hashmaps

Comparing different hashmaps that map 64-bit numbers to strings. The benchmark asks each hashmap implementation to diff two arrays with (key, value) pairs and summarize the diff by the value. Example:

```
0x071e1c80 fchown
0x052223c0 rename
0x08298ec0 R_OK
0x05eb2bf0 unlinkSync
0x08591620 unlinkSync
0x05e97410 fdatasync

0x071e1c80 fchown
0x052223c0 rename
0x08298ec0 R_OK
0x05eb2bf0 unlinkSync
0x05b480c0 close
0x0896ebc0 mkdir
0x053df0a0 mkdir
0x08591620 unlinkSync
0x05e97410 fdatasync
```

The diff should be `{mkdir:2, close:1}`.

Hashmaps being compared:

- es6 - the built-in [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) class.
- naive - the [object literal](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics) `{}` used as a hashmap
- trie - the 32-bit number is considered as a 4-byte string and used to address a 4-level [trie](https://en.wikipedia.org/wiki/Trie)
- list - the classic hashmap that uses lists for items with the same hash
- npmjs [hashmap](https://www.npmjs.com/package/hashmap)
- npmjs [hashtable](https://www.npmjs.com/package/hashtable)

Results are relative to the fastest hashmap: `2.50` means that this hashmap runs 2.5x slower than the fastest one. The es6 `Map` is used to verify correctness of other hashmaps.

|           |   1M-50K |
| --------- | -------- |
|      es6  |     1.00 |
|  hashmap  |     1.93 |
|    naive  |     1.30 |
|     trie  |     2.17 |
|     list  |          |
| hashtable |          |

# License

MIT
