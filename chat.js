import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged, setPersistence, browserSessionPersistence, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, set, get, child, onValue, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
const auth = getAuth();
const db = getDatabase();
// Rendering the profile name of logged in user ----------------------------------------------------------------------
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = ref(db, 'users/' + user.uid);
        // document.getElementById("dp").hidden = false;
        // document.getElementById("dash_div").classList.remove("hover:text-blue-500");
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // console.log("Fetched user data:", data);

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
// Rendering the profile name of logged in user ----------------------------------------------------------------------


// Sidebar Toggle Functionality----------------------------------------------------------------------------------------
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
// Sidebar Toggle Functionality----------------------------------------------------------------------------------------

// Request functionality ----------------------------------------------------------------------------------------------
const popupTrigger = document.getElementById('popupTrigger');
const popup = document.getElementById('popup');
const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
// const popupButton = document.getElementById('popupButton');
const requestsList = document.getElementById('requestsList');
const noRequestsMessage = document.getElementById('noRequestsMessage');

// Sample requests data (you can modify this)
const requests = [
    {
        id: 1,
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
        id: 2,
        name: 'Jane Smith',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
];

// Function to render requests
function renderRequests() {
    // Clear previous content
    requestsList.innerHTML = '';

    if (requests.length === 0) {
        // Show no requests message
        const noRequestsMsg = document.createElement('p');
        noRequestsMsg.textContent = 'No Requests';
        noRequestsMsg.classList.add('text-gray-500', 'text-center');
        requestsList.appendChild(noRequestsMsg);
        return;
    }

    // Render requests
    requests.forEach(request => {
        const requestItem = document.createElement('div');
        requestItem.classList.add(
            'flex', 'items-center', 'justify-between',
            'p-3', 'bg-gray-100', 'rounded-lg', 'mb-2'
        );

        requestItem.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <img 
                            src="${request.avatar}" 
                            alt="${request.name}" 
                            class="w-10 h-10 rounded-full"
                        >
                        <span class="font-medium">${request.name}</span>
                    </div>
                    <div class="space-x-2">
                        <button 
                            class="accept-btn bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            data-id="${request.id}"
                        >
                            Accept
                        </button>
                        <button 
                            class="reject-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            data-id="${request.id}"
                        >
                            Reject
                        </button>
                    </div>
                `;

        requestsList.appendChild(requestItem);
    });

    // Add event listeners for accept/reject buttons
    document.querySelectorAll('.accept-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const requestId = parseInt(this.getAttribute('data-id'));
            acceptRequest(requestId);
        });
    });

    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const requestId = parseInt(this.getAttribute('data-id'));
            rejectRequest(requestId);
        });
    });
}

// Function to accept a request
function acceptRequest(requestId) {
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
        console.log(`Accepted request from ${requests[index].name}`);
        requests.splice(index, 1);
        renderRequests();
    }
}

// Function to reject a request
function rejectRequest(requestId) {
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
        console.log(`Rejected request from ${requests[index].name}`);
        requests.splice(index, 1);
        renderRequests();
    }
}

// Open popup
popupTrigger.addEventListener('click', () => {
    popup.style.display = 'block';
    popupOverlay.style.display = 'block';
    renderRequests();
});

// Close popup
popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
});

// Close popup when clicking outside
popupOverlay.addEventListener('click', () => {
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
});

// Close popup with Okay button
// Request functionality ----------------------------------------------------------------------------------------------

// Add friends functionality ----------------------------------------------------------------------------------------------
const addFriendsSpan = document.getElementById('add-friends-popup');
const popup_add = document.getElementById('in_popup');
const popupOverlay_add = document.getElementById('popup-overlay');
const popupCloseBtn = document.getElementById('popupAddClose');
const searchInput = document.getElementById('searchUser');
const contactList = document.getElementById('contactList');

//Function search on database by mail
// Sample contacts data
let contacts = [];
function searchByEmail(email) {
    const emailQuery = query(
        ref(db, 'users'),
        orderByChild('email'),
        equalTo(email)
    );
    // Listen for the query results
    onValue(emailQuery, (snapshot) => {
        if (snapshot.exists()) {
            // Log the user(s) found with this email
            snapshot.forEach((childSnapshot) => {
                const userId = childSnapshot.key;
                const userData = childSnapshot.val();
                // console.log('User found:', {
                //     id: userId,
                //     name: userData.name,
                //     email: userData.email
                // });
                const contactExists = contacts.some(contact => contact.id === userId);
                if (contactExists) {
                    console.log("Contact already exists");
                    return;
                }
                else {
                    contacts.push({
                        id: userId,
                        name: userData.name,
                        email: userData.email,
                        avatar: 'generic-user-icon-9.jpg',
                        added: false
                    });
                }
            });
        } else {
            console.log('No user found with this email');
        }
    }, (error) => {
        console.error('Error searching for email:', error);
    });
}

// Function to render contacts
function renderContacts(filteredContacts) {
    contactList.innerHTML = '';
    filteredContacts.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.classList.add('flex', 'items-center', 'space-x-3', 'p-2', 'hover:bg-gray-200', 'rounded', 'cursor-pointer');
        contactItem.innerHTML = `
        <img src="${contact.avatar}" alt="${contact.name}" class="w-10 h-10 rounded-full">
        <span class="font-medium flex-grow">${contact.name}</span>
        <span 
        class="text-xl text-green-500 font-bold add-friend-btn" 
        data-id="${contact.id}"
        >
        ${contact.added ? '✓' : '+'}
        </span>
        `;
        contactList.appendChild(contactItem);
    });

    // Add event listeners to all add friend buttons
    document.querySelectorAll('.add-friend-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const contactId = this.getAttribute('data-id');
            addFriend(contactId);
        });
    });
    console.log('rendered contact');
}

// Function to add a friend
function addFriend(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (contact && !contact.added) {
        contact.added = true;
        // You can add your actual friend addition logic here
        console.log(`Added ${contact.name} as a friend`);

        // Rerender to update the UI
        renderContacts(searchInput.value);
    }
}

// Function to filter contacts based on search input
function getFilteredContacts(searchTerm) {
    return contacts.filter(contact =>
        contact.email.includes(searchTerm)
    );
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    searchByEmail(searchTerm);
    const filteredContacts = getFilteredContacts(searchTerm);
    if (searchTerm.trim() === '') {
        // If input is empty, clear the contact list
        // contactList.innerHTML = '';
    } else if (filteredContacts.length === 0) {
        // If no contacts match the search, display a message
        contactList.innerHTML = `<p class="text-center text-gray-500">No User found</p>`;
    } else {
        // Filter and render contacts based on search term
        renderContacts(filteredContacts);
    }
});
// Open popup
addFriendsSpan.addEventListener('click', () => {
    popup_add.style.display = 'block';
    popupOverlay_add.style.display = 'block';
});

// Close popup
popupCloseBtn.addEventListener('click', () => {
    popup_add.style.display = 'none';
    popupOverlay_add.style.display = 'none';
    document.getElementById('searchUser').value = '';
    contactList.innerHTML = '';
});

// Close popup when clicking outside
popupOverlay.addEventListener('click', () => {
    popup_add.style.display = 'none';
    popupOverlay_add.style.display = 'none';
});
// Add friends functionality ----------------------------------------------------------------------------------------------
