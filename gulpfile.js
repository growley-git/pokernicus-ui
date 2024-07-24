'use strict'

const pkg = require('./package.json')
const path = require('path')
const fractal = require('@frctl/fractal').create()
const { Table } = require('console-table-printer')
const logger = fractal.cli.console

const { src, dest, watch, series, parallel } = require('gulp')
const copy = require('gulp-copy')
const sass = require('gulp-sass')(require('sass'))
const sassGlob = require('gulp-sass-glob')
const clean = require('gulp-clean')
const webpack = require('webpack-stream')
const sourcemaps = require('gulp-sourcemaps')
const mandelbrot = require('@frctl/mandelbrot')
const handlebars = require('@frctl/handlebars')({
    helpers: {
        for: (context, options) => {
            let ret = ''
            for (let index = 0; index < context; index++) {
                ret = ret + options.fn(context[index])
            }
            return ret
        },
        eval: (a, operator, b, options) => {
            switch (operator) {
                case '==':
                    return (a == b) ? options.fn(this) : options.inverse(this)
                case '===':
                    return (a === b) ? options.fn(this) : options.inverse(this)
                case '!=':
                    return (a != b) ? options.fn(this) : options.inverse(this)
                case '!==':
                    return (a !== b) ? options.fn(this) : options.inverse(this)
                case '<':
                    return (a < b) ? options.fn(this) : options.inverse(this)
                case '<=':
                    return (a <= b) ? options.fn(this) : options.inverse(this)
                case '>':
                    return (a > b) ? options.fn(this) : options.inverse(this)
                case '>=':
                    return (a >= b) ? options.fn(this) : options.inverse(this)
                case '&&':
                    return (a && b) ? options.fn(this) : options.inverse(this)
                case '||':
                    return (a || b) ? options.fn(this) : options.inverse(this)
                default:
                    return options.inverse(this)
            }
        },
        uppercase: (str) => {
            return str.toUpperCase()
        },
        kebabcase: (str) => {
            return str.replaceAll(' ', '-').toLowerCase()
        }
    }
})

fractal.set('project.title', 'Poker App UI')
fractal.set('project.author', pkg.author || '')
fractal.set('project.version', pkg.version)

fractal.web.set('static.path', path.join(__dirname, './public'))
fractal.web.set('builder.dest', path.join(__dirname, './dist'))
fractal.web.theme(mandelbrot({
    skin: {
        name: 'default',
        // links: '#446CC9',
        // accent: '#161F50',
        // complement: '#FFFFFF',
    },
    styles: ['default', '/css/mandelbrot.css'],
    // favicon: '/images/favicon.ico',
    information: [
        {
            label: 'Version',
            value: pkg.version
        },
        {
            label: 'Built On',
            value: new Date(),
            type: 'time',
            format: (value) => {
                return value.toLocaleDateString('en');
            },
        }
    ]
}))

fractal.docs.set('path', path.join(__dirname, './docs'))

fractal.components.set('label', 'Patterns')
fractal.components.set('path', path.join(__dirname, './source/patterns'))
fractal.components.set('statuses', {
    obsolete: {
        label: "Obsolete",
        description: "Do not implement!",
        color: "red"
    },
    prototype: {
        label: "Prototype",
        description: "Work in progress. Implement with caution!",
        color: "orange"
    },
    ready: {
        label: "Ready",
        description: "Ready to implement!",
        color: "green"
    }
})
fractal.components.set('default.context', {
    'siteName': 'FooCorp',
    'players': [
        // {
        //     firstName: '',
        //     lastName: '',
        //     email: '',
        //     dob: '',
        //     username: '',
        //     password: '',
        //     chips: 0
        // },
        {
            firstName: 'Sheldon',
            lastName: 'Allen',
            email: '',
            dob: '9/4/1974',
            username: 'shellen',
            password: 'massachusetts',
            chips: 14823
        },
        {
            firstName: 'John',
            lastName: 'Jackson',
            email: '',
            dob: '2/14/1986',
            username: 'johnnyb',
            password: 'zooyork',
            chips: 343852
        },
        {
            firstName: 'Steve',
            lastName: 'Dyer',
            email: '',
            dob: '11/28/1977',
            username: 'dyermaker',
            password: 'myverona',
            chips: 2732390
        },
        {
            firstName: 'Yoko',
            lastName: 'Terrill',
            email: '',
            dob: '11/1/1956',
            username: 'rllingstones',
            password: 'cutpiece',
            chips: 1238
        },
        {
            firstName: 'Donald',
            lastName: 'Flanagan',
            email: '',
            dob: '12/19/1962',
            username: 'flanneldon',
            password: 'checkeredboii',
            chips: 13088232
        },
    ]
});
fractal.components.set('default.status', 'prototype')
fractal.components.set('ext', '.nunj')
fractal.components.engine('@frctl/nunjucks')

