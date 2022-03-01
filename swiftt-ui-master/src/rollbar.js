import Rollbar from 'rollbar';

// Track error by rollbar.com
if (location.host === 'syhos-qa.sycomafrica.com') {
  Rollbar.init({
    accessToken: '80842b709fca4c29832f2248a3a90b7c',
    captureUncaught: true,
    payload: {
      environment: 'test',
    },
  });
}
