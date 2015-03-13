/**
 * @author Bas Tuijnman
 */

var ioc = require('../../utilities/ioc.js'),
    utils = require('../../utilities/utils.js');

module.exports = {

    settings: function (key, value) {
        var settings = ioc.resolve('settings');
        settings.set(key, value);
    },

    go: function (action) {
        var settings = ioc.resolve('settings'),
            map = ioc.resolve('map'),
            io = ioc.resolve('io');

        if (action === 'place_armies') {
            var soliers = parseInt(settings.get('starting_armies'), 10),
                cmd = '';

            for (var region in map.regions) {
                if (map.regions[region].owned) {
                    io.write(settings.get('your_bot') + ' place_armies ' + map.regions[region].name + ' ' + soldiers);
                    return;
                }
            }
        }

        if (action === 'attack/transfer') {
            io.write('No moves');
        }
    },

    pickStartingRegion: function () {
        var io = ioc.resolve('io'),
            map = ioc.resolve('map'),
            regions = map.regions,
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
            }).shift();

        io.write(best.name);
    },

    setupMap: function () {
        var args = Array.prototype.slice.call(arguments, 0),
            method = utils.camelCase('setup_' + args.shift()),
            map = ioc.resolve('map');

        map[method].apply(map, args);
    },

    updateMap: function () {
        var args = Array.prototype.slice.call(arguments, 0),
            count = args / 3,
            map = ioc.resolve('map'),
            settings = ioc.resolve('settings'),
            i = 0,
            region;

        for (; i < count; i++) {
            region = map.getRegion(args[i * 3]);
            if (region) {
                region.troops = args[(i * 3) + 2];
                region.owned = args[[i * 3] + 1] === settings.get('your_bot');
            }
        }
    }

};