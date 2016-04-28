'use strict';

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);

  var icon = '/images/maimai.jpg';
  var tag = 'simple-push-demo-notification-tag';

  var url = 'https://monosense-hackathon-web-push.herokuapp.com/api/v0/push/message';

  fetch(url).then(function (response) {
    return response.json();
  }).then(function (json) {
    event.waitUntil(
      self.registration.showNotification(json.title, {
        body: json.text,
        icon: icon,
        tag: tag
      })
    );
  });
});

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === '/' && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('/');
    }
  }));
});
