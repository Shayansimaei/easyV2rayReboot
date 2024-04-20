'use strict';

var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './init.ts',
    output: {
        filename: 'index.cjs', // <-- Important
        libraryTarget: 'this' // <-- Important
    },
    target: 'node21', // <-- Important
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ]
    },
    externals: [nodeExternals()] // <-- Important
};