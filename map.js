var setup = require('./map/setup.js'),
    utils = require('./utilities/utils.js');

module.exports = utils.mixin({

    continents: [],
    regions: [],

    getSuperRegion: function (name) {
        var continents = this.continents,
            length = continents.length,
            i = 0;

        for(; i < length; i++) {
            if(continents[i].name === name) {
                return continents[i];
            }
        }

        return false;
    },

    getRegion: function (name) {
        var regions = this.regions,
            length = regions.length,
            i = 0;

        for(; i < length; i++) {
            if(regions[i].name === name) {
                return regions[i];
            }
        }

        return false;
    },

    getOwnedRegions: function () {
        var regions = this.regions;
        return regions.filter(function (region) {
            return region.owned;
        });
    },

    getHomeRegion: function () {
        var regions = this.getOwnedRegions(),
            region;

        for (region in regions) {
            if (regions[region].home) {
                return regions[region];
            }
        }

        return false;
    }

}, setup);