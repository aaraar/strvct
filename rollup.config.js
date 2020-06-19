import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete'
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import manifestJson from "rollup-plugin-manifest-json";
const { generateSW } = require('rollup-plugin-workbox');

export default {
    input: ['src/js/main.js', 'src/js/tree.js', 'src/js/options.js'],
    output: {
        dir: 'public',
        format: 'cjs',
        sourcemap: true,
    },
    treeshake: true,
    plugins: [
        del({targets: 'public/*'}),
        babel({ babelHelpers: 'bundled' }),
        resolve({
            main: true,
            browser: true
        }),
        commonjs(),
        terser(),
        postcss({
            preprocessor: (content, id) => new Promise((resolve, reject) => {
                const result = sass.renderSync({ file: id })
                resolve({ code: result.css.toString() })
            }),
            plugins: [
                autoprefixer,
                cssnano
            ],
            sourceMap: true,
            extract: 'styles.css',
            extensions: ['.scss','.css']
        }),
        copy({
            targets: [
                { src: 'src/images/icons/*', dest: 'public/icons' }
            ]
        }),
        generateSW({
            swDest: 'public/sw.js',
            globDirectory: 'public/',
        }),
        manifestJson({
            input: "src/manifest.json", // Required
            minify: true
        })
    ]
}
