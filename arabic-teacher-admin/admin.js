/* =========================================================
   ADMIN DASHBOARD - LOGIC
========================================================= */

const ADMIN_PASSWORD = "admin123";

const FIREBASE_CONFIG = {
    apiKey: "ضع_API_KEY_هنا",
    authDomain: "ضع_PROJECT_ID.firebaseapp.com",
    projectId: "ضع_PROJECT_ID",
    storageBucket: "ضع_PROJECT_ID.appspot.com",
    messagingSenderId: "ضع_SENDER_ID",
    appId: "ضع_APP_ID"
};

let db;
let allVisitors = [];
let refreshInterval;

/* =========================================================
   LOGIN
========================================================= */

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminPassword = document.getElementById("adminPassword");
const loginError = document.getElementById("loginError");

function doLogin() {
    if (adminPassword.value === ADMIN_PASSWORD) {
        loginScreen.style.display = "none";
        dashboard.style.display = "block";
        initFirebase();
    } else {
        loginError.style.display = "block";
        adminPassword.value = "";
        adminPassword.focus();
    }
}

loginBtn.addEventListener("click", doLogin);
adminPassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doLogin();
});

logoutBtn.addEventListener("click", () => {
    clearInterval(refreshInterval);
    dashboard.style.display = "none";
    loginScreen.style.display = "flex";
    adminPassword.value = "";
    loginError.style.display = "none";
});

/* =========================================================
   CLOCK
========================================================= */

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const date = now.toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    document.getElementById("liveClock").textContent = date + " | " + time;
}

updateClock();
setInterval(updateClock, 1000);

/* =========================================================
   FIREBASE
========================================================= */

function initFirebase() {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    loadVisitors();
    refreshInterval = setInterval(loadVisitors, 10000);
}

function loadVisitors() {
    db.collection("visitors")
        .orderBy("entryTime", "desc")
        .limit(500)
        .get()
        .then((snapshot) => {
            allVisitors = [];
            snapshot.forEach((doc) => {
                allVisitors.push({ id: doc.id, ...doc.data() });
            });
            updateStats();
            renderTable(allVisitors);
            renderChart();
            renderDevices();
        })
        .catch((err) => {
            console.error("Error loading visitors:", err);
        });
}

/* =========================================================
   STATS
========================================================= */

function updateStats() {
    const total = allVisitors.length;

    const active = allVisitors.filter((v) => v.isActive === true).length;

    const today = new Date().toISOString().split("T")[0];
    const todayCount = allVisitors.filter((v) => {
        return v.entryTime && v.entryTime.startsWith(today);
    }).length;

    const withDuration = allVisitors.filter((v) => v.duration && v.duration > 0);
    const avgSec = withDuration.length > 0
        ? withDuration.reduce((sum, v) => sum + v.duration, 0) / withDuration.length
        : 0;
    const avgMin = Math.round(avgSec / 60);

    document.getElementById("totalVisitors").textContent = total;
    document.getElementById("activeNow").textContent = active;
    document.getElementById("todayVisitors").textContent = todayCount;
    document.getElementById("avgDuration").textContent = avgMin;
}

/* =========================================================
   TABLE
========================================================= */

function formatDateTime(isoString) {
    if (!isoString) return "—";
    const d = new Date(isoString);
    return d.toLocaleDateString("ar-EG", { day: "2-digit", month: "2-digit", year: "numeric" })
        + " "
        + d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return "—";
    if (seconds < 60) return seconds + " ثانية";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    if (min < 60) return min + " د " + sec + " ث";
    const hrs = Math.floor(min / 60);
    const remMin = min % 60;
    return hrs + " س " + remMin + " د";
}

function parseDevice(userAgent) {
    if (!userAgent) return "غير معروف";
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") && !ua.includes("tablet")) return "موبايل";
    if (ua.includes("tablet") || ua.includes("ipad")) return "تابلت";
    return "كمبيوتر";
}

function parseBrowser(userAgent) {
    if (!userAgent) return "";
    const ua = userAgent;
    if (ua.includes("Edg/")) return "Edge";
    if (ua.includes("Chrome/")) return "Chrome";
    if (ua.includes("Firefox/")) return "Firefox";
    if (ua.includes("Safari/")) return "Safari";
    return "أخرى";
}

