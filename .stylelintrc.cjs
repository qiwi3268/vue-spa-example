// eslint-disable-next-line filenames/match-regex
const config = require('stylelint-config');

module.exports = {
	...config, overrides:
		[
			{
				files: ['../src/**/*.vue'],
				customSyntax: 'postcss-html',
			},
			{
				files: ['../src/**/*.scss'],
				customSyntax: 'postcss-scss',
			}
		]
};
