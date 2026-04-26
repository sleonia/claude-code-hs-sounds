const status = document.getElementById('status') as HTMLElement | null;

let currentAudio: HTMLAudioElement | null = null;
let currentButton: HTMLButtonElement | null = null;

function setButtonState(button: HTMLButtonElement, state: 'idle' | 'playing') {
  button.dataset.state = state;
  button.setAttribute('aria-pressed', state === 'playing' ? 'true' : 'false');
  button.textContent = state === 'playing' ? 'Pause' : button.dataset.label;
}

function resetCurrent() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentButton) {
    setButtonState(currentButton, 'idle');
  }
  currentAudio = null;
  currentButton = null;
}

function playCard(button: HTMLButtonElement) {
  const clipPath = button.dataset.path!;
  const title = button.dataset.title!;
  const label = button.dataset.label!;

  if (currentButton === button && currentAudio && !currentAudio.paused) {
    resetCurrent();
    status!.textContent = `Paused: ${title} (${label})`;
    return;
  }

  resetCurrent();

  const audio = new Audio(clipPath);
  currentAudio = audio;
  currentButton = button;
  setButtonState(button, 'playing');
  status!.textContent = `Playing: ${title} (${label})`;

  audio.addEventListener('ended', () => {
    if (currentButton === button) {
      resetCurrent();
      status!.textContent = `Finished: ${title} (${label})`;
    }
  });

  audio.addEventListener('error', () => {
    if (currentButton === button) {
      resetCurrent();
      status!.textContent = `Could not load audio: ${title} (${label})`;
    }
  });

  audio.play().catch(() => {
    resetCurrent();
    status!.textContent = `Playback was blocked for: ${title} (${label})`;
  });
}

document.addEventListener('click', (e) => {
  const button = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-path]');
  if (button) {
    e.preventDefault();
    playCard(button);
  }
});

// Prevent navigation on aria-disabled links
document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[aria-disabled="true"]');
  if (link) {
    e.preventDefault();
  }
});
