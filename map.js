module.exports = {

    continents: [],
    regions: [],

    setupSuperRegions: function () {
        var regions = Array.prototype.slice.call(arguments, 0),
            count = regions.length / 2,
            i = 0;

        for(; i < count; i++) {
            this.continents.push({
                id: i,
                bonus: parseInt(regions[(i * 2) + 1], 10),
                name: regions[i * 2],
                regions: []
            });
        }
    },

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

    setupRegions: function () {
        var regions = Array.prototype.slice.call(arguments, 0),
            count = regions.length / 2,
            i = 0,
            region,
            superRegion

        for(; i < count; i++) {
            superRegion = this.getSuperRegion(regions[(i * 2) + 1]);
            region = {
                name: regions[i * 2],
                troops: 0,
                neighbors: [],
                wasteland: false,
                owned: false,
                opponent: false,
                parent: superRegion
            }

            if(superRegion) {
                superRegion.regions.push(region);
            }
            this.regions.push(region);
        }
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

    setupNeighbors: function () {
        var neighbors = Array.prototype.slice.call(arguments, 0),
            count = neighbors.length / 2,
            i = 0,
            region,
            regionNeighbor,
            regionNeighbors;

        for(; i < count; i++) {
            region = this.getRegion(neighbors[i * 2]);
            if(region) {
                regionNeighbors = neighbors[(i * 2) + 1].split(',');
                for(regionNeighbor in regionNeighbors) {
                    region.neighbors.push(this.getRegion(regionNeighbors[regionNeighbor]));
                }
            }
        }
    },

    setupWastelands: function () {
        var wastelands = Array.prototype.slice.call(arguments, 0),
            wasteland,
            region;

        for(wasteland in wastelands) {
            region = this.getRegion(wastelands[wasteland]);
            region.wasteland = true;
        }
    },

    setupOpponentStartingRegions: function () {
        var regions = Array.prototype.slice.call(arguments, 0),
            region,
            opponentRegion;
        for(region in regions) {
            opponentRegion = this.getRegion(regions[region]);
            if(opponentRegion) {
                opponentRegion.opponent = true;
            }
        }
    }

};