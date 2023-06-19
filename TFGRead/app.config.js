import 'dotenv/config';
export default {
  expo: {
    name: "TFGRead",
    slug: "TFGRead",
    privacy:"public",
    description:"Aplicacion para leer",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/note.png",
    userInterfaceStyle: "light",
    splash: {
      resizeMode: "contain",
        image: "./assets/android/drawable-hdpi/splash.png",
        mdpi: "./assets/android/drawable-mdpi/splash.png",
        hdpi: "./assets/android/drawable-hdpi/splash.png",
        xhdpi: "./assets/android/drawable-xhdpi/splash.png",
        xxhdpi: "./assets/android/drawable-xxhdpi/splash.png",
        backgroundColor: "#FFFFFF"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
  
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.lausip.TFGRead",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.lausip.TFGRead"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "f12085f9-d7b8-4880-b737-23b3a327b1c8"
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId:process.env.FIREBASE_APP_ID,
      firebaseMesuramentId: process.env.FIREBASE_MESSAGING_MEASUREMENT_ID
    },
    
  }
};
