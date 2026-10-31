// =====================================================
// KJIT CAMPUS ATTENDANCE SYSTEM
// LOGIN GUARD  (include in <head> of every protected page)
// =====================================================
// NOTE: This is a front-end check only. It keeps casual visitors out
// but is not real security, because everything runs in the browser.

(function () {

    var loggedIn = false;

    try {
        loggedIn = sessionStorage.getItem("kjitLoggedIn") === "true";
    } catch (e) {
        loggedIn = false;
    }

    if (!loggedIn) {
        // Hide the page so nothing flashes before the redirect.
        document.documentElement.style.visibility = "hidden";
        window.location.replace("login.html");
    }

    window.kjitLogout = function (event) {

        if (event && event.preventDefault) {
            event.preventDefault();
        }

        try {
            sessionStorage.removeItem("kjitLoggedIn");
        } catch (e) { }

        window.location.replace("login.html");
    };

})();
