const notes = {
  0: { name: "REST", freq: 0 },
  1: { name: "C4", freq: 261.63 },
  2: { name: "D4", freq: 293.66 },
  3: { name: "E4", freq: 329.63 },
  4: { name: "F4", freq: 349.23 },
  5: { name: "G3", freq: 196.0 },
  6: { name: "A3", freq: 220.0 },
  7: { name: "B3", freq: 246.94 },
};

const songs = {
  0: [
    [3, 1], [2, 1], [1, 1], [2, 1], [3, 1], [3, 1], [3, 2], [0, 1],
    [2, 1], [2, 1], [2, 2], [0, 1], [3, 1], [5, 1], [5, 2], [0, 1],
    [3, 1], [2, 1], [1, 1], [2, 1], [3, 1], [3, 1], [3, 1], [3, 1],
    [2, 1], [2, 1], [3, 1], [2, 1], [1, 3],
  ],
  1: [[5, 1], [6, 1], [7, 1], [1, 1], [2, 1], [3, 1], [4, 2], [0, 1]],
  2: [[5, 4], [0, 1], [5, 4]],
  3: [[1, 1], [3, 1], [5, 1], [3, 2], [0, 1], [1, 2]],
};

const ui = {
  songSelect: document.querySelector("#song-select"),
  tempo: document.querySelector("#tempo"),
  tempoReadout: document.querySelector("#tempo-readout"),
  play: document.querySelector("#play"),
  stop: document.querySelector("#stop"),
  displaySong: document.querySelector("#display-song"),
  displayStep: document.querySelector("#display-step"),
  displayNote: document.querySelector("#display-note"),
  noteReadout: document.querySelector("#note-readout"),
  freqReadout: document.querySelector("#freq-readout"),
  stepReadout: document.querySelector("#step-readout"),
  sequenceCount: document.querySelector("#sequence-count"),
  sequenceGrid: document.querySelector("#sequence-grid"),
  canvas: document.querySelector("#waveform"),
};

let audioContext = null;
let scheduledNodes = [];
let activeRun = null;
let rafId = 0;

function nowSeconds() {
  return Date.now() / 1000;
}

function beatSeconds() {
  return 60 / Number(ui.tempo.value);
}

function selectedSongId() {
  return Number(ui.songSelect.value);
}

function songDuration(sequence, beat) {
  return sequence.reduce((sum, [, beats]) => sum + beats * beat, 0);
}

function locateStep(sequence, beat, elapsed) {
  let cursor = 0;
  for (let i = 0; i < sequence.length; i += 1) {
    const duration = sequence[i][1] * beat;
    if (elapsed < cursor + duration) {
      return { index: i, localTime: elapsed - cursor, duration };
    }
    cursor += duration;
  }
  return { index: sequence.length - 1, localTime: 0, duration: 1 };
}

function clearAudio() {
  scheduledNodes.forEach((node) => {
    try {
      node.stop();
    } catch {
      // Node may already have stopped.
    }
  });
  scheduledNodes = [];
}

function scheduleSong(songId, beat) {
  const sequence = songs[songId];
  let t = audioContext.currentTime + 0.05;
  sequence.forEach(([noteId, beats]) => {
    const note = notes[noteId];
    const duration = beats * beat;
    if (note.freq > 0) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "square";
      osc.frequency.value = note.freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.09, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(duration - 0.02, 0.02));
      osc.connect(gain).connect(audioContext.destination);
      osc.start(t);
      osc.stop(t + duration);
      scheduledNodes.push(osc);
    }
    t += duration;
  });
  return t;
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = ui.canvas.getBoundingClientRect();
  ui.canvas.width = Math.round(rect.width * ratio);
  ui.canvas.height = Math.round(rect.height * ratio);
}

