var util = require('util');

module.exports = {

    camelCase: function (value) {
        return value.replace(/(\_[a-zA-Z])/g, function (match, snake) {
            return snake.substring(1).toUpperCase();
        });
    },

    mixin: function (base, mixins) {
        var mixin,
            properties,
            property,
            mixinObject;

        if (!util.isArray(mixins)) {
            mixins = [mixins];
        }

        for (mixin in mixins) {
            mixinObject = mixins[mixin];
            properties = Object.getOwnPropertyNames(mixinObject);
            for (property in properties) {
                if (!base.hasOwnProperty(properties[property])) {
                    base[properties[property]] = mixinObject[properties[property]];
                } else {
                    console.warn('Trying to override base method with mixin, this is not supported');
                }
            }
        }

        return base;
    }

}