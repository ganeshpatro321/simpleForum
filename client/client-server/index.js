require('ignore-styles')

require('@babel/register')({
    ignore: [/(node_modules)/],
    presets: [['@babel/preset-env', {
        targets: {
            esmodules: true,
        }
    }], '@babel/preset-react'],
    plugins: ["@babel/transform-runtime"]
})

require('./client-server')