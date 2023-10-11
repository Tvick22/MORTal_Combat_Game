const audioElement = document.getElementById('background-music');

function changeArea(areaId, musicFile) {
  // Set the source of the audio element to the specified music file
  audioElement.src = `path/to/music/${musicFile}`;

  // Play the audio
  audioElement.play();

  // Optionally, you can add event listeners to control the audio playback
  audioElement.addEventListener('play', () => {
    console.log('Audio is playing');
  });

  audioElement.addEventListener('pause', () => {
    console.log('Audio is paused');
  });

  console.log(`Entered ${areaId}. Music: ${musicFile}`);
}
