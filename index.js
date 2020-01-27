'use strict';

module.exports = function (schema, options = {}) {
    let name = 'locks', values = [];
    if (typeof options.field === 'string') name = options.field;
    if (options.default instanceof Array) values = options.default;
    schema.add({ [ name ]: { type: Array, default: values } });

    if (options.helpers) {
        schema.methods.lockField = function (field) {
            if (this[name] instanceof Array) {
                if (field === name) {
                    if (options.throw) throw new Error(`can't lock "${ field }"`);
                } else if (!this[name].includes(field)) this[name].push(field);
            }
        };
        schema.methods.unlockField = function (field) {
            if (this[name] instanceof Array)
                if (this[name].includes(field))
                    this[name] = this[name].filter(item => field !== item);
        };
    }

    schema.pre('save', function (next) {
        if (this.isNew) return next();
        if (this[name] instanceof Array)
            this[name].forEach(field => {
                if (this.isModified(field))
                    if (!options.throw) this.unmarkModified(field);
                    else throw new Error(`"${ field }" is locked!`);
            });
        next();
    });
};
