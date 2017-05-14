;
(function() {
    'use strict';

    var pubSub = {
        events: [],

        publish: function(eve, data) {
            this.events.map(function(e) {
                if (e.eve === eve) {
                    e.fn.call(e.scope, data);
                }
            });
        },

        subscribe: function(eve, fn, scope) {

            this.events.push({
                eve: eve,
                fn: fn,
                scope: scope
            });

        }
    };

    module.exports = pubSub;
})();
