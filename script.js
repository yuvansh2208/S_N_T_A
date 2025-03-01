// Show alert on "Notify Me" button click
document.getElementById("notifyBtn").addEventListener("click", function() {
    alert("You will be notified when NoteTube RED launches!");
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
// Hover effact
const box = document.getElementById("tilt-box");

box.addEventListener("mousemove", (e) => {
    const boxRect = box.getBoundingClientRect();
    const centerX = boxRect.left + boxRect.width / 10;
    const centerY = boxRect.top + boxRect.height / 10;

    // Tilt effect (Increased sensitivity)
    const deltaX = (e.clientX - centerX) / 10; 
    const deltaY = (e.clientY - centerY) / 10; 
    box.style.transform = `rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;

    // Dynamic background effect following cursor
    const mouseX = e.clientX - boxRect.left;
    const mouseY = e.clientY - boxRect.top;

    box.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, 
        rgba(0, 255, 150, 0.4), 
        rgba(10, 10, 10, 0.8))`;
});

box.addEventListener("mouseleave", () => {
    // Reset transform
    box.style.transform = "rotateY(0deg) rotateX(0deg)";

    // Reset background to default
    box.style.background = "linear-gradient(145deg, #0f0f0f, #161616)";
});
