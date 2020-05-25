import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import copy from 'rollup-plugin-copy'

export default {
    input: 'src/js/main.js',
    output: {
        file: 'dist/scripts/main.js',
        format: 'iife',
        name: 'bundle',
    },
    plugins: [
        resolve ( {
            main: true,
            browser: true
        } ),
        commonjs (),
        scss ( {
                output: 'dist/styles/main.css'
            }
        ),
        copy({
            targets: [
                { src: 'src/html/index.html', dest: 'dist' }
            ]
        })
    ]
}