const cleanPublic = function () {
    return src('./public', { allowEmpty: true, read: false })
        .pipe(clean())
}

const copyImages = function () {
    return src(['./source/assets/images/**/*'], { allowEmpty: true })
        .pipe(copy('./public/images', { prefix: 3 }))
}

const copyFonts = function () {
    return src('./source/assets/fonts/**/*', { allowEmpty: true })
        .pipe(copy('./public/fonts', { prefix: 3 }))
}

const copyMedia = function () {
    return src('./source/assets/media/**/*', { allowEmpty: true })
        .pipe(copy('./public/media', { prefix: 3 }))
}

const stylesBuild = function () {
    return src('./source/assets/styles/*.scss', { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./public/css'))
}

const scriptsBuild = function () {
    return src(['./source/assets/scripts/*.js','./source/patterns/**/*.js'], { allowEmpty: true })
        .pipe(webpack({
            mode: 'production',
            output: {
                path: path.join(__dirname, './public/js'),
                filename: 'all.js',
            },
            resolve: {
                modules: [
                    path.join(__dirname, './source/assets/scripts/vendor'),
                    'node_modules'
                ]
            },
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }]
            },
            devtool: 'source-map'
        }))
        .on('error', (err) => {
            logger.error(err.message)
        })
        .pipe(dest('./public/js'))
}

const copyVendorScripts = function () {
    return src([], { allowEmpty: true })
        .pipe(copy('./public/js', { prefix: 3 }))
}

const copyVendorStyles = function () {
    return src([], { allowEmpty: true })
        .pipe(copy('./public/css', { prefix: 7 }))
}

const fractalServe = function () {
    const server = fractal.web.server({
        sync: true,
        open: true
    })
    server.on('error', err => logger.error(err.message))
    return server.start().then(() => {
        new Table({
            title: 'FRACTAL SERVER IS NOW RUNNING',
            columns: [
                { name: 'Host', alignment: 'center' },
                { name: 'URL', alignment: 'left' },
            ]
        }).addRows([
            { Host: "Local URL", URL: server.url },
            { Host: "Network URL", URL: server.urls.sync.external },
            { Host: "BrowserSync UI", URL: server.urls.sync.ui },
        ]).printTable()
    })
}

const fractalBuild = function () {
    const builder = fractal.web.builder()
    builder.on('progress', (completed, total) => logger.update(`Exported ${ completed } of ${ total } items`, 'info'))
    builder.on('error', err => logger.error(err.message))
    return builder.start().then(() => {
        logger.success('Fractal build completed!')
    })
}

const watchChanges = function () {
    watch(['./source/assets/styles/**/*.scss', './source/patterns/**/*.scss'], stylesBuild)
    watch(['./source/assets/scripts/**/*.js', './source/patterns/**/*.js'], scriptsBuild)
    watch(['./source/assets/images/**/*'], copyImages)
    watch(['./source/assets/fonts/**/*'], copyFonts)
    watch(['./source/assets/media/**/*'], copyMedia)
    return Promise.resolve()
}

exports.cleanPublic       = cleanPublic
exports.copyImages        = copyImages
exports.copyFonts         = copyFonts
exports.copyMedia         = copyMedia
exports.stylesBuild       = stylesBuild
exports.scriptsBuild      = scriptsBuild
exports.copyVendorStyles  = copyVendorStyles
exports.copyVendorScripts = copyVendorScripts
exports.watchChanges      = watchChanges
exports.fractalServe      = fractalServe
exports.fractalBuild      = fractalBuild

exports.build = series(
    cleanPublic,
    parallel(
        copyImages,
        copyFonts,
        copyMedia,
        // copyVendorStyles,
        // copyVendorScripts,
    ),
    stylesBuild,
    scriptsBuild,
    fractalBuild
)

exports.default = series(
    cleanPublic,
    parallel(
        copyImages,
        copyFonts,
        copyMedia,
        // copyVendorStyles,
        // copyVendorScripts,
    ),
    stylesBuild,
    scriptsBuild,
    fractalServe,
    watchChanges
)
