const {merge} = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
	target: 'browserslist',
	mode: 'production',
	devtool: false,
	output: {
		filename: 'js/[name].js',
		publicPath: '',
	},
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../',
						},
					},
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
							sassOptions: {
								outputStyle: 'expanded',
								indentType: 'tab',
								indentWidth: 1,
							},
							sourceMap: true,
							additionalData: '@use "sass:math";\n@import "/css/env";\n',
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name].css',
			chunkFilename: '[id].css',
		}),
		new ImageMinimizerPlugin({
			test: /\.(jpe?g|png|gif|svg)$/i,
			minimizerOptions: {
				plugins: [
					[
						'gifsicle',
						{interlaced: true},
					],
					[
						'mozjpeg',
						{
							progressive: true,
							quality: 85,
						},
					],
					[
						'optipng',
						{optimizationLevel: 5},
					],
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
	optimization: {
		minimize: true,
		minimizer: [new CssMinimizerPlugin(), '...'],
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
					enforce: true,
				},
			},
		},
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
});
