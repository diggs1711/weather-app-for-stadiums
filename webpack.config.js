module.exports = {
    entry: "./project/static/scripts/js/main.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.json$/,
            loader: "json-loader"
        }]
    }
};
