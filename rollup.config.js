import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import postcss from 'rollup-plugin-postcss'
import del from 'rollup-plugin-delete'
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
const { generateSW } = require('rollup-plugin-workbox');
import manifestJson from "rollup-plugin-manifest-json";

export default {
    input: ['src/js/main.js', 'src/js/tree.js'],
    output: {
        dir: 'public',
        format: 'cjs',
    },
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
