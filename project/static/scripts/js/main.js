;
(function() {
    var DynamicSearch = React.createClass({
        displayName: "DynamicSearch",

        // sets initial state
        getInitialState: function() {
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
                React.createElement("div", null,
                    React.createElement("input", {
                        type: "text",
                        value: this.state.searchString,
                        onChange: this.handleChange,
                        placeholder: "Search!"
                    }),
                    React.createElement("ul", null,
                        stadiums.map(function(stadium) {
                            return React.createElement("li", null, stadium.city, " ")
                        })
                    )
                )
            )
        }

    });

    // list of countries, defined with JavaScript object literals
    var stadiums = {

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
                    console.log("success")

                    ReactDOM.render(
                        React.createElement(DynamicSearch, {
                            items: data
                        }),
                        document.getElementById('main')
                    );

                    stadiums = data;
                }.bind(this),
                error: function(xhr, status, error) {
                    console.log('An error (' + status + ') occured:', error.toString());
                }.bind(this)
            });
        },
    };

    stadiums.fetchStadiums();
})();
