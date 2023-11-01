// Define a function to check and update the visible collisions based on the current background 
function updateCollisionsBasedOnBackground() {
    const currentBackgroundId = getCurrentBackgroundId(); // Implement a function to get the current background ID

    // Get all collision zones
    const collisionZones = document.querySelectorAll('[is="collider-zone"]');

    // Iterate through collision zones and hide/show based on the background ID
    collisionZones.forEach((zone) => {
        const backgroundId = zone.getAttribute("backgroundId");
        
        if (backgroundId === currentBackgroundId) {
            zone.style.display = "block";
        } else {
            zone.style.display = "none";
        }
    });
}

// Function to get the current background ID
function getCurrentBackgroundId() {
    // Implement your logic to determine the current background ID (e.g., based on the visible background)
    return "avenidaTown"; // Replace with your logic to retrieve the current background ID
}

// Periodically check and update collisions every few seconds
setInterval(updateCollisionsBasedOnBackground, 5000); // Adjust the time interval as needed (5000 ms = 5 seconds)-->