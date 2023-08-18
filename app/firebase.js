      // Import the functions you need from the SDKs you need
      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
      import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries
      import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      const firebaseConfig = {
        apiKey: "AIzaSyDrj8JNU4dArV_Qd25ayc3iBi8RgWfjRnw",
        authDomain: "bombshell-dcf3d.firebaseapp.com",
        projectId: "bombshell-dcf3d",
        storageBucket: "bombshell-dcf3d.appspot.com",
        messagingSenderId: "689923154652",
        appId: "1:689923154652:web:f350ecafc9f5ae650dca19",
        measurementId: "G-XNFXS5TH39",
      };

      // Initialize Firebase
      export const app = initializeApp(firebaseConfig);
      export const analytics = getAnalytics(app);
      export const auth = getAuth(app)

     
