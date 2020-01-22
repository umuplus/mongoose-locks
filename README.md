# mongoose-locks

document specific locks for fields

## Install

```bash
npm i --save mongoose-locks
```

## Configuration

- **name (string)       :** field name to store locked fields. it's "locks" by default.
- **default (array)     :** default value for locked fields. it's empty array by default.
- **helpers (boolean)   :** flag for adding helper methods. it's false by default.
- **throw (boolean)     :** flag for throwing errors instead of silent process. it's false by default.

## Examples

```js
const locks = require('mongoose-locks');

const schema = mongoose.Schema({ name: String, title: String });

schema.plugin(locks, { name: 'locks', default: [ 'name' ], helpers: true });
```
