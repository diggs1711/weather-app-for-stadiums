;
(function() {
        var pubSub = require('./pubSub.js');
        var stadiums = require('./stadiums.js');
        
        var app = {
            pubSub: pubSub,
            stadiums: stadiums,
            stadiumList: null,

            run: function() {
                this.init();
                this.stadiums.fetchStadiums();
            },
            // sets initial state
            init: function() {
                this.initEle();
            },

            initEle: function() {
                this.stadiumList = document.querySelector('.stadium-list');
            },

            // sets state, triggers render method
            handleChange: function(event) {

            },

            render: function(data) {
                var countries = data;
                var stadiums = countries["stadiums"];
                /*var searchString = this.state.searchString.trim().toLowerCase();

            // filter countries list by value from input boxz
            if (searchString.length > 0) {
                stadiums = stadiums.filter(function(stadium) {
                    return stadium.city.toLowerCase().match(searchString);
                });
            }
*/
                var self = this;

                stadiums.map(function(stadium) {
                    var e = document.createElement("li");
                    e.innerText = stadium.city;
                    this.stadium - self.stadiumList.appendChild(e);
                })

        }

    };

    pubSub.subscribe("stadiumsLoaded", app.render, app);
    app.run();
})();
