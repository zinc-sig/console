import { getMessaging, getToken } from "firebase/messaging";
import * as firebase from 'firebase/app'
import localforage from 'localforage'

const firebaseCloudMessaging = {
  tokenInlocalforage: async () => {
    return localforage.getItem('fcm_token')
  },

  init: async function () {

    firebase.initializeApp({
      apiKey: 'AIzaSyAVWm5UtJid4eRYkPTvAqfogtblcsaMzpM',
      projectId: 'zinc-cse-hkust',
      messagingSenderId: '818352116262',
      appId: '1:818352116262:web:b4b98e0ac64c7b3e3ccce7',
    })

    try {
      if ((await this.tokenInlocalforage()) !== null) {
        return this.tokenInlocalforage();
      }

      const messaging = getMessaging();
      const status = await Notification.requestPermission();
      if (status && status === 'granted') {
        console.log('granted permission')
        const token = await getToken(messaging);
        localforage.setItem('fcm_token', token);
        console.log(token);
        return token;
      }
    } catch (error) {
      console.error(error)
    }
  },
}

export { firebaseCloudMessaging }