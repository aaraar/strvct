import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'

export default {
    input: ['src/js/main.js', 'src/js/tree.js'],
    output: {
        dir: 'public/scripts',
        format: 'cjs',
    },
    plugins: [
        resolve({
            main: true,
            browser: true
        }),
        commonjs(),
        scss({
                output: 'public/styles/styles.css'
            }
        ),
    ]
}
