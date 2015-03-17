const REGION_MIN_SOLIERS = 8;
const REGION_TRANSFER_NEEDS = 5;
const REGION_TRANSFER_VALUE = 0.3;

var ioc = require('../../utilities/ioc'),
    util = require('util');

module.exports = {

    place: function () {
        var settings = ioc.resolve('settings'),
            map = ioc.resolve('map'),
            soldiers = parseInt(settings.get('starting_armies'), 10),
            regions = map.getOwnedRegions().filter(function (region) {
                return region.troops < REGION_MIN_SOLIERS;
            }),
            home = map.getHomeRegion(),
            soldierPerRegion,
            soldierRemainder,
            cmd;

        /**
         * IDEA
         * - get all regions that my bot owns
         * - resolve which regions don't have enough strenght available
         * - devide all available soldiers over that region
         */
        if (regions.length > 0) {
            /**
             * Calculate the number of soldiers we initialy place on the regions which
             * need it. We also have a remainder which we will place on our home region.
             */
            soldierPerRegion = Math.floor(soldiers / regions.length);
            if(soldierPerRegion === 0) {
                soldierPerRegion = 1;
                regions = regions.slice(0, soldiers);
            }
            soldierRemainder = soldiers - (soldierPerRegion * regions.length);

            cmd = regions.map(function (region) {
                return util.format('%s place_armies %d %d', settings.get('your_bot'), region.name, soldierPerRegion);
            });

            if (home) {
                cmd.push(util.format('%s place_armies %d %d', settings.get('your_bot'), home.name, soldierRemainder));
            }
        }

        process.stdout.write(cmd.join(', ') + '\n');
    },

    transfer: function () {
        var settings = ioc.resolve('settings'),
            map = ioc.resolve('map'),
            regions = map.getOwnedRegions().filter(function (region) {
                return region.troops > REGION_TRANSFER_NEEDS;
            }),
            region,
            neighbors,
            neighbor,
            cmd = [];

        for (region in regions) {
            neighbors = regions[region].neighbors;
            for (neighbor in neighbors) {
                if (this.isAttackable(regions[region], neighbors[neighbor])) {
                    cmd.push(util.format(
                        '%s attack/transfer %d %d %d',
                        settings.get('your_bot'),
                        regions[region].name,
                        neighbors[neighbor].name,
                        Math.floor(regions[region].troops * REGION_TRANSFER_VALUE)
                    ));
                    break;
                }
            }
        }

        process.stdout.write(cmd.join(', ') + '\n');
    },

    isAttackable: function (source, target) {
        if (target.owned === false && source.troops > target.troops) {
            return true;
        }
        return false;
    }

}