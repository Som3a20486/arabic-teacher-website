const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDqDvUDT4oJHjvN-qzWWyjdyX1cih3842Q",
    authDomain: "admin-html-a7b1e.firebaseapp.com",
    projectId: "admin-html-a7b1e",
    storageBucket: "admin-html-a7b1e.firebasestorage.app",
    messagingSenderId: "735145882658",
    appId: "1:735145882658:web:0656fe4e6e853da910467b"
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
        const referrer = document.referrer || "direct";
        db.collection("visitors").add({
            sessionId: sessionId,
            entryTime: entryTime,
            exitTime: null,
            duration: null,
            userAgent: userAgent,
            referrer: referrer,
            isActive: true
        }).then((docRef) => {
            const visitorId = docRef.id;
            const updateActivity = () => {
                db.collection("visitors").doc(visitorId).update({ isActive: true });
            };
            document.addEventListener("mousemove", updateActivity);
            document.addEventListener("keypress", updateActivity);
            document.addEventListener("scroll", updateActivity);
            document.addEventListener("click", updateActivity);
            let inactivityTimer;
            const resetInactivity = () => {
                clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(() => {
                    db.collection("visitors").doc(visitorId).update({ isActive: false });
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
                if (document.visibilityState === "hidden") sendExit();
            });
        });
    };
};