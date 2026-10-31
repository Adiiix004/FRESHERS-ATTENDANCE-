// =====================================================
// KJIT CAMPUS - LOGIN SYSTEM
// =====================================================


// =====================================================
// LOGIN DETAILS
// =====================================================

// Change these if you want your own username/password.

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "1234";


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const rememberMe =
    document.getElementById("rememberMe");

const loginButton =
    document.getElementById("loginButton");

const showPassword =
    document.getElementById("showPassword");

const errorMessage =
    document.getElementById("errorMessage");

const successMessage =
    document.getElementById("successMessage");


// =====================================================
// CHECK IF USER IS ALREADY LOGGED IN
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loggedIn =
            sessionStorage.getItem(
                "kjitLoggedIn"
            );


        // Remembered username

        const rememberedUser =
            localStorage.getItem(
                "kjitRememberedUser"
            );


        if (rememberedUser) {

            usernameInput.value =
                rememberedUser;

            rememberMe.checked = true;

        }


        // If already logged in,
        // open dashboard.

        if (loggedIn === "true") {

            window.location.href =
                "index.html";

        }

    }
);


// =====================================================
// SHOW / HIDE PASSWORD
// =====================================================

showPassword.addEventListener(
    "click",
    function () {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            showPassword.textContent =
                "🙈";

            showPassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        }

        else {

            passwordInput.type =
                "password";

            showPassword.textContent =
                "👁️";

            showPassword.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    }
);


// =====================================================
// HIDE MESSAGES
// =====================================================

function hideMessages() {

    errorMessage.style.display =
        "none";

    successMessage.style.display =
        "none";

    errorMessage.textContent =
        "";

    successMessage.textContent =
        "";

}


// =====================================================
// SHOW ERROR MESSAGE
// =====================================================

function showError(message) {

    successMessage.style.display =
        "none";

    errorMessage.textContent =
        "❌ " + message;

    errorMessage.style.display =
        "block";

}


// =====================================================
// SHOW SUCCESS MESSAGE
// =====================================================

function showSuccess(message) {

    errorMessage.style.display =
        "none";

    successMessage.textContent =
        "✅ " + message;

    successMessage.style.display =
        "block";

}


// =====================================================
// LOGIN FORM
// =====================================================

loginForm.addEventListener(
    "submit",
    function (event) {

        // Stop page reload

        event.preventDefault();


        hideMessages();


        // Get entered values

        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        // =================================================
        // CHECK USERNAME
        // =================================================

        if (!username) {

            showError(
                "Please enter your username."
            );

            usernameInput.focus();

            return;

        }


        // =================================================
        // CHECK PASSWORD
        // =================================================

        if (!password) {

            showError(
                "Please enter your password."
            );

            passwordInput.focus();

            return;

        }


        // =================================================
        // LOGIN BUTTON LOADING
        // =================================================

        loginButton.disabled = true;

        loginButton.textContent =
            "Checking login...";


        // Small delay

        setTimeout(
            function () {


                // =============================================
                // CORRECT LOGIN
                // =============================================

                if (
                    username ===
                        VALID_USERNAME
                    &&
                    password ===
                        VALID_PASSWORD
                ) {


                    // Save login session

                    sessionStorage.setItem(
                        "kjitLoggedIn",
                        "true"
                    );


                    // =========================================
                    // REMEMBER USERNAME
                    // =========================================

                    if (
                        rememberMe.checked
                    ) {

                        localStorage.setItem(
                            "kjitRememberedUser",
                            username
                        );

                    }

                    else {

                        localStorage.removeItem(
                            "kjitRememberedUser"
                        );

                    }


                    // =========================================
                    // SUCCESS
                    // =========================================

                    showSuccess(
                        "Login successful! Opening dashboard..."
                    );


                    loginButton.textContent =
                        "✓ Login Successful";


                    // =========================================
                    // OPEN DASHBOARD
                    // =========================================

                    setTimeout(
                        function () {

                            window.location.href =
                                "index.html";

                        },
                        700
                    );

                }


                // =============================================
                // WRONG LOGIN
                // =============================================

                else {

                    showError(
                        "Invalid username or password."
                    );


                    loginButton.disabled =
                        false;


                    loginButton.textContent =
                        "🔐 Login to Dashboard";


                    passwordInput.value =
                        "";


                    passwordInput.focus();

                }

            },
            500
        );

    }
);


// =====================================================
// ENTER KEY - USERNAME
// =====================================================

usernameInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            passwordInput.focus();

        }

    }
);


// =====================================================
// CLEAR ERROR WHEN TYPING
// =====================================================

usernameInput.addEventListener(
    "input",
    function () {

        if (
            errorMessage.style.display ===
            "block"
        ) {

            hideMessages();

        }

    }
);


passwordInput.addEventListener(
    "input",
    function () {

        if (
            errorMessage.style.display ===
            "block"
        ) {

            hideMessages();

        }

    }
);
