let currentAudio: HTMLAudioElement | null = null;
let currentButton: HTMLButtonElement | null = null;
let currentCandidates: string[] = [];
let currentCandidateIndex = 0;

function setButtonState(button: HTMLButtonElement, state: "idle" | "playing") {
  const title = button.dataset.title ?? "";
  const label = button.dataset.label ?? "clip";
  button.dataset.state = state;
  button.setAttribute("aria-pressed", state === "playing" ? "true" : "false");
  button.setAttribute(
    "aria-label",
    `${state === "playing" ? "Пауза" : "Воспроизвести"} audio: ${title} - ${label}`,
  );
}

function resetCurrent() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentButton) {
    setButtonState(currentButton, "idle");
  }
  currentAudio = null;
  currentButton = null;
  currentCandidates = [];
  currentCandidateIndex = 0;
}

function buildPathCandidates(path: string) {
  // Retry Unicode normalization variants because repository filenames may be in
  // NFD while metadata/path strings are NFC (or vice versa).
  const candidates = [path, path.normalize("NFD"), path.normalize("NFC")];
  return [...new Set(candidates)];
}

function playCard(button: HTMLButtonElement) {
  const clipPath = button.dataset.path!;
  if (currentButton === button && currentAudio && !currentAudio.paused) {
    resetCurrent();
    return;
  }

  resetCurrent();

  currentCandidates = buildPathCandidates(clipPath);
  currentCandidateIndex = 0;

  const audio = new Audio(currentCandidates[currentCandidateIndex]);
  currentAudio = audio;
  currentButton = button;
  setButtonState(button, "playing");

  audio.addEventListener("ended", () => {
    if (currentButton === button) {
      resetCurrent();
    }
  });

  audio.addEventListener("error", () => {
    if (currentButton !== button || currentAudio !== audio) return;

    currentCandidateIndex += 1;
    if (currentCandidateIndex >= currentCandidates.length) {
      resetCurrent();
      return;
    }

    audio.src = currentCandidates[currentCandidateIndex];
    audio.load();
    audio.play().catch(() => {
      resetCurrent();
    });
  });

  audio.play().catch(() => {
    resetCurrent();
  });
}

document.addEventListener("click", (e) => {
  const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
    "button[data-path]",
  );
  if (button) {
    e.preventDefault();
    playCard(button);
  }
});

// Prevent navigation on aria-disabled links
document.addEventListener("click", (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
    'a[aria-disabled="true"]',
  );
  if (link) {
    e.preventDefault();
  }
});
