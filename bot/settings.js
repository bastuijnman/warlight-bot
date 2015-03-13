module.exports = {

    collection: {},

    set: function (key, value) {
        this.collection[key] = value;
    },

    get: function (key) {
        if(typeof this.collection[key] === 'undefined') {
            throw new Error('this setting does not exist in the collection');
        }

        return this.collection[key];
    }

}