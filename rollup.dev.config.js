import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete'
import babel from '@rollup/plugin-babel';
import manifestJson from "rollup-plugin-manifest-json";
const { injectManifest } = require('rollup-plugin-workbox');

export default {
    input: ['src/js/main.js', 'src/js/nests.js'],
    output: {
        dir: 'public',
        format: 'cjs',
        sourcemap: true
    },
    treeshake: true,
    plugins: [
        del({targets: 'public/*'}),
        resolve({
            main: true,
            browser: true,
            preferBuiltins: true
        }),
        commonjs(),
        babel({babelHelpers: 'bundled'}),
        postcss({
            preprocessor: (content, id) => new Promise((resolve, reject) => {
                const result = sass.renderSync({ file: id })
                resolve({ code: result.css.toString() })
            }),
            plugins: [
                autoprefixer
            ],
            sourcemap: true,
            extract: 'styles.css',
            extensions: ['.scss','.css']
        }),
        copy({
            targets: [
                { src: 'src/images/icons/*', dest: 'public/icons' }
            ]
        }),
        injectManifest({
            swSrc: 'src/js/sw.js',
            swDest: 'public/sw.js',
            globDirectory: 'public/',
        }, ({ swDest, count, size }) => {
            console.log(`${swDest} Generated`);
            console.log(`The service worker will precache ${count} URLs, totaling ${size}`);
        }),
        manifestJson({
            input: "src/manifest.json", // Required
            minify: false
        })
    ]
}
