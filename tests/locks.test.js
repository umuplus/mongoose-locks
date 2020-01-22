'use strict';

const locks = require('..');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', false);

const schema = mongoose.Schema({
    name: { type: String, required: true },
    options: Object
});
schema.plugin(locks, { default: [ 'name' ], helpers: true, throw: true });
mongoose.model('TestModel', schema);

const TestModel = mongoose.model('TestModel', schema);
describe('mongoose locks', () => {
    beforeAll(async done => {
        const db = `lock_test_${ Math.random().toString().replace('.', '') }`;
        await mongoose.connect(`mongodb://127.0.0.1:27017/${ db }`, {
            useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true
        });
        setTimeout(done, 500);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        mongoose.connection.close();
    });

    let id, name, num;
    test('no effect on create', async () => {
        const model = new TestModel({ name: Math.random().toString() });
        await model.save();
        id = model._id;
        name = model.name;
        expect(id).toBeTruthy();
    });

    test('field is locked', async () => {
        try {
            const model = await TestModel.findOne({ _id: id });
            model.name = Math.random().toString();
            await model.save();
            expect(model.locks).not.toBeTruthy();
        } catch (e) {
            expect(e.message.endsWith('is locked!')).toBeTruthy();
        }
    });

    test('field is not locked', async () => {
        num = Math.random();
        const model = await TestModel.findOne({ _id: id });
        model.options = { num };
        await model.save();
        expect(model.options.num).toBe(num);
    });

    test('can\'t lock field', async () => {
        try {
            const model = await TestModel.findOne({ _id: id });
            model.lockField('locks');
            expect(model.locks).not.toBeTruthy();
        } catch (e) {
            expect(e.message.startsWith('can\'t lock')).toBeTruthy();
        }
    });

    test('lock field', async () => {
        try {
            const model = await TestModel.findOne({ _id: id });
            model.lockField('options');
            model.options = { num: 1 };
            await model.save();
            expect(model.locks).not.toBeTruthy();
        } catch (e) {
            expect(e.message.endsWith('is locked!')).toBeTruthy();
        }
    });

    test('unlock field', async () => {
        const model = await TestModel.findOne({ _id: id });
        model.unlockField('name');
        name = Math.random().toString();
        model.name = name;
        await model.save();
        expect(model.name).toBe(name);
    });
});
