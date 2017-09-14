let webpack = require('webpack');
let path = require('path');
let JsDocPlugin = require('jsdoc-webpack-plugin');

module.exports = options => {
    return {
        plugins: [
            new JsDocPlugin({
                conf: './jsdoc.conf'
            })
        ]
    }
}