function drawWaveform(noteId, elapsed, localTime, duration) {
  const ctx = ui.canvas.getContext("2d");
  const width = ui.canvas.width;
  const height = ui.canvas.height;
  const note = notes[noteId];
  const mid = height * 0.52;
  const amp = height * 0.24;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#080a0b";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#24313a";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += width / 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = height * 0.2; y < height; y += height * 0.2) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = note.freq > 0 ? "#39d98a" : "#ffbe55";
  ctx.lineWidth = Math.max(2, width / 520);
  ctx.beginPath();

  const visibleSeconds = Math.min(0.12, Math.max(duration, 0.03));
  const samples = 340;
  for (let i = 0; i <= samples; i += 1) {
    const x = (i / samples) * width;
    const t = localTime + (i / samples) * visibleSeconds;
    let y = mid;
    if (note.freq > 0) {
      const phase = (t * note.freq) % 1;
      y = phase < 0.5 ? mid - amp : mid + amp;
    }
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = "#a7b0a9";
  ctx.font = `${Math.max(12, width / 70)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.fillText(`t=${elapsed.toFixed(2)}s`, 18, 28);
  ctx.fillText(note.freq > 0 ? `${note.name} ${note.freq.toFixed(2)}Hz` : "REST", 18, 52);
}

function renderSequence(activeIndex = -1) {
  const songId = selectedSongId();
  const sequence = songs[songId];
  ui.sequenceGrid.innerHTML = "";
  ui.sequenceCount.textContent = `${sequence.length} notes`;
  sequence.forEach(([noteId, beats], index) => {
    const cell = document.createElement("div");
    cell.className = `step${index === activeIndex ? " active" : ""}`;
    cell.innerHTML = `
      <div class="step-index">${String(index).padStart(2, "0")}</div>
      <div class="step-note">${notes[noteId].name}</div>
      <div class="step-beats">${beats} beat${beats === 1 ? "" : "s"}</div>
    `;
    ui.sequenceGrid.appendChild(cell);
  });
}

function updateReadouts(songId, stepIndex, noteId) {
  const note = notes[noteId];
  ui.displaySong.textContent = String(songId);
  ui.displayStep.textContent = String(stepIndex).padStart(2, "0");
  ui.displayNote.textContent = String(noteId);
  ui.noteReadout.textContent = note.name;
  ui.freqReadout.textContent = `${note.freq.toFixed(2)} Hz`;
  ui.stepReadout.textContent = String(stepIndex);
}

function stop() {
  clearAudio();
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  activeRun = null;
  updateReadouts(selectedSongId(), 0, 0);
  renderSequence(-1);
  drawWaveform(0, 0, 0, 1);
}

async function play() {
  stop();

  const songId = selectedSongId();
  const beat = beatSeconds();
  const sequence = songs[songId];
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  const hasAudio = Boolean(AudioCtor);
  let startAt = nowSeconds() + 0.05;
  let endsAt = startAt + songDuration(sequence, beat);

  if (hasAudio) {
    audioContext ||= new AudioCtor();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    startAt = audioContext.currentTime + 0.05;
    endsAt = scheduleSong(songId, beat);
  }

  activeRun = { songId, sequence, beat, startAt, endsAt, hasAudio };

  function tick() {
    if (!activeRun) return;
    const clock = activeRun.hasAudio ? audioContext.currentTime : nowSeconds();
    const elapsed = Math.max(0, clock - activeRun.startAt);
    const total = songDuration(activeRun.sequence, activeRun.beat);
    if (elapsed >= total) {
      stop();
      return;
    }

    const step = locateStep(activeRun.sequence, activeRun.beat, elapsed);
    const [noteId] = activeRun.sequence[step.index];
    updateReadouts(activeRun.songId, step.index, noteId);
    renderSequence(step.index);
    drawWaveform(noteId, elapsed, step.localTime, step.duration);
    rafId = requestAnimationFrame(tick);
  }

  tick();
}

ui.play.addEventListener("click", play);
ui.stop.addEventListener("click", stop);
ui.songSelect.addEventListener("change", () => {
  stop();
  renderSequence(-1);
});
ui.tempo.addEventListener("input", () => {
  ui.tempoReadout.textContent = `${ui.tempo.value} bpm`;
});
window.addEventListener("resize", () => {
  resizeCanvas();
  drawWaveform(0, 0, 0, 1);
});

resizeCanvas();
renderSequence(-1);
updateReadouts(0, 0, 0);
drawWaveform(0, 0, 0, 1);
