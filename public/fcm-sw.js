
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js')

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyAVWm5UtJid4eRYkPTvAqfogtblcsaMzpM',
    projectId: 'zinc-cse-hkust',
    messagingSenderId: '818352116262',
    appId: '1:818352116262:web:b4b98e0ac64c7b3e3ccce7'
  })

  firebase.messaging();
  firebase.messaging().onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
    };

    self.registration.showNotification(notificationTitle,
      notificationOptions);
  })
}