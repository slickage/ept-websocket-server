var path = require('path');
var _ = require('lodash');
var db = require(path.join(__dirname, 'db'));

var middleware = module.exports = {};
middleware.subscribe = function(req, next) {
  var token = req.socket.getAuthToken();
  if (token) {
    db.users.find(token.userId).then(function(dbUser) {
      // check for user channel
      if (req.channel.type === 'user' && req.channel.id === dbUser.id) {
        next();
      }
      // check for role channel
      else if (_.some(dbUser.roles, roleChannelLookup(req.channel))) {
        next();
      }
      else {
        next('MIDDLEWARE_SUBSCRIBE: Unauthorized channel ' + req.channel);
      }
    })
    .catch(function(err) {
      next('MIDDLEWARE_SUBSCRIBE: ' + err);
    });
  }
  else {
    next('MIDDLEWARE_SUBSCRIBE: Missing token.');
  }
};

function roleChannelLookup(channelRole) {
  return function(role) {
    return  channelRole === role.lookup;
  };
}