function getReferrerDisplay(referrer) {
    if (!referrer || referrer === "direct") return " مباشر";
    if (referrer.includes("google")) return "Google";
    if (referrer.includes("facebook")) return "Facebook";
    if (referrer.includes("twitter") || referrer.includes("x.com")) return "Twitter";
    if (referrer.includes("instagram")) return "Instagram";
    try {
        return new URL(referrer).hostname;
    } catch {
        return referrer;
    }
}

let currentDateFilter = null;

document.getElementById("filterDate").addEventListener("change", (e) => {
    currentDateFilter = e.target.value;
    applyFilter();
});

document.getElementById("clearFilter").addEventListener("click", () => {
    currentDateFilter = null;
    document.getElementById("filterDate").value = "";
    applyFilter();
});

function applyFilter() {
    if (!currentDateFilter) {
        renderTable(allVisitors);
    } else {
        const filtered = allVisitors.filter((v) => {
            return v.entryTime && v.entryTime.startsWith(currentDateFilter);
        });
        renderTable(filtered);
    }
}

function renderTable(visitors) {
    const tbody = document.getElementById("visitorsBody");

    if (visitors.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <div class="empty-icon">📋</div>
                        <p>لا يوجد زوار بعد</p>
                    </div>
                </td>
            </tr>
        `;
        document.getElementById("showingCount").textContent = "0";
        document.getElementById("totalCount").textContent = "0";
        return;
    }

    let html = "";
    visitors.forEach((v, i) => {
        const statusClass = v.isActive ? "online" : "offline";
        const statusText = v.isActive ? "نشط" : "غير نشط";
        const device = parseDevice(v.userAgent);
        const browser = parseBrowser(v.userAgent);
        const referrer = getReferrerDisplay(v.referrer);

        html += `
            <tr>
                <td style="color:#666;">${i + 1}</td>
                <td>${formatDateTime(v.entryTime)}</td>
                <td>${formatDateTime(v.exitTime)}</td>
                <td>${formatDuration(v.duration)}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        <span class="status-dot"></span>
                        ${statusText}
                    </span>
                </td>
                <td>
                    <span class="device-tag">${device} / ${browser}</span>
                </td>
                <td style="color:#888;">${referrer}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
    document.getElementById("showingCount").textContent = visitors.length;
    document.getElementById("totalCount").textContent = allVisitors.length;
}

/* =========================================================
   CHART
========================================================= */

function renderChart() {
    const container = document.getElementById("dailyChart");
    const dayMap = {};

    allVisitors.forEach((v) => {
        if (!v.entryTime) return;
        const day = v.entryTime.split("T")[0];
        dayMap[day] = (dayMap[day] || 0) + 1;
    });

    const sorted = Object.entries(dayMap)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 7);

    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>لا توجد بيانات كافية</p></div>';
        return;
    }

    const maxCount = Math.max(...sorted.map((d) => d[1]));

    let html = "";
    sorted.forEach(([date, count]) => {
        const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
        const dateObj = new Date(date + "T00:00:00");
        const label = dateObj.toLocaleDateString("ar-EG", { weekday: "short", day: "numeric", month: "short" });

        html += `
            <div class="chart-bar-row">
                <span class="chart-bar-label">${label}</span>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width:${pct}%"></div>
                </div>
                <span class="chart-bar-count">${count}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

/* =========================================================
   DEVICES
========================================================= */

function renderDevices() {
    const container = document.getElementById("deviceStats");
    const deviceMap = {};

    allVisitors.forEach((v) => {
        const device = parseDevice(v.userAgent);
        deviceMap[device] = (deviceMap[device] || 0) + 1;
    });

    if (Object.keys(deviceMap).length === 0) {
        container.innerHTML = '<div class="empty-state"><p>لا توجد بيانات</p></div>';
        return;
    }

    const sorted = Object.entries(deviceMap).sort((a, b) => b[1] - a[1]);

    let html = "";
    sorted.forEach(([device, count]) => {
        html += `
            <div class="device-stat-row">
                <span>${device}</span>
                <span>${count}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

/* =========================================================
   REFRESH BUTTON
========================================================= */

document.getElementById("refreshBtn").addEventListener("click", () => {
    loadVisitors();
});