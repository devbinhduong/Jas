const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    LodashPlugin = require('lodash-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    path = require('path'),
    webpack = require('webpack');

// Common configuration, with extensions in webpack.dev.js and webpack.prod.js.
module.exports = {
    bail: true,
    context: __dirname,
    entry: {
        main: './assets/js/app.js',
        head_async: ["./assets/js/skeleton-loader.js", 'lazysizes'],
        font: './assets/js/theme/common/font.js',
        polyfills: './assets/js/polyfills.js',
        polyfill_form_data: ['formdata-polyfill'],
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/, // Hỗ trợ cả CSS và SCSS
                use: [
                    MiniCssExtractPlugin.loader, // Extract CSS to separate files
                    'css-loader', // Xử lý CSS
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, './assets/config/postcss.config.js'),
                            },
                        },
                    },
                    'sass-loader', // Biên dịch SCSS sang CSS
                ],
            },

            {
                test: /\.js$/,
                include: /(assets\/js|assets\\js|stencil-utils)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-syntax-dynamic-import', // Hỗ trợ dynamic imports
                            'lodash', // Tree-shake lodash
                        ],
                        presets: [
                            ['@babel/preset-env', {
                                loose: true, // Enable "loose" transformations
                                modules: false, // Tree-shaking
                                useBuiltIns: 'entry',
                                corejs: '^3.6.5',
                            }],
                        ],
                    },
                },
            },
            {
                test: require.resolve("jquery"),
                loader: "expose-loader",
                options: {
                    exposes: ["$"],
                },
            },
        ],
    },
    output: {
        chunkFilename: 'theme-bundle.chunk.[name].js',
        filename: 'theme-bundle.[name].js',
        path: path.resolve(__dirname, 'assets/dist'),
    },
    performance: {
        hints: 'warning',
        maxAssetSize: 1024 * 300,
        maxEntrypointSize: 1024 * 300,
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['assets/dist'],
            verbose: false,
            watch: false,
        }),
        new MiniCssExtractPlugin({
            filename: 'theme-bundle.[name].css',
            chunkFilename: 'theme-bundle.chunk.[name].css',
        }),
        new LodashPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
        }),
    ],
    resolve: {
        fallback: { "url": require.resolve("url/") },
        alias: {
            jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
            jstree: path.resolve(__dirname, 'node_modules/jstree/dist/jstree.min.js'),
            lazysizes: path.resolve(__dirname, 'node_modules/lazysizes/lazysizes.min.js'),
            'slick-carousel': path.resolve(__dirname, 'node_modules/slick-carousel/slick/slick.min.js'),
            'svg-injector': path.resolve(__dirname, 'node_modules/svg-injector/dist/svg-injector.min.js'),
            gsap: path.resolve(__dirname, 'node_modules/gsap/dist/gsap.min.js'),
        },
    },
};
