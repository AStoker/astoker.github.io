import gulp from 'gulp';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback/lib';
import { CLIOptions } from 'aurelia-cli';
import project from '../aurelia.json';
import build from './build';
import watch from './watch';

const runAsES6 = CLIOptions.hasFlag('es6');

function startBrowser(done) {
    browserSync({
        online: false,
        open: false,
        port: 9000,
        logLevel: 'verbose',
        server: {
            baseDir: [project.platform.baseDir],
            index: runAsES6 ? 'index.es6.html' : 'index.html',
            middleware: [historyApiFallback(), function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }]
        }
    }, function(err, bs) {
        if (err) return done(err);
        let urls = bs.options.get('urls').toJS();
        log(`Application Available At: ${urls.local}`);
        log(`BrowserSync Available At: ${urls.ui}`);
        done();
    });
}

let buildNServe = gulp.series(
    build,
    startBrowser
);
let serveES6 = gulp.series(startBrowser);

function log(message) {
    console.log(message); //eslint-disable-line no-console
}

function reload() {
    log('Refreshing the browser');
    browserSync.reload();
}

let run;
let serve = buildNServe;
if (runAsES6) {
    serve = serveES6;
}
if (CLIOptions.hasFlag('watch')) {
    run = gulp.series(
        serve,
        done => {
            watch(reload);
            done();
        }
    );
} else {
    run = serve;
}

export default run;
