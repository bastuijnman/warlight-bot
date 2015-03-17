var defending = require('./strategy/defend.js'),
    attacking = require('./strategy/attack.js'),
    ioc = require('../utilities/ioc.js');

module.exports = {

    getStrategy: function () {
        return attacking;
    }

};