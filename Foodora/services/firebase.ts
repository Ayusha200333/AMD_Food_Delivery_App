// // services/firebase.ts
// import { initializeApp } from "firebase/app"
// import { getFirestore } from "firebase/firestore"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// // @ts-ignore
// import { initializeAuth, getReactNativePersistence } from "firebase/auth"
// // import { getReactNativePersistence } from "firebase/auth/react-native";

// const firebaseConfig = {
//   apiKey: "AIzaSyBdDU5W96O_2nLoN4kivF40FA7ZmT1D1PM",
//   authDomain: "food-delivery-app-4c683.firebaseapp.com",
//   projectId: "food-delivery-app-4c683",
//   storageBucket: "food-delivery-app-4c683.firebasestorage.app",
//   messagingSenderId: "715111360864",
//   appId: "1:715111360864:web:366d94d8a2e73739431605",
//   measurementId: "G-MZMXTX01GT"
// };

// const app = initializeApp(firebaseConfig)

// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// })



import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBdDU5W96O_2nLoN4kivF40FA7ZmT1D1PM",
  authDomain: "food-delivery-app-4c683.firebaseapp.com",
  projectId: "food-delivery-app-4c683",
  storageBucket: "food-delivery-app-4c683.firebasestorage.app",
  messagingSenderId: "715111360864",
  appId: "1:715111360864:web:366d94d8a2e73739431605",
  measurementId: "G-MZMXTX01GT"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app)