# mongoose-locks

Document specific locks for fields.
Works like immutable fields but you can customize them for each document and modify them on the air.

## Motivation

Mongoose's immutable fields have same behavior for each document in the collection but
in some cases you might need locks for different fields for different documents.

Let's say we have a schema for *Users* with roles. That means, we'll have users with different roles in the collection.
In a real world application, you might need locks on different fields by roles of those users.

For example; administrators have nothing locked on their document but sales people might have their allowed modules locked.
In a collection for products, all products might have lock on SKU field but some of them might need locks on different fields
by the need of the category which they belong to.

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

- **lockAll():** locks all fields except storage field
- **lockField(field):** locks a field. you can't lock storage field
- **unlockAll():** unlocks all fields
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
