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
        foregroundImage: "./assets/adaptive-icon.png",
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
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    },
    
  }
};
