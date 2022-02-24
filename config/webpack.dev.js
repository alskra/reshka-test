const path = require('path');
const {merge} = require('webpack-merge');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const paths = require('./paths');
const common = require('./webpack.common');

module.exports = merge(common, {
	target: 'web',
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		'historyApiFallback': true,
		'static': [
			paths.build,
			{
				directory: paths.src,
				watch: false,
			},
		],
		'open': true,
		'compress': true,
		'hot': true,
		'port': 8080,
		'watchFiles': path.resolve(paths.src, '**/*.pug'),
	},
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 3,
						},
					},
					'postcss-loader',
					'resolve-url-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							additionalData: '@use "sass:math";\n@import "/css/env";\n',
						},
					},
				],
			},
		],
	},
	plugins: [
		new ImageMinimizerPlugin({
			test: /\.svg$/i,
			minimizerOptions: {
				plugins: [
					[
						'svgo',
						{
							plugins: [
								{
									name: 'preset-default',
									params: {
										overrides: {
											removeUnknownsAndDefaults: false,
											removeViewBox: false,
											cleanupIDs: {
												prefix: {
													toString() {
														this.counter = this.counter || 0;

														return `id-${this.counter++}`;
													},
												},
											},
										},
									},
								},
								'removeDimensions',
								'sortAttrs',
							],
						},
					],
				],
			},
		}),
	],
});
