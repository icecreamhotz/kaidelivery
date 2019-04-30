import * as firebase from "firebase";

const settings = { timestampsInSnapshots: true };

const config = {
  apiKey: "AIzaSyDA8f317OghWrPfir9ANDVCF5OBz6eT1DE",
  authDomain: "kaidelivery-f399f.firebaseapp.com",
  databaseURL: "https://kaidelivery-f399f.firebaseio.com",
  projectId: "kaidelivery-f399f",
  storageBucket: "kaidelivery-f399f.appspot.com",
  messagingSenderId: "99509912056"
};
firebase.initializeApp(config);

export default firebase;
