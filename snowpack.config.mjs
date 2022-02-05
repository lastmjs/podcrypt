export default {
    exclude: ['**/.dfx/**/*'],
    optimize: {
        bundle: true,
        // minify: true, // TODO minification does not work for some reason, pc-app never renders
    //     // target: 'es2015'
    }
};