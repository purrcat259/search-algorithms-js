const {
    FuseBox,
    HTMLPlugin,
    WebIndexPlugin,
    BabelPlugin,
    SassPlugin,
    CSSPlugin,
    QuantumPlugin
} = require("fuse-box");

const fuse = FuseBox.init({
    homeDir: 'src',
    output: 'dist/$name.js',
    useTypescriptCompiler: true,
    sourceMaps: true,
    target: 'browser',
    plugins: [
        WebIndexPlugin({
            template: './src/vacuum-world.html'
        }),
        [SassPlugin(), CSSPlugin()],
        BabelPlugin(),
        QuantumPlugin({
            target: 'browser',
            bakeApiIntoBundle : 'client/app',
            containedAPI : true,
            treeshake : true,
            uglify : true
        })
    ]
});

fuse.bundle('client/app')
    .instructions('> demo.js');

fuse.run();
