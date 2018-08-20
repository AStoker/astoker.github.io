import environment from './environment';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  logWelcomeMessage();

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}

function logWelcomeMessage() {
  console.log(
    '%cCurious one, aren\'t you?\n'
    + '"Under Construction" is a very loose term right now.\n'
    + 'Hit me up over on GitHub (https://github.com/AStoker) if you need anything.\n'
    + 'Party on dudes!\n'
    + 'https://youtu.be/rph_1DODXDU',
    'background: rgb(220, 162, 110); color:rgb(57, 64, 88)');
}
