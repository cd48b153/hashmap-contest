/**
 * This is what's being measured.
 * 
 * Finds a diff by key between two lists: R - L.
 * If entries with the same key have different values: throws an error.
 * The diff is then grouped by value and returned as plain object.
 */
module.exports = (impl, [lkeys, lvals], [rkeys, rvals]) => {
    let hashmap = new impl; // all entries from left
    let diffmap = new impl; // all entries from right - left

    hashmap.reserve && hashmap.reserve(lkeys.length);
    diffmap.reserve && diffmap.reserve(rkeys.length - lkeys.length);

    for (let i = 0; i < lkeys.length; i++)
        hashmap.set(lkeys[i], lvals[i]);

    for (let i = 0; i < rkeys.length; i++) {
        let key = rkeys[i];
        let obj = rvals[i];

        let val = hashmap.get(key);

        if (!val)
            diffmap.set(key, obj);
        else if (val != obj)
            throw new Error(`Mismatching values at ${key}: ${JSON.stringify(val)} vs ${JSON.stringify(obj)}`);
    }

    let diff = {};

    for (let [addr, type] of diffmap.entries())
        diff[type] = (diff[type] || 0) + 1;

    return diff;
};