var test = require("tape");
var IndexStore = require(".");
var maxSmi = 1073741823; // max 31-bit signed int

test("index store", function(t) {
    t.plan(25);

    var storeA = new IndexStore();

    // getIndex
    t.equal(storeA.getIndex(), 0, "indexes start at 0");
    t.equal(storeA.getIndex(), 1, "indexes increment by 1");

    // validation
    t.ok(storeA.isValid(1), "isValid returns true for numbers returned from getIndex()");
    t.ok(storeA.isValid(0), "isValid returns true for 0 if 0 is active");
    t.notOk(storeA.isValid(2), "isValid returns false for numbers greater than largest active");
    t.notOk(storeA.isValid(-1), "isValid returns false for negative numbers");
    t.notOk(storeA.isValid(0.02), "isValid returns false for non-whole numbers");
    t.notOk(storeA.isValid(Infinity), "isValid returns false for non-finite numbers");
    t.notOk(storeA.isValid(NaN), "isValid returns false for non-number numbers");
    t.notOk(storeA.isValid("1"), "isValid returns false for strings");
    t.notOk(storeA.isValid(null), "isValid returns false for null");
    t.notOk(storeA.isValid(undefined), "isValid returns false for undefined");

    // reclying
    storeA.releaseIndex(0);

    t.notOk(storeA.isValid(0), "isValid returns false if index has been returned");
    t.equal(storeA.getNewIndex(), 2, "getNewIndex returns ++largest index regardless of freed indexes");
    t.equal(storeA.getIndex(), 0, "getIndex returns freed index if possible");
    t.equal(storeA.getIndex(), 3, "getIndex increments normally if freed indexes exhausted");

    // max
    t.equal(storeA.max, maxSmi, "default max is max smi (v8)");
    storeA.max = 10;
    t.equal(++storeA.max, 11, "max property is assignable");
    storeA.max = "a";
    t.equal(storeA.max, 11, "max remains unchanged if new value is invalid");
    storeA.max = "5";
    t.equal(storeA.max, 5, "max can be set with a number string");
    storeA.max = 3.03;
    t.equal(storeA.max, 3, "max can be set with a float");
    storeA.max = -1;
    t.equal(storeA.max, 3, "max cannot be negative");

    var storeB = new IndexStore();
    t.equal(storeB.max, maxSmi, "max for new instances is default value");

    storeB.max = 99;
    t.equal(storeA.max, 3);
    t.equal(storeB.max, 99);
});