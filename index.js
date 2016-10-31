var recyclables = [];


/****
IndexStore class
****/
function IndexStore() {}

IndexStore.prototype = Object.create({
    _i: -1,
    _key: -1,
    _max: -1 >>> 2 // max smi
}, {
    max: {
        get: function() {
            return this._max;
        },
        set: function(max) {
            this.setMax(max);
            return this._max;
        }
    }
});

/**
 * set max index value
 * @param {number} max - max index
 */
IndexStore.prototype.setMax = function(max) {
    max = naturalize(max);
    if (max) {
        if (~this._key && max > this._i) {
            console.warn(`new max: ${max} greater than largest active index: ${this._i}`);
            setTimeout(removeInvalid, 0, recyclables[this._key], max);
        }
        this._max = max;
    }
};


/**
 * @return {number} next valid index. first checks free ids
 */
IndexStore.prototype.getIndex = function() {
    if (~this._key && recyclables[this._key].length) {
        return recyclables[this._key].pop();
    }
    return this.getNewIndex();
};

/**
 * @param  {number} n
 * @return {number} returns n if valid, otherwise returns new index
 */
IndexStore.prototype.ensureValid = function(n) {
    if (checkIndex(n, this._i)) return n;
    return this.getIndex();
};

/**
 * @return {number} returns new index, ignoring recycle
 */
IndexStore.prototype.getNewIndex = function() {
    if (this._i < this._max) return ++this._i;
    console.error(`max index exceeded: ${this._max}`);
    return -1;
};

/**
 * @param  {number}  index
 * @return {boolean} true if index is a positive int < max
 */
IndexStore.prototype.isValid = function(index) {
    return (checkIndex(index, this._i) && !this.isDormant(index));
};

/**
 * marks an index as unused, free for recyling
 * @param  {number} index
 */
IndexStore.prototype.releaseIndex = function(index) {
    if (checkIndex(index, this._max)) {
        if (index === this._i) {
            --this._i;
        } else if (~this._key) {
            recyclables[this._key].push(index);
        } else {
            this._key = recyclables.length;
            recyclables[this._key] = [ index ];
        }
    }
};

/**
 * check if index is in a store's recycle array
 * @param {number} index - the index to check
 * @return {boolean} true if index is in store's recycle array
 */
IndexStore.prototype.isDormant = function(index) {
    return (~this._key && inArray(index, recyclables[this._key]));
};


/****
utils
****/

/**
 * check if something is an int >= 0
 * @param  {*} n - The arg to test
 * @return {boolean} True if 'n' is a non-negative whole number
 */
function isNatural(n) {
    return (n >>> 0) === n;
}

/**
 * normalizes arg to be a natural number
 * @param  {*} n - The number to normalize
 * @return {number} Non-negative int. If 'n' wasn't a number, returns 0
 */
function naturalize(n) {
    if (isNatural(n)) return n;

    n = parseInt(n) || 0;
    if (n < 0) n = 0;
    return n;
}

/**
 * check if index is valid
 * @param  {*} i - The index
 * @param  {number} max - The max value
 * @return {boolean} True for positive whole numbers <= max
 */
function checkIndex(i, max) {
    return isNatural(i) && i <= max;
}

/**
 * removes items from an array
 * @param  {Array} arr - The array to iterate over
 * @param  {number} max - max value. larger numbers will be removed
 */
function removeInvalid(arr, max) {
  var i = 0,
      rm = 0,
      len = arr.length;
  loop:
  do {
    while (arr[i + rm] > max) {
      if (++rm + i >= len) break loop;
    }
    arr[i] = arr[i + rm];
  } while (++i + rm < len);
  arr.length = len - rm;
}

/**
 * checks if item is in array
 * @param  {*} val - The thing to check for
 * @param  {Array} arr - The array
 * @return {boolean} True if val is found in arr
 */
function inArray(val, arr) {
    for (var i = 0, j = arr.length; i < j; ++i) {
        if (arr[i] === val) return true;
    }
    return false;
}


exports = module.exports = IndexStore;