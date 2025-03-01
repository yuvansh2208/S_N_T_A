// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBrBuYJYzdkVNTxVrOul-O1m5V_oLQxotw",
    authDomain: "my-shop-3f13c.firebaseapp.com",
    databaseURL: "https://my-shop-3f13c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-shop-3f13c",
    storageBucket: "my-shop-3f13c.firebasestorage.app",
    messagingSenderId: "291411857178",
    appId: "1:291411857178:web:33242ecb444506cbd6e6a3",
    // measurementId: "G-4FQ5MYV2J1"
};
// making a variable for checking loged in or not
// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();
setPersistence(auth, browserSessionPersistence)
    .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return signInWithEmailAndPassword(auth, email, password);
    })
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
    });
document.addEventListener("DOMContentLoaded", function () {
    const authForm = document.getElementById("authForm");
    const mailInput = document.getElementById("mail");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");
    const formTitle = document.getElementById("form-title");
    const submitButton = document.getElementById("submit");
    let isSignup = false; // Tracks whether the user is in login or signup mode

    if (!authForm || !mailInput || !passwordInput || !errorMessage || !formTitle || !submitButton) {
        console.warn("Some required elements are missing in the DOM.");
        return;
    }

    authForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents form from refreshing the page

        const email = mailInput.value.trim();
        const password = passwordInput.value.trim();
        errorMessage.textContent = ""; // Clear previous errors
        if (isSignup) {
            handleSignUp(email, password);
        } else {
            handleLogin(email, password);
        }
    });

    function handleLogin(email, password) {
        console.log("Attempting to log in:", email);
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Login successful!", user);
                window.location.href = "index.html";
            })
            .catch((error) => {
                document.getElementById("error-message").textContent = "Invalid username or password!";
                document.getElementById("error-message").style.color = "red";
                console.error("Login failed:", error.code, error.message);
            });
    }

    // Function to get user data from Firebase Realtime Database
    // function getUserData(userId) {
    //     const dbRef = ref(getDatabase());
    //     get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             console.log(snapshot.val());
    //             return snapshot.exists() ? snapshot.val() : null;
    //         } else {
    //             console.log("No data available");
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // }

    function handleSignUp(email, password) {
        const name = document.getElementById("name").value;
        console.log("Signing up:", email);
        setTimeout(() => {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    return updateProfile(user, { displayName: name })
                        .then(() => {
                            console.log("Display name set successfully:", user.displayName);

                            // Store user data in Firebase Realtime Database
                            writeUserData(user.uid, name, email);
                            alert("Account created!");
                            window.location.reload();
                        })
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    console.error("Login failed:", error.code, errorMessage);
                    document.getElementById("error-message").textContent = "Invalid Mail!";
                    document.getElementById("error-message").style.color = "red";
                    // ..
                });
        }, 1000);
    }

    window.toggleForm = function () {
        isSignup = !isSignup; // Toggle between login and sign-up

        if (isSignup) {
            formTitle.textContent = "Sign Up";
            submitButton.textContent = "Sign Up";
            document.querySelector(".toggle-text").innerHTML =
                `Already have an account? <span onclick="toggleForm()">Login</span>`;
            let form = document.getElementsByTagName("form")[0];
            if (!document.getElementById("name")) {
                let nameInput = document.createElement("input");
                nameInput.type = "text";
                nameInput.id = "name";
                nameInput.placeholder = "Name";
                nameInput.required = true;
                form.insertBefore(nameInput, form.firstChild); // Insert at the top
            }
        } else {
            formTitle.textContent = "Login";
            submitButton.textContent = "Login";
            document.querySelector(".toggle-text").innerHTML =
                `Don't have an account? <span onclick="toggleForm()">Sign Up</span>`;
            let nameInput = document.getElementById("name");
            if (nameInput) {
                nameInput.parentNode.removeChild(nameInput); // Removes the element
            }
        }
    };
});
if (window.location.pathname.endsWith("index.html")) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const db = getDatabase();
            const userRef = ref(db, 'users/' + user.uid);
            document.getElementById("dp").hidden = false;
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    console.log("Fetched user data:", data);

                    let n = data["name"]?.trim(); // Safe optional chaining
                    const g = document.getElementById("dash_name");

                    if (g && n) {
                        g.textContent = "Welcome " + n;
                    }
                } else {
                    console.log("No data found for user:", user.uid);
                }
            });
        } else {
            console.log("User is not logged in.");
        }
    });
}
document.addEventListener("DOMContentLoaded", function () {
    let logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default if inside a form

            const auth = getAuth(); // Ensure `auth` is properly initialized

            signOut(auth)
                .then(() => {
                    console.log("User signed out successfully.");
                    window.location.href = "index.html"; // Redirect after logout
                })
                .catch((error) => {
                    console.error("Error signing out:", error);
                });
        });
    } else {
        console.warn("Logout button not found in the DOM.");
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";  // Show password
                togglePassword.textContent = "🙈"; // Change icon
            } else {
                passwordInput.type = "password";  // Hide password
                togglePassword.textContent = "👁️"; // Change icon back
            }
        });
    }
    else {
        console.warn("Toggle button not found in the DOM.");
    }
});

function writeUserData(userId, name, email) {
    const db = getDatabase();
    set(ref(db, 'users/' + userId), {
        name: name,
        email: email
    })
        .then(() => {
            console.log("User data written successfully!");
        })
        .catch((error) => {
            console.error("Error writing user data:", error);
        });
}
