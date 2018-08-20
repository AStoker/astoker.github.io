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
  console.log('Curious one, aren\'t you?');
  console.log('"Under Construction" is a very loose term right now.');
  console.log('Hit me up over on GitHub (https://github.com/AStoker) if you need anything.');
  console.log('Party on dudes!');
  console.log('https://youtu.be/rph_1DODXDU');
}