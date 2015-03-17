/**
 * @author Bas Tuijnman
 */

var ioc = require('../../utilities/ioc.js'),
    utils = require('../../utilities/utils.js'),
    strategyManager = require('../strategyManager.js');

module.exports = {

    settings: function (key, value) {
        var settings = ioc.resolve('settings');
        settings.set(key, value);
    },

    go: function (action) {
        var settings = ioc.resolve('settings'),
            map = ioc.resolve('map'),
            io = ioc.resolve('io'),
            strategy = strategyManager.getStrategy();

        if (action === 'place_armies') {
            strategy.place();
        }

        if (action === 'attack/transfer') {
            strategy.transfer();
        }
    },

    pickStartingRegion: function () {
        var io = ioc.resolve('io'),
            map = ioc.resolve('map'),
            regions = map.regions,
            allowedRegions = Array.prototype.slice.call(arguments, 1),
            best = regions.map(function (region) {
                var bonus = region.parent ? region.parent.bonus : 0;
                return {
                    name: region.name,
                    favour: (region.neighbors.length + bonus)
                }
            }).sort(function (a, b) {
                if (a.favour > b.favour) {
                    return -1;
                }
                if (a.favour < b.favour) {
                    return 1;
                }
                return 0;
            }),
            region,
            selectedRegion;

        for (region in best) {
            if (allowedRegions.indexOf(best[region].name) > -1) {
                process.stdout.write(best[region].name + '\n');

                /**
                 * Set properties
                 */
                selectedRegion = map.getRegion(best[region].name);
                selectedRegion.owned = true;
                selectedRegion.home = true;
                console.log(map.regions);
                return;
            }
        }

        process.stdout.write('\n');
    },

    setupMap: function () {
        var args = Array.prototype.slice.call(arguments, 0),
            method = utils.camelCase('setup_' + args.shift()),
            map = ioc.resolve('map');

        map[method].apply(map, args);
    },

    updateMap: function () {
        var args = Array.prototype.slice.call(arguments, 0),
            count = args.length / 3,
            map = ioc.resolve('map'),
            settings = ioc.resolve('settings'),
            i = 0,
            region;

        for (; i < count; i++) {
            region = map.getRegion(args[i * 3]);
            if (region) {
                region.troops = args[(i * 3) + 2];
                region.owned = args[(i * 3) + 1] === settings.get('your_bot');
            }
        }
    },

    opponentMoves: function () {
        //stub
    }

};