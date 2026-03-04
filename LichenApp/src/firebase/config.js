// Firebase Configuration
// Note: We are now using the REST API for maximum stability in Expo Go,
// but we keep the config for future SDK use or other services.

export const firebaseConfig = {
    apiKey: "AIzaSyDzVWwlmAJjP6JN7hoqMmQFQpyLq0gSpxc",
    authDomain: "lichen-live.firebaseapp.com",
    databaseURL: "https://lichen-live-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lichen-live",
    storageBucket: "lichen-live.firebasestorage.app",
    messagingSenderId: "794470653949",
    appId: "1:794470653949:web:20bbaf98b0e9aaf13cc394"
};

export const REST_DB_URL = firebaseConfig.databaseURL;
