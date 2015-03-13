/**
 * @author Bas Tuijnman
 */

var bot,
    instance,
    readline = require('readline'),
    ioc = require('./utilities/ioc.js'),
    utils = require('./utilities/utils.js'),
    settings = require('./bot/settings.js'),
    commands = require('./bot/input/commands.js'),
    map = require('./map.js');
/**
 * Base bot function
 */
bot = function () {
    return {

        _onLineReceivedBound: null,

        run: function () {
            var io = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            ioc.bind('settings', settings);
            ioc.bind('map', map);
            ioc.bind('io', io);

            this._onLineReceivedBound = this._onLineReceived.bind(this);

            io.on('line', this._onLineReceivedBound);
        },

        _onLineReceived: function (data) {
            if(!data.length) {
                console.warn('Input received, but no data is set');
                return;
            }

            var lines = data.split('\n'),
                line,
                parts,
                cmd;

            for (line in lines) {
                parts = lines[line].split(' ');

                if(parts.length > 0) {
                    cmd = utils.camelCase(parts.shift());
                    if(typeof commands[cmd] !== 'undefined') {
                        commands[cmd].apply(this, parts);
                    } else {
                        console.warn('command send, but not found in available bot commands');
                    }
                }
            }

        }

    };
};

var instance = bot();
instance.run();