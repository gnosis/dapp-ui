import HtmlWebPackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import DashboardPlugin from 'webpack-dashboard/plugin'
import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

const isProduction = process.env.NODE_ENV == 'production'
const baseUrl = isProduction && process.env.CI ? '/when-hosting-not-at-root/' : '/'

module.exports = ({ stats = false } = {}) => ({
    devtool: 'eval-source-map',
    output: {
        path: __dirname + '/dist',
        chunkFilename: isProduction ? '[name].[chunkhash:4].js' : '[name].js',
        filename: isProduction ? '[name].[chunkhash:4].js' : '[name].js',
        publicPath: baseUrl,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { cacheDirectory: true },
                },
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { cacheDirectory: true },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            // disable type checker - we will use it in fork plugin
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        historyApiFallback: true,
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
        modules: ['node_modules', 'src'],
        extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/html/index.html',
            title: 'apollo-ts-react',
        }),
        isProduction && new InlineChunkHtmlPlugin(HtmlWebPackPlugin, [/runtime/]),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            BASE_URL: baseUrl,
        }),
        new ForkTsCheckerWebpackPlugin({ silent: stats }),
        isProduction && new DashboardPlugin(),
    ].filter(Boolean),
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: true,
    },
})
