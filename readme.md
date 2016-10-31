# Index Store
## usage
```javascript
var IndexStore = require("index-store");
var store = new IndexStore();
```

### methods
* getIndex
    - returns an unused index. If no valid values under max are available, returns -1
* setMax
    - sets max index value. default max is 1073741823
* isValid
    - returns true if supplied arg is an active index (a value returned by getIndex which has not been released)
* releaseIndex
    - marks returned index as free for reuse

### private properties
Property names starting with an underscore (_i, _key, _max) are meant to be private. There isn't anything keeping them from being read/written directly; the underscores are just meant to signify intended use.