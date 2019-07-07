import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyBeRfvbpY01pVW1o16aRB8zBEGnfvRehb4",
  authDomain: "imdb-49565.firebaseapp.com",
  databaseURL: "https://imdb-49565.firebaseio.com",
  projectId: "imdb-49565",
  storageBucket: "imdb-49565.appspot.com",
  messagingSenderId: "279964324870",
  appId: "1:279964324870:web:091aacaa0e5eea7d"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;
