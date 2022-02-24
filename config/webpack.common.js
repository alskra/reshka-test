const fs = require('fs');
const path = require('path');
const svgToMiniDataURI = require('mini-svg-data-uri');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const paths = require('./paths');

const pages = fs.readdirSync(path.resolve(paths.src, 'pages'))
	.filter((item) => item !== 'ajax');
const ajax = fs.readdirSync(path.resolve(paths.src, 'pages/ajax'));
const entry = {};

// pages.forEach((page) => {
// 	entry[page] = path.resolve(paths.src, `pages/${page}/${page}.js`);
// });

entry.main = pages.map((page) => path.resolve(paths.src, `pages/${page}/${page}.js`))
	.concat(path.resolve(paths.src, 'components/app/app.js'));

const htmlPluginEntries = pages.map((page) => {
	return new HtmlWebpackPlugin({
		template: path.resolve(paths.src, `pages/${page}/${page}.pug`),
		filename: `${page}.html`,
		title: 'Webpack Starter',
		// chunks: [page],
		minify: false,
	});
});

const htmlPluginEntriesAjax = ajax.map((item) => {
	return new HtmlWebpackPlugin({
		template: path.resolve(paths.src, `pages/ajax/${item}`),
		filename: `ajax/${path.basename(item, '.pug')}.html`,
		minify: false,
		inject: false,
	});
});

module.exports = {
	context: paths.src,
	entry,
	output: {
		filename: 'js/[name].js',
		path: paths.build,
		publicPath: '/',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: false,
						},
					},
					{
						loader: 'pug-plain-loader',
						options: {
							root: paths.src,
							pretty: '\t',
						},
					},
				],
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.(jpe?g|png|gif|webp)$/i,
				type: 'asset',
				generator: {
					filename: '[path][name][ext][query]',
				},
				parser: {
					dataUrlCondition: {
						maxSize: 4 * 1024,
					},
				},
			},
			{
				test: /\.svg/,
				resourceQuery: {not: [/raw/]},
				type: 'asset',
				generator: {
					filename: '[path][name][ext][query]',
					dataUrl: (content) => svgToMiniDataURI(content.toString()),
				},
				parser: {
					dataUrlCondition: {
						maxSize: 4 * 1024,
					},
				},
			},
			{
				test: /\.(woff2?|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: '[path][name][ext][query]',
				},
			},
			{
				resourceQuery: /raw/,
				type: 'asset/source',
			},
		],
	},
	plugins: [
		...htmlPluginEntries,
		...htmlPluginEntriesAjax,
		new CopyWebpackPlugin({
			patterns: [
				{
					from: paths.public,
					to: '',
					globOptions: {
						ignore: [
							'**/.gitkeep',
							'**/.DS_Store',
						],
					},
					noErrorOnMissing: true,
				},
			],
		}),
		new StylelintPlugin({
			files: '**/*.?(s)css',
		}),
		new ESLintPlugin({
			files: '.',
			formatter: 'table',
		}),
	],
	resolve: {
		// modules: [paths.src, 'node_modules'],
		extensions: ['.js', '.jsx', '.json'],
		alias: {
			'@': paths.src,
		},
	},
};
