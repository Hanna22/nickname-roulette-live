const players = {
  Juman: ["Juju on the beat", "Jumax", "Burjuman", "Jumpman"],
  Lara: ["Tannoura", "Yara", "Lana", "Sara"]
};

const colors = ["#ff6948", "#ffd84d", "#70d6b3", "#72a6ff"];
const canvas = document.querySelector("#wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.querySelector("#spinButton");
const result = document.querySelector("#result");
const resultName = document.querySelector("#resultName");
const playerButtons = [...document.querySelectorAll(".player")];
const confettiBox = document.querySelector("#confetti");

let currentPlayer = "Juman";
let rotation = 0;
let spinning = false;

function drawWheel() {
  const names = players[currentPlayer];
  const center = canvas.width / 2;
  const radius = center - 6;
  const slice = (Math.PI * 2) / names.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  names.forEach((name, index) => {
    const start = index * slice - Math.PI / 2;
    const end = start + slice;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[index];
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#18251f";
    ctx.stroke();

    ctx.save();
    ctx.translate(center, center);
    const textAngle = start + slice / 2;
    const needsFlip = Math.cos(textAngle) < 0;
    ctx.rotate(textAngle);
    if (needsFlip) ctx.rotate(Math.PI);
    ctx.textAlign = needsFlip ? "left" : "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#18251f";
    ctx.font = `700 ${name.length > 13 ? 28 : 34}px DM Sans`;
    ctx.fillText(name, needsFlip ? -radius + 30 : radius - 30, 0);
    ctx.restore();
  });
}

function celebrate() {
  const palette = [...colors, "#ff8db3"];
  for (let i = 0; i < 65; i += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = palette[i % palette.length];
    piece.style.setProperty("--drift", `${Math.random() * 240 - 120}px`);
    piece.style.animationDelay = `${Math.random() * .35}s`;
    piece.style.borderRadius = Math.random() > .5 ? "50%" : "2px";
    confettiBox.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function spin() {
  if (spinning) return;
  spinning = true;
  spinButton.disabled = true;
  result.classList.remove("pop");
  resultName.textContent = "The wheel is deciding…";

  const names = players[currentPlayer];
  const winnerIndex = Math.floor(Math.random() * names.length);
  const segmentDegrees = 360 / names.length;
  const targetWithinSegment = winnerIndex * segmentDegrees + segmentDegrees / 2;
  const currentNormalized = ((rotation % 360) + 360) % 360;
  const desiredNormalized = (360 - targetWithinSegment) % 360;
  const extra = (desiredNormalized - currentNormalized + 360) % 360;
  rotation += 360 * (5 + Math.floor(Math.random() * 2)) + extra;

  canvas.style.transition = "transform 4.2s cubic-bezier(.12,.72,.12,1)";
  canvas.style.transform = `rotate(${rotation}deg)`;

  window.setTimeout(() => {
    resultName.textContent = `${currentPlayer}, you are… ${names[winnerIndex]}!`;
    result.classList.add("pop");
    celebrate();
    spinning = false;
    spinButton.disabled = false;
  }, 4300);
}

playerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (spinning || button.dataset.player === currentPlayer) return;
    currentPlayer = button.dataset.player;
    playerButtons.forEach((item) => item.classList.toggle("active", item === button));
    rotation = 0;
    canvas.style.transition = "none";
    canvas.style.transform = "rotate(0deg)";
    result.classList.remove("pop");
    resultName.textContent = `Ready for you, ${currentPlayer}!`;
    drawWheel();
  });
});

spinButton.addEventListener("click", spin);
drawWheel();
