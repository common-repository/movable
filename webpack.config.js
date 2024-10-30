const path = require( 'path' );
const webpack = require( 'webpack' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const isProduction = process.env.NODE_ENV === 'production';

/* Plugins */
// Compile block frontend and editor scss files into css files.
// Need to use ExtractTextPlugin in development b/c default WordPress webpack config uses splitChunks and cacheGroups which breaks HMR
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const extractStyles = new ExtractTextPlugin( './style-index.css' );
const extractEditorStyles = new ExtractTextPlugin( './index.css' );

const defaultPlugins = defaultConfig.plugins
	.map( ( plugin ) => {
		const name = plugin.constructor.name;

		// Remove LiveReloadPlugin if in development mode b/c using browsersync + HMR
		if ( name.includes( 'LiveReloadPlugin' ) ) {
			return false;
		}
		// Remove CleanWebpackPlugin b/c it removes css framework files
		if ( name.includes( 'CleanWebpackPlugin' ) ) {
			return false;
		}

		return plugin;
	} )
	.filter( ( plugin ) => plugin );

// In development remove default webpack .scss rules so we can build index.css & style-index.css files using ExtractTextPlugin and not break HMR.
Object.keys( defaultConfig.module.rules ).map( ( rule ) => {
	const test = defaultConfig.module.rules[ rule ].test;

	if ( test.test( '.scss' ) ) {
		defaultConfig.module.rules[ rule ] = {};
	}
} );

const config = {
	...defaultConfig,
	mode: isProduction ? 'production' : 'development',
	devtool: 'source-map',
	entry: {
		index: isProduction
			? [ path.resolve( process.cwd(), `src/index.js` ) ]
			: [
					path.resolve( process.cwd(), `./src/index.js` ),
					'webpack-hot-middleware/client?name=index&timeout=20000&reload=true&overlay=true',
			  ],
	},
	output: isProduction
		? {
				path: path.resolve( process.cwd(), `./build` ),
				filename: '[name].js',
		  }
		: {
				publicPath: `/build/`,
				path: path.resolve( process.cwd(), `./build` ),
				filename: '[name].js',
		  },
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			isProduction
			? {
				test: /style\.(sa|sc|c)ss$/,
				use: extractStyles.extract( {
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
								prependData: '@import "./src/assets/scss/common.scss";\n',
							},
						},
					],
				} ),
			}
			: {
					test: /style\.(sa|sc|c)ss$/,
					use: extractStyles.extract( {
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
							},
							{
								loader: 'sass-loader',
								options: {
									sourceMap: true,
									prependData: '@import "./src/assets/scss/common.scss";\n',
								},
							},
						],
					} ),
				},
				isProduction
				? {
					test: /editor\.(sa|sc|c)ss$/,
					use: extractEditorStyles.extract( {
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
							},
							{
								loader: 'sass-loader',
								options: {
									sourceMap: false,
								},
							},
						],
					} ),
				}
				: {
					test: /editor\.(sa|sc|c)ss$/,
					use: extractEditorStyles.extract( {
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
							},
							{
								loader: 'sass-loader',
								options: {
									sourceMap: false,
								},
							},
						],
					} ),
				},
		],
	},
	optimization: {
		...defaultConfig.optimization,
	},
	plugins: isProduction
		? [
				...defaultPlugins,
				extractStyles,
				extractEditorStyles,
			]
		: [
				...defaultPlugins,
				extractStyles,
				extractEditorStyles,
				new webpack.HotModuleReplacementPlugin(),
		  ],
};

module.exports = config;
