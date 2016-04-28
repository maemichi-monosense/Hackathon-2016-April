'use strict';

var API_KEY = 'AIzaSyBkesBWycrfZIBjivDrXqk3WNvvw1sV52U';
var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';

var curlCommandDiv = document.querySelector('.js-curl-command');
var isPushEnabled = false;

function endpointWorkaround(pushSubscription) {
  // GCMのみ散らかすことを確かめる
  if (pushSubscription.endpoint.indexOf('https://android.googleapis.com/gcm/send') !== 0) {
    return pushSubscription.endpoint;
  }
  var mergedEndpoint = pushSubscription.endpoint;
  // Chrome 42 + 43 エンドポイントにつけるsubscription id は持っていない
  if (pushSubscription.subscriptionId &&
    pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
    // 42をハンドリングする
    mergedEndpoint = pushSubscription.endpoint + '/' +
      pushSubscription.subscriptionId;
  }
  return mergedEndpoint;
}

function sendSubscriptionToServer(subscription) {
  var mergedEndpoint = endpointWorkaround(subscription);
  showCurlCommand(mergedEndpoint);
}

function showCurlCommand(mergedEndpoint) {
  if (mergedEndpoint.indexOf(GCM_ENDPOINT) !== 0) {
    alert('このブラウザは現在この機能に対応していません');
    return;
  }

  var endpointSections = mergedEndpoint.split('/');
  var subscriptionId = endpointSections[endpointSections.length - 1];

  // subscriptionIdの送信
  var url = 'https://monosense-hackathon-web-push.herokuapp.com/api/v0/id/registration';
  var JSONdata = {
    id: subscriptionId
  };
  $.ajax({
    type: 'PUT',
    url: url,
    headers: {
      'X-HTTP-Method-Override': 'PUT',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(JSONdata),
    dataType: 'JSON',
    scriptCharset: 'utf-8',
    success: function (data) {
      console.log(data);
    },
    error: function (data) {
      console.log(data);
      alert("subscriptionIdの送信エラー");
    }
  });

  alert(JSON.stringify(JSONdata));
}

function unsubscribe() {
  var pushButton = document.querySelector('.js-push-button');
  pushButton.disabled = true;

  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.getSubscription().then(
      function (pushSubscription) {
        // unsubscribeされたかチェックする
        if (!pushSubscription) {
          isPushEnabled = false;
          pushButton.disabled = false;
          pushButton.textContent = 'プッシュ通知をONにする';
          return;
        }

        // TODO: Make a request to your server to remove

        // We have a subcription, so call unsubscribe on it
        pushSubscription.unsubscribe().then(function () {
          pushButton.disabled = false;
          pushButton.textContent = 'プッシュ通知をONにする';
          isPushEnabled = false;
        }).catch(function (e) {
          alert('登録停止エラー error: ' + e);
          pushButton.disabled = false;
        });
      }).catch(function (e) {
      alert('プッシュメッセージから登録停止中にエラーが投げられました error: ' + e);
    });
  });
}

function subscribe() {
  var pushButton = document.querySelector('.js-push-button');
  pushButton.disabled = true;

  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
      .then(function (subscription) {
        // subscription が成功した場合
        isPushEnabled = true;
        pushButton.textContent = 'プッシュ通知をOFFにする';
        pushButton.disabled = false;
        // IDをサーバに送る
        return sendSubscriptionToServer(subscription);
      })
      .catch(function (e) {
        if (Notification.permission === 'denied') {
          alert('通知のアクセス許可が拒否されました');
          pushButton.disabled = true;
        } else {
          alert('プッシュを登録することができません' + e);
          pushButton.disabled = false;
          pushButton.textContent = 'プッシュ通知をONにする';
        }
      });
  });
}

function initialiseState() {
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    alert('通知がサポートされていません');
    return;
  }
  if (Notification.permission === 'denied') {
    alert('このユーザは通知をブロックしました');
    return;
  }
  if (!('PushManager' in window)) {
    alert('プッシュメッセージがサポートされていません');
    return;
  }
  // subscriptionをチェックするため service worker の登録が必要
  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function (subscription) {
        var pushButton = document.querySelector('.js-push-button');
        pushButton.disabled = false;
        if (!subscription) {
          return;
        }
        // IDをサーバに送る
        sendSubscriptionToServer(subscription);
        pushButton.textContent = 'プッシュ通知をOFFにする';
        isPushEnabled = true;
      })
      .catch(function (err) {
        alert('getSubscription()中にエラーが発生しました' + err);
      });
  });
}

// ロード時に実行
window.addEventListener('load', function () {
  // ボタン押下時に実行
  var pushButton = document.querySelector('.js-push-button');
  pushButton.addEventListener('click', function () {
    if (isPushEnabled) {
      unsubscribe();
    } else {
      subscribe();
    }
  });
  // ブラウザが service workers に対応している場合は、 service workers を常駐させる
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(initialiseState);
  } else {
    alert('Service workersがこのブラウザでサポートされていません');
  }
});
