var path = require('path');
module.exports = {
    context: path.resolve(__dirname, 'es6'),
    entry: {
        index: './RootState.js',
        main: './main.js',
        // vimeoActions: './VimeoActions.js',
        // mediaAnalytics: './MediaAnalytics.js'
    },
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}
