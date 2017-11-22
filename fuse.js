const {
    FuseBox,
    HTMLPlugin,
    WebIndexPlugin,
    BabelPlugin,
    SassPlugin,
    CSSPlugin,
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
        BabelPlugin({
            // limit2project: false
        })
    ]
});

fuse.bundle('client/app')
    .watch('src/**')
    .hmr({reload : true})
    .instructions('> demo.js');

fuse.dev();

fuse.run();
