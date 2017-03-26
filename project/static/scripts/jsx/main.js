;
(function() {

    var stadiumController = {

        init: function() {

        },

        stadiums: {

        },

        getStadiums: function() {
            return this.stadiums;
        },

        fetchStadiums: function() {
            $.ajax({
                url: 'stadiums.json',
                dataType: 'json',
                success: function(data) {
                    console.log("success");

                    stadiums = data;
                    return data;
                }.bind(this),
                error: function(xhr, status, error) {
                    console.log('An error (' + status + ') occured:', error.toString());
                }.bind(this)
            });
        },
    };

    var app = {

       	stadium: stadiumController,

        // sets initial state
        init: function() {
            return {
                searchString: ''
            };
        },

        // sets state, triggers render method
        handleChange: function(event) {
            // grab value form input box
            this.setState({
                searchString: event.target.value
            });
            console.log("scope updated!");
        },

        render: function() {
            var countries = this.props.items;
            var stadiums = countries["stadiums"];
            var searchString = this.state.searchString.trim().toLowerCase();

            // filter countries list by value from input boxz
            if (searchString.length > 0) {
                stadiums = stadiums.filter(function(stadium) {
                    return stadium.city.toLowerCase().match(searchString);
                });
            }

            return (
                
            )
        }

    };

    stadiums.fetchStadiums();
})();
