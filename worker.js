var path = require('path');
var helper = require(path.join(__dirname, 'helper'));

module.exports.run = function(worker) {
  var scServer = worker.scServer;

  // authorize subscriptions
  scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, function(req, next) {
    var token = req.socket.getAuthToken();
    if (token && req.channel === '/u/' + token.userId) {
      next();
    }
    else {
      next('subscription to ' + req.channel + ' failed.');
    }
  });

  scServer.on('connection', function(socket) {
    console.log('connected:', process.pid);
    var user= {
      valid: false
    };


    socket.on('disconnect', function() {
      console.log('DISCONNECT:', process.pid);
    });

    socket.on('error', function(error) {
      console.log('SocketError:', error.message);
    });
  });
};
