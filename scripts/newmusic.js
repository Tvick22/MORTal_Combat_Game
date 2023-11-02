// Define an object to map background IDs to their corresponding music files
const backgroundMusicMap = {
    housefloor2: '../../../assets/css/music/Banjo_Music.mp3',
    housefloor1: '../../../assets/css/music/Banjo_Music.mp3',
    avenidaTown: '../../../assets/css/music/Avenida_Town_Music.mp3',
    route1: '../../../assets/css/music/Route_Music.mp3',
    academy: '../../../assets/css/music/Academy_Music.mp3',
    lab: '../../../assets/css/music/Academy_Town_Music.mp3',
  };
  
  // Define an object to map background IDs to audio elements
  const backgroundAudioMap = {};
  
  // Initialize audio elements for each background
  for (const backgroundId in backgroundMusicMap) {
    const audio = new Audio(backgroundMusicMap[backgroundId]);
    audio.loop = true;
    backgroundAudioMap[backgroundId] = audio;
  }
  
  // Function to play background music based on the backgroundId
  function playBackgroundMusic(backgroundId) {
    // Pause all audio elements
    for (const id in backgroundAudioMap) {
      backgroundAudioMap[id].pause();
    }
  
    // Play the audio for the specified background
    const audio = backgroundAudioMap[backgroundId];
    audio.muted = false; // Unmute
    audio.play();
  }
  
  // Function to toggle music play/pause
  let isMusicPlaying = false;
  
  function toggleMusic() {
    if (isMusicPlaying) {
      // Pause the music
      for (const id in backgroundAudioMap) {
        backgroundAudioMap[id].pause();
      }
    } else {
      // Play the music for the current background
      const currentBackgroundId = getCurrentBackgroundId(); // Implement this function
      playBackgroundMusic(currentBackgroundId);
    }
  
    isMusicPlaying = !isMusicPlaying;
  }
  
  // Implement getCurrentBackgroundId based on your game logic
  function getCurrentBackgroundId() {
    // Get image elements with class "backgrounImage"
    const backgroundImageElements = document.querySelectorAll('.backgroundImage');
    
    // Loop through the image elements and check which one is visible
    for (const element of backgroundImageElements) {
        if (element.computedStyleMap.display !== 'none') {
            // Extract ID from current background
            return element.id;
        }
    }

    // If none are correct then it will go to the default
    return 'defaultBackground';
  }
  
  // MutationObserver checks for changes in backgroundId
  const targetNode = document.body;
  const config = { attributes: false, childList: true, subtree: true };

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Background ID change so update music
        const currentBackgroundId = getCurrentBackgroundId();
        playBackgroundMusic(currentBackgroundId);
      }
    }
  });

  // Observer target node for changes
  observer.observe(targetNode, config);

  // Add a click event listener to the "Toggle Music" button
  const musicButton = document.getElementById('musicBtn');
  const audioElement = document.getElementById('houseAudio');

  musicButton.addEventListener('click', toggleMusic);
  
  // Start music with initial background
  playBackgroundMusic('housefloor1');