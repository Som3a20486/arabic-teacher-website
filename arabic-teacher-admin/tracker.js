/* =========================================================
   FIREBASE VISITOR TRACKER
   أضف هذا الملف في index.html قبل </body>
   ========================================================= */

const FIREBASE_CONFIG = {
    apiKey: "ضع_API_KEY_هنا",
    authDomain: "ضع_PROJECT_ID.firebaseapp.com",
    projectId: "ضع_PROJECT_ID",
    storageBucket: "ضع_PROJECT_ID.appspot.com",
    messagingSenderId: "ضع_SENDER_ID",
    appId: "ضع_APP_ID"
};

const firebaseScript = document.createElement("script");
firebaseScript.src = "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js";
document.head.appendChild(firebaseScript);

firebaseScript.onload = () => {

    const firestoreScript = document.createElement("script");
    firestoreScript.src = "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js";
    document.head.appendChild(firestoreScript);

    firestoreScript.onload = () => {

        firebase.initializeApp(FIREBASE_CONFIG);
        const db = firebase.firestore();

        const sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
        const entryTime = new Date().toISOString();
        const userAgent = navigator.userAgent;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const referrer = document.referrer || "direct";

        db.collection("visitors").add({
            sessionId: sessionId,
            entryTime: entryTime,
            exitTime: null,
            duration: null,
            userAgent: userAgent,
            screenWidth: screenWidth,
            screenHeight: screenHeight,
            referrer: referrer,
            pages: [window.location.pathname],
            isActive: true
        }).then((docRef) => {

            const visitorId = docRef.id;

            const updateActivity = () => {
                db.collection("visitors").doc(visitorId).update({
                    isActive: true
                });
            };

            document.addEventListener("mousemove", updateActivity);
            document.addEventListener("keypress", updateActivity);
            document.addEventListener("scroll", updateActivity);
            document.addEventListener("click", updateActivity);

            let inactivityTimer;
            const resetInactivity = () => {
                clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(() => {
                    db.collection("visitors").doc(visitorId).update({
                        isActive: false
                    });
                }, 60000);
            };

            document.addEventListener("mousemove", resetInactivity);
            document.addEventListener("keypress", resetInactivity);
            document.addEventListener("click", resetInactivity);
            resetInactivity();

            const sendExit = () => {
                const exitTime = new Date().toISOString();
                const duration = Math.round((new Date() - new Date(entryTime)) / 1000);

                db.collection("visitors").doc(visitorId).update({
                    exitTime: exitTime,
                    duration: duration,
                    isActive: false
                });
            };

            window.addEventListener("beforeunload", sendExit);
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "hidden") {
                    sendExit();
                }
            });

        });

    };

};