import fs from 'fs';

export default function rollupPluginAssetsManifest() {
	return {
		name: 'rollup-plugin-assets-manifest',
		writeBundle(options, bundle) {
			const jsAsset = Object.keys(bundle).find(key => /\.js$/i.test(key));

			if (jsAsset) {
				fs.writeFileSync('./dist/config.json', JSON.stringify({ src: jsAsset }));
			}
		},
	};
}
