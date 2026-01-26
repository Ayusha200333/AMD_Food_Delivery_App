import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";  
// @ts-ignore  
import { initializeAuth, getReactNativePersistence, indexedDBLocalPersistence } from "firebase/auth";  

import { getStorage } from "firebase/storage"  
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
  persistence: Platform.OS === 'web' 
    ? indexedDBLocalPersistence  
    : getReactNativePersistence(AsyncStorage)  
});

export const db = getFirestore(app);

export const storage = getStorage(app)  