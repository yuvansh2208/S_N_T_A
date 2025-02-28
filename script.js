// Show alert on "Notify Me" button click
document.getElementById("notifyBtn").addEventListener("click", function() {
    alert("You will be notified when CodeHelp RED launches!");
});

// Toggle Explore dropdown menu
document.getElementById("exploreBtn").addEventListener("click", function(event) {
    event.preventDefault();
    let dropdown = document.getElementById("dropdownMenu");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// Close dropdown if clicked outside
document.addEventListener("click", function(event) {
    let dropdown = document.getElementById("dropdownMenu");
    let exploreBtn = document.getElementById("exploreBtn");
    if (!exploreBtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "none";
    }
});

// Change navbar background on scroll
window.addEventListener("scroll", function() {
    let navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});
