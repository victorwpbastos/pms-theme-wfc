let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let portfinder = require('portfinder');
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

portfinder.basePort = 3000;

module.exports = portfinder.getPortPromise().then(port => {
	return {
		entry: path.resolve(__dirname, '../application/main.js'),

		output: {
			path: path.resolve(__dirname, '../dist'),
			filename: '[name].js',
			chunkFilename: '[name].js'
		},

		module: {
			rules: [
				{
					test: /\.vue$/i,
					loader: 'vue-loader',
					options: {
						loaders: {
							js: 'babel-loader?cacheDirectory=true',
							less: 'vue-style-loader!css-loader!less-loader'
						}
					}
				},
				{
					test: /\.js$/i,
					loader: 'babel-loader',
					exclude: /node_modules/,
					options: {
						cacheDirectory: true
					}
				},
				{
					test: /\.less$/i,
					use: [
						{ loader: 'style-loader' },
						{ loader: 'css-loader' },
						{ loader: 'less-loader'	}
					]
				},
				{
					test: /\.css$/i,
					use: [
						{ loader: 'style-loader' },
						{ loader: 'css-loader' }
					]
				},
				{
					test: /\.(eot|woff2?|ttf|svg|png|jpg|gif|bmp)(\?.*)*$/i,
					loader: 'file-loader',
					options: {
						name: 'assets/img/[name].[ext]'
					}
				}
			]
		},

		resolve: {
			modules: [
				path.resolve(__dirname, '../'),
				path.resolve(__dirname, '../application'),
				path.resolve(__dirname, '../node_modules')
			],

			extensions: ['.js', '.vue']
		},

		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin(),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'application',
				children: true,
				minChunks: 2
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'libs',
				minChunks({ context }) {
					return context && context.indexOf('node_modules') >= 0;
				}
			}),
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: 'index.html',
				favicon: 'favicon.ico'
			}),
			new FriendlyErrorsPlugin({
				compilationSuccessInfo: {
					messages: [`Your application is running here: http://localhost:${port}`]
				}
			})
		],

		devtool: '#cheap-module-eval-source-map',

		devServer: {
			host: '0.0.0.0',
			port: port,
			hot: true,
			quiet: true,
			clientLogLevel: 'error',
			overlay: true,
			disableHostCheck: true,

			// uncomment the following lines to enable proxy
			proxy: {
				'/api': {
					target: 'https://api.sorocaba.sp.gov.br/pub-consulta/api',
					changeOrigin: true,
					pathRewrite: {'^/api' : ''},
					logLevel: 'error'
				}
			}
		},

		node: {
			setImmediate: false,
			dgram: 'empty',
			fs: 'empty',
			net: 'empty',
			tls: 'empty',
			child_process: 'empty'
		}
	};
});