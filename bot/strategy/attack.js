const REGION_MIN_SOLIERS = 8;
const REGION_TRANSFER_NEEDS = 6;
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
            cmd = [],
            soldierPerRegion,
            soldierRemainder,
            regionRemaining,
            attentionRegions,
            attentionRegion,
            totalThreat,
            soldierPerThreatPoint;

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
            if (soldierPerRegion === 0) {
                soldierPerRegion = 1;
                regions = regions.slice(0, soldiers);
            }
            soldierRemainder = soldiers - (soldierPerRegion * regions.length);

            cmd = regions.map(function (region) {
                return util.format('%s place_armies %d %d', settings.get('your_bot'), region.name, soldierPerRegion);
            });
            /**
             * We have some troops left over, let's donate those to the region which needs
             * it the most.
             */
            regionRemaining = regions.sort(function (a, b) {
                if (a.troops < b.troops) {
                    return -1;
                }
                if (a.troops > b.troops) {
                    return 1;
                }
                return 0;
            }).shift();
            cmd.push(util.format('%s place_armies %d %d', settings.get('your_bot'), regionRemaining.name, soldierRemainder));
        }

        if (cmd.length === 0) {
            /**
             * There are no regions that need immediate strengthening, lets find which
             * regions have the most enemies surrounding them
             */
            attentionRegions = map.getOwnedRegions().map(function (region) {
                var neighbourValue = region.neighbors.map(function (neighbor) {
                    /**
                     * This neighbor is owned, and so it doesnt add count to the threat value
                     */
                    if (neighbor.owned) {
                        return 0;
                    }

                    /**
                     * Count troops twice, to make this attribute more important
                     */
                    return (neighbor.troops * 2) + (neighbor.parent ? neighbor.parent.bonus : 0);
                }).reduce(function (previous, current) {
                    return previous + current;
                });

                return {
                    name: region.name,
                    threat: neighbourValue + region.troops
                }
            });

            totalThreat = attentionRegions.reduce(function (previous, current) {
                if (typeof previous !== 'number') {
                    previous = parseInt(previous.threat);
                }
                return previous + parseInt(current.threat);
            });

            soldierPerThreatPoint = soldiers / totalThreat;
            soldierRemainder = soldiers;
            attentionRegions.map(function (region) {
                soldierRemainder -= Math.round(soldierPerThreatPoint * region.threat);
                cmd.push(util.format('%s place_armies %d %d', settings.get('your_bot'), region.name, Math.round(soldierPerThreatPoint * region.threat)));
            });

            if (soldierRemainder > 0) {
                attentionRegion = attentionRegions.sort(function (a, b) {
                    if (a.threat > b.threat) {
                        return -1;
                    }
                    if (a.threat < b.threat) {
                        return 1;
                    }
                    return 0;
                }).shift();
                cmd.push(util.format('%s place_armies %d %d', settings.get('your_bot'), attentionRegion.name, soldierRemainder));
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

        if (cmd.length === 0) {
            cmd = ['No moves'];
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