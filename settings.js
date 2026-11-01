// =====================================================
// KJIT CAMPUS ATTENDANCE SYSTEM
// SETTINGS PAGE
// =====================================================

"use strict";

(function () {

    // -------------------------------------------------
    // STORAGE KEYS (shared with the other pages)
    // -------------------------------------------------

    const STUDENTS_KEY = "kjitStudents";
    const ATTENDANCE_KEY = "attendanceData";
    const DARK_KEY = "kjitDarkMode";
    const CREDS_KEY = "kjitCredentials";

    const DEFAULT_CREDS = { username: "admin", password: "1234" };


    // -------------------------------------------------
    // SMALL HELPERS
    // -------------------------------------------------

    const $ = function (id) { return document.getElementById(id); };

    function readJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function isPlainObject(v) {
        return v !== null && typeof v === "object" && !Array.isArray(v);
    }

    function showMsg(el, text, ok) {
        el.textContent = text;
        el.className = "s-msg show " + (ok ? "ok" : "err");
    }

    function hideMsg(el) {
        el.className = "s-msg";
        el.textContent = "";
    }

    function getCreds() {
        const saved = readJSON(CREDS_KEY, null);
        if (isPlainObject(saved) && saved.username && saved.password) {
            return saved;
        }
        return DEFAULT_CREDS;
    }


    // -------------------------------------------------
    // MOBILE SIDEBAR
    // -------------------------------------------------

    window.toggleSidebar = function () {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) { sidebar.classList.toggle("open"); }
    };


    // -------------------------------------------------
    // TABS  (supports links like settings.html#data)
    // -------------------------------------------------

    const tabs = Array.prototype.slice.call(document.querySelectorAll(".settings-tab"));
    const panels = Array.prototype.slice.call(document.querySelectorAll(".settings-panel"));

    function showTab(name, updateHash) {

        let found = false;

        tabs.forEach(function (t) {
            const on = t.getAttribute("data-tab") === name;
            t.classList.toggle("active", on);
            t.setAttribute("aria-selected", on ? "true" : "false");
            if (on) { found = true; }
        });

        if (!found) { return showTab("appearance", updateHash); }

        panels.forEach(function (p) {
            p.classList.toggle("active", p.id === "tab-" + name);
        });

        if (updateHash) {
            history.replaceState(null, "", "#" + name);
        }

        if (name === "about") { refreshAbout(); }
    }

    tabs.forEach(function (t) {
        t.addEventListener("click", function () {
            showTab(t.getAttribute("data-tab"), true);
        });
    });


    // -------------------------------------------------
    // APPEARANCE - DARK MODE
    // -------------------------------------------------

    const darkToggle = $("darkToggle");
    const themeButton = $("themeButton");

    function applyDark(isDark) {
        document.body.classList.toggle("dark", isDark);
        darkToggle.checked = isDark;
        if (themeButton) { themeButton.textContent = isDark ? "☀️" : "🌙"; }
        try { localStorage.setItem(DARK_KEY, isDark ? "true" : "false"); } catch (e) { }
    }

    let savedDark = false;
    try { savedDark = localStorage.getItem(DARK_KEY) === "true"; } catch (e) { }
    document.body.classList.toggle("dark", savedDark);
    darkToggle.checked = savedDark;
    if (themeButton) { themeButton.textContent = savedDark ? "☀️" : "🌙"; }

    darkToggle.addEventListener("change", function () { applyDark(darkToggle.checked); });

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            applyDark(!document.body.classList.contains("dark"));
        });
    }


    // -------------------------------------------------
    // ACCOUNT - CHANGE LOGIN DETAILS
    // -------------------------------------------------

    const accountMsg = $("accountMsg");

    function refreshCurrentUser() {
        $("currentUser").textContent = getCreds().username;
        $("newUser").value = getCreds().username;
    }

    $("saveLogin").addEventListener("click", function () {

        const creds = getCreds();
        const curPass = $("curPass").value;
        const newUser = $("newUser").value.trim();
        const newPass = $("newPass").value;
        const newPass2 = $("newPass2").value;

        if (curPass !== creds.password) {
            return showMsg(accountMsg, "Current password is not correct.", false);
        }

        if (!newUser) {
            return showMsg(accountMsg, "Please enter a username.", false);
        }

        // Leaving the new password blank keeps the old one.
        const finalPass = newPass === "" ? creds.password : newPass;

        if (newPass !== "") {
            if (newPass.length < 4) {
                return showMsg(accountMsg, "New password must be at least 4 characters.", false);
            }
            if (newPass !== newPass2) {
                return showMsg(accountMsg, "The two new passwords do not match.", false);
            }
        }

        try {
            localStorage.setItem(CREDS_KEY, JSON.stringify({ username: newUser, password: finalPass }));
        } catch (e) {
            return showMsg(accountMsg, "Could not save. Browser storage may be blocked.", false);
        }

        $("curPass").value = "";
        $("newPass").value = "";
        $("newPass2").value = "";
        refreshCurrentUser();
        showMsg(accountMsg, "Login details saved. Use them next time you sign in.", true);
    });

    $("resetLogin").addEventListener("click", function () {

        if (!confirm("Reset the login to the default username and password?")) { return; }

        try { localStorage.removeItem(CREDS_KEY); } catch (e) { }

        $("curPass").value = "";
        $("newPass").value = "";
        $("newPass2").value = "";
        refreshCurrentUser();
        showMsg(accountMsg, "Login reset to the default details.", true);
    });


    // -------------------------------------------------
    // DATA - BACKUP / RESTORE / CLEAR
    // -------------------------------------------------

    const dataMsg = $("dataMsg");

    function today() {
        const d = new Date();
        const pad = function (n) { return String(n).padStart(2, "0"); };
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    }

    $("backupBtn").addEventListener("click", function () {

        const backup = {
            app: "KJIT-ATTENDANCE-SHEET",
            version: 1,
            exportedAt: new Date().toISOString(),
            students: readJSON(STUDENTS_KEY, []),
            attendance: readJSON(ATTENDANCE_KEY, {})
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "kjit-attendance-backup-" + today() + ".json";
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

        showMsg(dataMsg, "Backup downloaded.", true);
    });


    function validBackup(data) {

        if (!isPlainObject(data)) { return "This file is not a valid backup."; }
        if (!isPlainObject(data.attendance)) { return "This backup has no attendance data."; }

        if (data.students !== undefined) {
            if (!Array.isArray(data.students)) { return "The student list in this backup is not valid."; }
            for (let i = 0; i < data.students.length; i++) {
                const s = data.students[i];
                if (!isPlainObject(s) || typeof s.roll !== "string" || typeof s.name !== "string") {
                    return "The student list in this backup is not valid.";
                }
            }
        }

        return null;
    }

    $("restoreBtn").addEventListener("click", function () {

        const file = $("restoreFile").files[0];

        if (!file) {
            return showMsg(dataMsg, "Please choose a backup file first.", false);
        }

        const reader = new FileReader();

        reader.onerror = function () {
            showMsg(dataMsg, "Could not read that file.", false);
        };

        reader.onload = function () {

            let data;

            try {
                data = JSON.parse(reader.result);
            } catch (e) {
                return showMsg(dataMsg, "This file is not a valid backup.", false);
            }

            const problem = validBackup(data);

            if (problem) { return showMsg(dataMsg, problem, false); }

            const days = Object.keys(data.attendance).length;

            if (!confirm("Restore this backup (" + days + " day(s) of attendance)?\n\nThis replaces the data currently on this device.")) {
                return;
            }

            try {
                localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data.attendance));
                if (data.students !== undefined) {
                    localStorage.setItem(STUDENTS_KEY, JSON.stringify(data.students));
                }
            } catch (e) {
                return showMsg(dataMsg, "Could not save. Browser storage may be full or blocked.", false);
            }

            $("restoreFile").value = "";
            showMsg(dataMsg, "Backup restored: " + days + " day(s) of attendance.", true);
        };

        reader.readAsText(file);
    });


    $("clearBtn").addEventListener("click", function () {

        if (!confirm("Delete ALL attendance records?\n\nThis cannot be undone.")) { return; }

        try {
            localStorage.setItem(ATTENDANCE_KEY, "{}");
        } catch (e) {
            return showMsg(dataMsg, "Could not clear. Browser storage may be blocked.", false);
        }

        showMsg(dataMsg, "All attendance records were cleared.", true);
    });


    // -------------------------------------------------
    // ABOUT
    // -------------------------------------------------

    function refreshAbout() {

        const students = readJSON(STUDENTS_KEY, null);
        const attendance = readJSON(ATTENDANCE_KEY, {});

        $("aboutStudents").textContent = Array.isArray(students) ? students.length : "-";
        $("aboutDays").textContent = isPlainObject(attendance) ? Object.keys(attendance).length : 0;

        let chars = 0;
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                chars += k.length + (localStorage.getItem(k) || "").length;
            }
        } catch (e) { }

        $("aboutSize").textContent = (chars * 2 / 1024).toFixed(1) + " KB";

        $("aboutOffline").textContent =
            ("serviceWorker" in navigator && navigator.serviceWorker.controller) ? "Yes" : "Not yet";
    }


    // -------------------------------------------------
    // START
    // -------------------------------------------------

    refreshCurrentUser();
    refreshAbout();

    function tabFromHash() {
        return (location.hash || "").replace("#", "") || "appearance";
    }

    showTab(tabFromHash(), false);

    // Keeps tabs in sync with back/forward and links like settings.html#data
    window.addEventListener("hashchange", function () {
        showTab(tabFromHash(), false);
    });

})();
