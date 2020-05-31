import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import copy from 'rollup-plugin-copy'
import dev from 'rollup-plugin-dev'
import progress from 'rollup-plugin-progress'

export default {
    input: 'src/js/main.js',
    output: {
        file: 'scripts/main.js',
        format: 'iife',
        name: 'bundle',
    },
    plugins: [
        progress({
            clearLine: false // default: true
        }),
        resolve ( {
            main: true,
            browser: true
        } ),
        commonjs (),
        scss ( {
                output: 'styles/main.css'
            }
        ),
        copy({
            targets: [
                { src: 'src/html/index.html', dest: './' }
            ]
        }),
        dev()
    ]
}