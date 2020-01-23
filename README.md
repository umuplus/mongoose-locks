# mongoose-locks

Document specific locks for fields.
Works like immutable fields but you can customize them for each document and modify them on the air.

## Install

```bash
npm i --save mongoose-locks
```

## Configuration

- **name (string)       :** field name to store locked fields. it's "locks" by default.
- **default (array)     :** default value for locked fields. it's empty array by default.
- **helpers (boolean)   :** flag for adding helper methods. it's false by default.
- **throw (boolean)     :** flag for throwing errors instead of preventing silently process. it's false by default.

## Method

If you want to access these methods, you need to set helpers option as true.

- **lockField(field):** locks a field. you can't lock storage field
- **unlockField(field):** unlocks a field.

## Examples

```js
const locks = require('mongoose-locks');
const schema = mongoose.Schema({ name: String, job: String });
schema.plugin(locks, { name: 'locks', default: [ 'name' ], helpers: true });
UserModel = mongoose.model('User', schema);

const user = new UserModel({ name: 'John', job: 'Developer' });
await user.save(); // That's fine.
user.name = 'Michael';
await user.save(); // Throws error for name field!
user.unlockField('name');
user.lockField('job');
user.name = 'Michael';
user.job = 'Teacher';
await user.save(); // Throws error for job field!
```
