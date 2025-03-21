// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged, setPersistence, browserSessionPersistence, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
// Your web app's Firebase configuration
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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db_f = getFirestore(app);
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
    let isforget = false;
    let isSignup = false; // Tracks whether the user is in login or signup mode

    if (!authForm || !mailInput || !passwordInput || !errorMessage || !formTitle || !submitButton) {
        console.warn("Some required elements are missing in the DOM.");
        return;
    }

    authForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents form from refreshing the page
        const email = mailInput.value.trim();
        if (isforget) {
            resetPassword(email);
            console.log("Resetting password");
        }
        else {
            const password = passwordInput.value.trim();
            errorMessage.textContent = ""; // Clear previous errors
            if (isSignup) {
                handleSignUp(email, password);
            }
            else {
                handleLogin(email, password);
            }
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
                console.error("Login failed:", error.code);
                if (error.code == "auth/user-not-found") {
                    document.getElementById("error-message").textContent = "No user found with this email.";
                } else if (error.code == "auth/wrong-password") {
                    document.getElementById("error-message").textContent = "Incorrect password.";
                } else if (error.code == "auth/invalid-credential") {
                    document.getElementById("error-message").textContent = "Invalid username or password!";
                }
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
                        })
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    console.error("Login failed:", error.code, errorMessage);
                    if (error.code == "auth/email-already-in-use") {
                        document.getElementById("error-message").textContent = "Email already in use.";
                    }
                });
        }, 1000);
    }
    window.reset_pass = function () {
        isforget = !isforget;
        if (isforget) {
            document.getElementById("mail").placeholder = "Enter your email";
            document.getElementById("password").removeAttribute("required");
            document.getElementById("password").hidden = true;
            document.getElementById("togglePassword").hidden = true;
            document.getElementById("submit").innerHTML = "<b>Reset Password</b>";
            document.getElementById("have_acc").innerHTML = `Remembered my password! <span id="toogle" onclick="reset_pass()"><b>Login</b></span>`;
            document.getElementById("forgot").hidden = true;
            document.getElementById("form-title").innerHTML = "Reset Password";
        }
        else {
            document.getElementById("password").setAttribute("required", "true");
            document.getElementById("mail").placeholder = "Mail";
            document.getElementById("password").hidden = false;
            document.getElementById("togglePassword").hidden = false;
            document.getElementById("submit").innerHTML = "Login";
            document.getElementById("have_acc").innerHTML = `Don't have an account? <span id="toogle" onclick="toggleForm()"><b>Sign Up</b></span>`;
            document.getElementById("forgot").hidden = false;
            document.getElementById("form-title").innerHTML = "Login";
        }
    }
    window.toggleForm = function () {
        isSignup = !isSignup; // Toggle between login and sign-up

        if (isSignup) {
            formTitle.innerHTML = "<b>Sign Up</b>";
            submitButton.innerHTML = "<b>Sign Up</b>";
            document.getElementById("forgot").hidden = true;
            document.getElementById("have_acc").innerHTML = `Already have an account? <span id="toogle" onclick="toggleForm()"><b>Login</b></span>`;
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
            formTitle.innerHTML = "<b>Login</b>";
            submitButton.innerHTML = "<b>Login</b>";
            document.getElementById("forgot").hidden = false;
            document.getElementById("have_acc").innerHTML = `Don't have an account? <span id="toogle" onclick="toggleForm()"><b>Sign Up</b></span>`;
            let nameInput = document.getElementById("name");
            if (nameInput) {
                nameInput.parentNode.removeChild(nameInput); // Removes the element
            }
        }
    };
});
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

async function writeUserData(userId, name, email) {
    try {
        const db = getDatabase();
        await set(ref(db, 'users/' + userId), { name, email });
        await setDoc(doc(db_f, "users", userId), {
            name: name,
            mail: email,
          });
        console.log("User data written successfully!");
    } catch (error) {
        console.error("Error writing user data:", error);
    }
}
async function readUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db_f, "users", userId));
        if (userDoc.exists()) {
            console.log("User Data:", userDoc.data());
        } else {
            console.log("No user found with the given name.");
        }
    } catch (error) {
        console.error("Error reading user data:", error);
    }
}
function resetPassword(email) {
    const auth = getAuth();

    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Password reset email sent!");
            alert("Check your email for password reset instructions.");
        })
        .catch((error) => {
            console.error("Error resetting password:", error.message);
            alert(error.message);
        });
}