// -------------------------------------------------------------
// 1. Galaxy Background Canvas
// -------------------------------------------------------------
const galaxyCanvas = document.getElementById("galaxyCanvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ canvas: galaxyCanvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 3;

const count = 12000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

const colorInside = new THREE.Color("#ff007f");
const colorOutside = new THREE.Color("#00f0ff");

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  const radius = Math.random() * 5;
  const spinAngle = radius * 1.2;
  const branchAngle = ((i % 3) / 3) * Math.PI * 2;

  positions[i3] =
    Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 0.3;
  positions[i3 + 1] = (Math.random() - 0.5) * 0.3;
  positions[i3 + 2] =
    Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 0.3;

  const mixedColor = colorInside.clone().lerp(colorOutside, radius / 5);
  colors[i3] = mixedColor.r;
  colors[i3 + 1] = mixedColor.g;
  colors[i3 + 2] = mixedColor.b;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.012,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
});
const galaxyPoints = new THREE.Points(geometry, material);
scene.add(galaxyPoints);

function animateGalaxy() {
  galaxyPoints.rotation.y += 0.0012;
  renderer.render(scene, camera);
  requestAnimationFrame(animateGalaxy);
}
animateGalaxy();

// -------------------------------------------------------------
// 2. Foreground Flower Shower Animation (Big & Bright)
// -------------------------------------------------------------
const flowerCanvas = document.getElementById("flowerCanvas");
const fCtx = flowerCanvas.getContext("2d");
flowerCanvas.width = window.innerWidth;
flowerCanvas.height = window.innerHeight;

const flowers = [];
const flowerColors = [
  "#ff4d6d",
  "#ff758f",
  "#ffb703",
  "#00f0ff",
  "#f72585",
  "#7209b7",
  "#ffd166",
];

class Flower {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * flowerCanvas.width;
    this.y = Math.random() * -flowerCanvas.height;
    this.size = Math.random() * 8 + 10;
    this.speedY = Math.random() * 2.2 + 1.5;
    this.speedX = Math.random() * 1.5 - 0.75;
    this.color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    this.angle = Math.random() * Math.PI * 2;
    this.spin = Math.random() * 0.05 - 0.025;
  }
  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.y * 0.01) + this.speedX;
    this.angle += this.spin;
    if (this.y > flowerCanvas.height + 30) {
      this.reset();
      this.y = -20;
    }
  }
  draw() {
    fCtx.save();
    fCtx.translate(this.x, this.y);
    fCtx.rotate(this.angle);

    fCtx.shadowBlur = 8;
    fCtx.shadowColor = this.color;
    fCtx.fillStyle = this.color;

    for (let i = 0; i < 5; i++) {
      fCtx.beginPath();
      fCtx.rotate((Math.PI * 2) / 5);
      fCtx.arc(0, this.size / 1.8, this.size / 2.5, 0, Math.PI * 2);
      fCtx.fill();
    }

    fCtx.fillStyle = "#ffffff";
    fCtx.shadowBlur = 4;
    fCtx.shadowColor = "#ffffff";
    fCtx.beginPath();
    fCtx.arc(0, 0, this.size / 3.5, 0, Math.PI * 2);
    fCtx.fill();

    fCtx.restore();
  }
}

for (let i = 0; i < 65; i++) {
  flowers.push(new Flower());
}

function animateFlowers() {
  fCtx.clearRect(0, 0, flowerCanvas.width, flowerCanvas.height);
  flowers.forEach((f) => {
    f.update();
    f.draw();
  });
  requestAnimationFrame(animateFlowers);
}
animateFlowers();

// -------------------------------------------------------------
// 3. Glowing Particle 3D Heart Animation
// -------------------------------------------------------------
const heartCanvas = document.getElementById("heartCanvas");
const hCtx = heartCanvas.getContext("2d");
heartCanvas.width = 280;
heartCanvas.height = 280;

const heartParticles = [];
const heartParticleCount = 450;

for (let i = 0; i < heartParticleCount; i++) {
  const t = (i / heartParticleCount) * Math.PI * 2;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  );

  heartParticles.push({
    baseX: x * 7 + 140,
    baseY: y * 7 + 130,
    x: x * 7 + 140,
    y: y * 7 + 130,
    size: Math.random() * 2.2 + 0.8,
    speed: Math.random() * 0.06 + 0.02,
    offset: Math.random() * Math.PI * 2,
    color: i % 2 === 0 ? "#ff007f" : "#00f0ff",
  });
}

