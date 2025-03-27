import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged, setPersistence, browserSessionPersistence, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        const db = getDatabase();
        const userRef = ref(db, 'users/' + user.uid);
        // document.getElementById("dp").hidden = false;
        // document.getElementById("dash_div").classList.remove("hover:text-blue-500");
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Fetched user data:", data);

                let n = data["name"]?.trim(); // Safe optional chaining
                const g = document.getElementById("dash_name");
                // g.removeAttribute("href"); // write here for working of dashboard and name
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
function changeColor(buttonId) {
    document.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('bg-blue-800');
        btn.classList.add('bg-blue-400');
    });
    document.getElementById(buttonId).classList.add('bg-blue-800');
}

// Sidebar Toggle Functionality
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const toggleSidebarButton = document.getElementById('toggleSidebar');
const closeSidebarButton = document.getElementById('closeSidebar');

toggleSidebarButton.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
    sidebarOverlay.classList.remove('hidden');
});

closeSidebarButton.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
});

// Click outside sidebar to close
sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
});