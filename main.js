module.exports = {
    collect: require('@turf/collect'),
    buffer: require('@turf/buffer'),
    
    module: {
        loaders: [
            { test: /\.json$/, loader: "json-loader" }
        ]
    }
};