;
(function() {
    'use strict';
    
    var pubSub = require('./pubSub.js');

    var stadiums = {
        pubSub: pubSub,
        init: function() {

        },

        stadiums: {

        },

        getStadiums: function() {
            return this.stadiums;
        },

        fetchStadiums: function() {
            pubSub.publish("loadingStadiums", "");

            $.ajax({
                url: 'stadiums.json',
                dataType: 'json',
                success: function(data) {
                    stadiums = data;
                    pubSub.publish("stadiumsLoaded", data);
                }.bind(this),
                error: function(xhr, status, error) {
                    console.log('An error (' + status + ') occured:', error.toString());
                }.bind(this)
            });

        },
    };

    module.exports = stadiums;
})();
