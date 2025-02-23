document.addEventListener("DOMContentLoaded", () => {
  const dueDate = document.getElementById('due-date');
  const revealButton = document.getElementById('reveal-due-date');
  const guessPrompt = document.getElementById('guess-prompt');
  const genderButtons = document.querySelectorAll('.guess-btn');
  const babySound = document.getElementById('baby-sound');
  const muteButton = document.getElementById('mute-button');
  const loadingScreen = document.getElementById('loading-screen');
  const revealScreen = document.getElementById('reveal-screen');
  const announcementText = document.getElementById('announcement-text');
  const sonogram = document.getElementById('sonogram');
  const mediaControls = document.getElementById('media-controls');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const downloadButton = document.getElementById('download-button');
  const countdownTimer = document.getElementById("countdown-timer");
  const babyDueDate = "July 15th, 2025"; // Replace with your actual date
  const babyDueTime = "00:00:00"; // Update time as desired

  let correctGuessMade = false;
  let dueDateRevealed = false;
  let countdownValue = 5;
  
  // Countdown timer for loading screen
  countdownTimer.textContent = countdownValue;
  const countdownInterval = setInterval(() => {
    countdownValue--;
    if (countdownValue < 0) {
      clearInterval(countdownInterval);
    } else {
      countdownTimer.textContent = countdownValue;
    }
  }, 1000);
  
  if (babySound) {
    dueDate.textContent = babyDueDate;
    
    // Allow audio playback on click
    document.body.addEventListener('click', () => {
      if (babySound.paused) {
        babySound.play().catch((error) => {
          console.error('Audio playback failed (after click):', error);
        });
      }
    });
    
    // After loading delay, reveal main screen and media controls
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      revealScreen.style.display = 'block';
      mediaControls.classList.remove('hidden');
      muteButton.hidden = false;
      try {
        babySound.play().catch((error) => {
          console.warn('Autoplay failed. Waiting for user interaction to play audio.', error);
        });
      } catch (err) {
        console.error('Audio playback failed:', err);
      }
    }, 5000);
  } else {
    console.error('baby-sound element not found');
  }
  
  function triggerFireworks() {
    const fwContainer = document.getElementById('fireworks-container');
    fwContainer.classList.remove('hidden'); // Unhide the fireworks container

    // Initialize the Fireworks effect (using Fireworks.js)
    const fireworks = new Fireworks(fwContainer, {
      speed: 2,
      acceleration: 1.05,
      friction: 0.97,
      hue: { min: 0, max: 360 },
      delay: { min: 15, max: 30 },
      rocketsPoint: 50,
      opacity: 0.5, // Transparent effect
      intensity: 30,
      flickering: 50,
      lineStyle: 'round',
      width: fwContainer.clientWidth,
      height: fwContainer.clientHeight,
    });
    
    fireworks.start();

    // Optionally, stop and hide fireworks after 60 seconds:
    setTimeout(() => {
      fireworks.stop();
      fwContainer.classList.add('hidden');
    }, 60000);
  }
  
  function startDueCountdown() {
    const countdownEl = document.getElementById('due-countdown');
    
    // Remove ordinal from babyDueDate if present.
    const formattedDate = babyDueDate.replace(/(\d+)(st|nd|rd|th)/, "$1");
    const dueDateTimeString = formattedDate + " " + babyDueTime; // e.g., "July 15, 2025 17:00:00"
    const dueDateObj = new Date(dueDateTimeString);
    
    // Check if the date is valid
    if (isNaN(dueDateObj)) {
      console.error("Invalid due date:", dueDateTimeString);
      countdownEl.textContent = "Invalid date";
      return;
    }
    
    countdownEl.classList.remove('hidden');

    function updateCountdown() {
      const now = new Date();
      const diff = dueDateObj - now;
      if (diff <= 0) {
        countdownEl.textContent = "Due Date Countdown: ";
        clearInterval(intervalId);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
  }
  
  function revealDueDate() {
    if (!dueDateRevealed) {
      dueDate.classList.remove('hidden');
      dueDate.classList.add('revealed');
      dueDate.textContent = babyDueDate;
      dueDateRevealed = true;
    }
    revealButton.style.display = 'none';
    revealButton.parentNode.removeChild(revealButton);
    
    if (correctGuessMade) {
      startDueCountdown();
      triggerFireworks();
    }
  }
  revealButton.addEventListener('click', revealDueDate);
  
  // Gender Guessing Game logic
  genderButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (correctGuessMade) return;
      const selectedGender = button.getAttribute('data-gender');
      if (selectedGender === 'Boy') {
        correctGuessMade = true;
        announcementText.innerHTML = `Baby <span class="correct-gender">Boy</span> Cooper arriving <br>`;
        setTimeout(() => {
          button.classList.add('correct-answer');
        }, 500);
        setTimeout(() => {
          genderButtons.forEach(btn => btn.style.display = 'none');
          guessPrompt.style.display = 'none';
          sonogram.src = 'baby_sonogram_show.jpg';
          if (dueDateRevealed) {
            startDueCountdown();
            triggerFireworks();
          }
        }, 1500);
      } else {
        announcementText.innerHTML = `Baby <span class="wrong-gender">${selectedGender}</span> Cooper arriving <br>`;
        announcementText.classList.add('wrong-fade');
        setTimeout(() => {
          announcementText.innerHTML = `Baby ???? Cooper arriving <br>`;
          announcementText.classList.remove('wrong-fade');
          if (!button.classList.contains('wrong-answer')) {
            button.classList.add('wrong-answer');
          }
        }, 1500);
      }
    });
  });
  
  // Audio and mute state restoration
  const isMuted = sessionStorage.getItem('isMuted') === 'true';
  const hasPlayed = sessionStorage.getItem('hasPlayed') === 'true';
  babySound.muted = isMuted;
  muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
  const muteButtonVisible = sessionStorage.getItem('muteButtonVisible') === 'true';
  if (muteButtonVisible) {
    muteButton.hidden = false;
    muteButton.style.display = 'inline-block';
  }
  if (!hasPlayed) {
    babySound.play();
    sessionStorage.setItem('hasPlayed', 'true');
  }
  babySound.addEventListener('canplay', () => {
    muteButton.hidden = false;
    muteButton.style.display = 'inline-block';
    sessionStorage.setItem('muteButtonVisible', true);
  });
  muteButton.addEventListener('click', () => {
    babySound.muted = !babySound.muted;
    muteButton.textContent = babySound.muted ? 'Unmute' : 'Mute';
    sessionStorage.setItem('isMuted', babySound.muted);
  });
  babySound.addEventListener('play', () => {
    muteButton.textContent = babySound.muted ? 'Unmute' : 'Mute';
  });
  
  // Lightbox handling
  sonogram.addEventListener('click', () => {
    lightboxImage.src = sonogram.src;
    lightbox.classList.remove('hidden');
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add('hidden');
    }
  });
  document.querySelector('.magnify-overlay').addEventListener('click', () => {
    lightboxImage.src = sonogram.src;
    lightbox.classList.remove('hidden');
  });
  
  downloadButton.addEventListener('mouseenter', () => {
    const currentImageSrc = sonogram.src;
    downloadButton.href = currentImageSrc;
    downloadButton.download = currentImageSrc.split('/').pop();
  });
  
  downloadButton.addEventListener('click', (e) => {
    e.preventDefault();
    const currentImageSrc = sonogram.src;
    downloadButton.href = currentImageSrc;
    downloadButton.download = currentImageSrc.split('/').pop();
    fetch(downloadButton.href)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch file');
        return response.blob();
      })
      .then((blob) => {
        const blobURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = downloadButton.download;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobURL);
      })
      .catch((error) => console.error('Download failed:', error));
  });
});
