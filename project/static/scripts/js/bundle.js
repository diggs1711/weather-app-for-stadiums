/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

;(function() {
  var pubSub = {
    events: [],

    publish: function(eve, data) {
        this.events.map(function(e) {
          if(e.eve === eve) {
            e.fn.call(e.scope, data);
          }
        })
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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

;
(function() {
    var pubSub = __webpack_require__(0);

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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

;
(function() {
    var pubSub = __webpack_require__(0);
    var stadiums = __webpack_require__(1);

    var app = {
        pubSub: pubSub,
        stadiums: stadiums,
        stadiumList: null,
        loadingEle: null,
        inputSearchString: null,
        searchString: "",

        run: function() {
            this.init();
            this.stadiums.fetchStadiums();
        },
        // sets initial state
        init: function() {
            this.initEle();
            this.initEvents();
        },

        initEle: function() {
            this.stadiumList = document.querySelector('.stadium-list');
            this.loadingEle = document.querySelector('.loading');
            this.inputSearchString = document.querySelector('.searchString');
        },

        initEvents: function() {
            this.inputSearchString.addEventListener("change", function(e) {
                console.log(e);
                this.searchString = e.target.value;
            })
        },

        // sets state, triggers render method
        handleChange: function(event) {

        },

        filterCities: function() {

        },

        render: function(data) {
            var self = this;
            var stadiums = data["stadiums"];
            this.loadingEle.classList.add("hidden");
            var searchString = this.searchString.trim().toLowerCase();

            // filter countries list by value from input boxz
            if (searchString.length > 0) {
                stadiums = stadiums.filter(function(stadium) {
                    return stadium.city.toLowerCase().match(searchString);
                });
            }

            stadiums.map(function(stadium) {
                var r = self.createWeatherInfoElement(stadium);
                this.stadium - self.stadiumList.appendChild(r);
            });

        },

        createWeatherInfoElement: function(s) {
            var result = document.createElement("tr");

            for (var property in s) {
                if (s.hasOwnProperty(property)) {
                    var p = document.createElement("td");
                    p.innerText = s[property];
                    result.appendChild(p);
                }
            }

            return result;
        },

        loadingElement: function() {
            this.loadingEle.classList.remove("hidden");
        }

    };

    pubSub.subscribe("stadiumsLoaded", app.render, app);
    pubSub.subscribe("loadingStadiums", app.loadingElement, app);
    app.run();
})();


/***/ })
/******/ ]);