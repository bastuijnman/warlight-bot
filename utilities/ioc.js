var ioc = function () {
        return {
            container: {},

            bind: function (interface, implementation) {
                this.container[interface] = implementation;
            },

            resolve: function (interface) {
                if(typeof this.container[interface] === 'undefined') {
                    /**
                     * TODO: automatic resolve here
                     */
                    throw new Error('there is no implementation bound to this interface');
                }

                return this.container[interface];
            }
        }
    },
    instance;

if(typeof instance === 'undefined') {
    instance = new ioc();
}
module.exports = instance;