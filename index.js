process.title = 'Feedback-App';

var app = require('./server/routes');

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

/**
 * Shutdown the server process
 *
 * @param {String}  signal    Signal to send, such as 'SIGINT' or 'SIGHUP'
 */
var close = function(signal) {
  console.log('Server shutting down');
  process.kill(process.pid, signal);
};

process.stdin.resume();

// Attach event listeners
process.on('SIGINT', function() {
  close('SIGINT');
});

process.on('SIGHUP', function() {
  close('SIGHUP');
});

process.on('SIGTERM', function() {
  close('SIGTERM');
});