let heartStep = 0;
function animateHeart() {
  hCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
  heartStep += 0.03;

  heartParticles.forEach((p) => {
    const pulse = Math.sin(heartStep + p.offset) * 4;
    p.x = p.baseX + (p.baseX - 140) * 0.05 * pulse;
    p.y = p.baseY + (p.baseY - 130) * 0.05 * pulse;

    hCtx.beginPath();
    hCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    hCtx.fillStyle = p.color;
    hCtx.shadowBlur = 12;
    hCtx.shadowColor = p.color;
    hCtx.fill();
  });

  requestAnimationFrame(animateHeart);
}

// -------------------------------------------------------------
// 4. Card Interactive Functions
// -------------------------------------------------------------
function flipCard(cardElement) {
  cardElement.classList.toggle("flipped");
}

function revealShohagCards() {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("show-card");
    }, index * 350);
  });
}

// -------------------------------------------------------------
// 5. Sequence Controller
// -------------------------------------------------------------
const letters = [
  document.getElementById("l0"),
  document.getElementById("l1"),
  document.getElementById("l2"),
  document.getElementById("l3"),
  document.getElementById("l4"),
];
const hbdText = document.getElementById("hbdText");
const giftBox = document.getElementById("giftBox");

function animateLettersOneByOne(directionClass, delayBetween = 450) {
  letters.forEach((letter, index) => {
    letter.className = "letter " + directionClass;
    setTimeout(() => {
      letter.classList.add("show-letter");
    }, index * delayBetween);
  });
}

function startSequence() {
  giftBox.classList.add("hide");

  setTimeout(() => {
    document.getElementById("heartCanvas").classList.add("show");
    animateHeart();
  }, 400);

  setTimeout(() => {
    hbdText.style.transform = "translateZ(-4000px) scale(0)";
    hbdText.style.opacity = "1";
    setTimeout(() => {
      hbdText.style.transform = "translateZ(0) scale(1)";
    }, 100);
  }, 1000);

  setTimeout(() => {
    animateLettersOneByOne("from-center", 500);
  }, 2500);

  setTimeout(() => {
    letters.forEach((l) => l.classList.remove("show-letter"));
    setTimeout(() => animateLettersOneByOne("from-right", 450), 300);
  }, 7500);

  setTimeout(() => {
    letters.forEach((l) => l.classList.remove("show-letter"));
    setTimeout(() => animateLettersOneByOne("from-left", 450), 300);
  }, 12500);

  setTimeout(() => {
    letters.forEach((l) => l.classList.remove("show-letter"));
    setTimeout(() => animateLettersOneByOne("from-rain", 450), 300);
  }, 17500);

  setTimeout(() => {
    let angle = 0;
    function slowOrbit() {
      angle += 0.015;
      letters.forEach((l, i) => {
        const offset = (i - 2) * 85;
        const x = Math.cos(angle + i) * 190 + offset;
        const z = Math.sin(angle + i) * 220;
        l.style.transition = "none";
        l.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${angle * 40}deg)`;
      });

      if (angle < Math.PI * 1.5) {
        requestAnimationFrame(slowOrbit);
      } else {
        assembleFinalText();
      }
    }
    slowOrbit();
  }, 23000);

  function assembleFinalText() {
    letters.forEach((l) => {
      l.style.transition = "all 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      l.style.transform =
        "translateX(0) translateZ(0) rotateY(0deg) scale(1.1)";
    });

    hbdText.style.transition = "all 1s ease";
    hbdText.style.transform = "scale(1.2) translateY(-10px)";
    hbdText.innerHTML = "✨ HAPPY BIRTHDAY UPOMA ✨";

    setTimeout(() => {
      let wishBanner = document.getElementById("wishBanner");
      if (!wishBanner) {
        wishBanner = document.createElement("div");
        wishBanner.id = "wishBanner";
        wishBanner.className = "wish-banner";
        document
          .getElementById("stage")
          .insertBefore(wishBanner, document.getElementById("cardsWrapper"));
      }
      wishBanner.innerHTML = "💖 May all your dreams come true! 🌸✨";
      wishBanner.classList.add("show");
    }, 1200);

    setTimeout(() => {
      revealShohagCards();
    }, 2500);
  }
}

// Window Resize Logic
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  flowerCanvas.width = window.innerWidth;
  flowerCanvas.height = window.innerHeight;
});
