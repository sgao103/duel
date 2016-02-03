angular.module('duel.chatFact', ['duel.socketFact'])

.factory('ChatFact', ['$rootScope', 'SocketFact', function($rootScope, SocketFact) {
  var chatFact = {};

  chatFact.messages = [];
  chatFact.currRoom = {};

  //****************
  //Socket Listeners
  //****************

  SocketFact.socket.on('chat/message', function(data) {
    chatFact.messages.push(data);
    $rootScope.$apply();
  });

  SocketFact.socket.on('chat/update', function(data) {
    chatFact.currRoom = angular.copy(data);
    $rootScope.$apply();
  })

  //***************
  //Socket Triggers
  //***************
  chatFact.joinRoom = function(userId, room) {
    var msg = SocketFact.buildMessage({
      userId: userId,
      room: room
    });
    SocketFact.socket.emit('chat/join', msg);
  }

  chatFact.sendMessage = function(userId, text, room) {
    var msg = SocketFact.buildMessage({
      text: text,
      room: room,
      userId, userId
    });
    SocketFact.socket.emit('chat/message', msg);
  }

  return chatFact;
}])

.directive('onEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.onEnter, {
            'event': event
          });
        });

        event.preventDefault();
      }
    });
  };
});