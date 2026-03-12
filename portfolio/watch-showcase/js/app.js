/* ============================================
   IWC Portugieser — Scroll-Driven Experience
   ============================================ */

const FRAME_COUNT = 121;
const FRAME_SPEED = 1.0;
const IMAGE_SCALE = 0.38;
const FRAME_PATH = "frames/frame_";
const FRAME_EXT = ".png";

const frames = [];
let currentFrame = -1;
let bgColor = "#f5f5f5";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWrap = document.getElementById("canvas-wrap");
const heroSection = document.getElementById("hero");
const scrollContainer = document.getElementById("scroll-container");
const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loader-bar");
const loaderPercent = document.getElementById("loader-percent");
const marqueeWrap = document.getElementById("marquee-wrap");
const darkOverlay = document.getElementById("dark-overlay");

/* ---- Utilities ---- */

function pad(n) {
  return String(n).padStart(4, "0");
}

/* ---- Canvas ---- */

function sizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
}

function drawFrame(index) {
  const img = frames[index];
  if (!img) return;

  const dpr = window.devicePixelRatio || 1;
  const vw = canvas.width / dpr;
  const vh = canvas.height / dpr;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, vw, vh);

  // Right-aligned, smaller
  const scale = Math.max(vw / iw, vh / ih) * IMAGE_SCALE;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = vw - dw - (vw * 0.06);
  const dy = (vh - dh) / 2;

  ctx.drawImage(img, dx, dy, dw, dh);
}

/* ---- Preloader (Two-Phase) ---- */

function preloadFrames() {
  return new Promise((resolve) => {
    let loaded = 0;
    const total = FRAME_COUNT;

    function onLoaded(i, img) {
      frames[i] = img;
      loaded++;
      const pct = Math.round((loaded / total) * 100);
      loaderBar.style.width = pct + "%";
      loaderPercent.textContent = pct;

      if (loaded === total) resolve();
    }

    // Phase 1: first 10 frames
    for (let i = 0; i < Math.min(10, total); i++) {
      const img = new Image();
      img.src = `${FRAME_PATH}${pad(i + 1)}${FRAME_EXT}`;
      img.onload = () => onLoaded(i, img);
      img.onerror = () => { loaded++; if (loaded === total) resolve(); };
    }

    // Phase 2: remaining frames
    for (let i = 10; i < total; i++) {
      const img = new Image();
      img.src = `${FRAME_PATH}${pad(i + 1)}${FRAME_EXT}`;
      img.onload = () => onLoaded(i, img);
      img.onerror = () => { loaded++; if (loaded === total) resolve(); };
    }
  });
}

function hideLoader() {
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
  }, 800);
}

/* ---- Lenis Smooth Scroll ---- */

let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.5,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---- Hero Circle-Wipe ---- */

function initHeroTransition() {
  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress;
      heroSection.style.opacity = Math.max(0, 1 - p * 15);
      const wipeProgress = Math.min(1, Math.max(0, (p - 0.005) / 0.06));
      const radius = wipeProgress * 78;
      canvasWrap.style.clipPath = `circle(${radius}% at 72% 50%)`;
    }
  });
}

/* ---- Frame-to-Scroll Binding ---- */

function initFrameScroll() {
  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
    onUpdate: (self) => {
      const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
      const index = Math.min(Math.floor(accelerated * FRAME_COUNT), FRAME_COUNT - 1);
      if (index !== currentFrame) {
        currentFrame = index;
        requestAnimationFrame(() => drawFrame(currentFrame));
      }
    }
  });
}

/* ---- Section Animations ---- */

function initSections() {
  const sections = document.querySelectorAll(".scroll-section");
  const containerHeight = scrollContainer.offsetHeight;

  sections.forEach((section) => {
    const enter = parseFloat(section.dataset.enter) / 100;
    const leave = parseFloat(section.dataset.leave) / 100;
    const type = section.dataset.animation;
    const persist = section.dataset.persist === "true";

    // Position at midpoint
    const midpoint = ((enter + leave) / 2) * containerHeight;
    section.style.top = midpoint + "px";
    section.style.transform = "translateY(-50%)";

    // Build animation timeline
    const children = section.querySelectorAll(
      ".section-label, .section-heading, .section-body, .section-note, .cta-button, .stat"
    );

    const tl = gsap.timeline({ paused: true });

    switch (type) {
      case "fade-up":
        tl.from(children, { y: 50, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" });
        break;
      case "slide-left":
        tl.from(children, { x: -80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" });
        break;
      case "slide-right":
        tl.from(children, { x: 80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" });
        break;
      case "scale-up":
        tl.from(children, { scale: 0.85, opacity: 0, stagger: 0.12, duration: 1.0, ease: "power2.out" });
        break;
      case "rotate-in":
        tl.from(children, { y: 40, rotation: 3, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" });
        break;
      case "stagger-up":
        tl.from(children, { y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" });
        break;
      case "clip-reveal":
        tl.from(children, { clipPath: "inset(100% 0 0 0)", opacity: 0, stagger: 0.15, duration: 1.2, ease: "power4.inOut" });
        break;
    }

    // Scroll-driven show/hide with smooth fade
    const fadeRange = 0.03;

    ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        let opacity = 0;

        if (p >= enter && p <= leave) {
          // Fade in over the first portion of the range
          const fadeInEnd = enter + fadeRange;
          const fadeOutStart = leave - fadeRange;

          if (p < fadeInEnd) {
            opacity = (p - enter) / fadeRange;
          } else if (p > fadeOutStart && !persist) {
            opacity = (leave - p) / fadeRange;
          } else {
            opacity = 1;
          }

          section.style.opacity = String(Math.max(0, Math.min(1, opacity)));
          section.style.pointerEvents = "auto";
          tl.play();
        } else if (persist && p > leave) {
          section.style.opacity = "1";
          section.style.pointerEvents = "auto";
        } else {
          section.style.opacity = "0";
          section.style.pointerEvents = "none";
          tl.reverse();
        }
      }
    });
  });
}

/* ---- Dark Overlay ---- */

function initDarkOverlay(enter, leave) {
  const fadeRange = 0.04;

  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress;
      let opacity = 0;

      if (p >= enter - fadeRange && p <= enter) {
        opacity = (p - (enter - fadeRange)) / fadeRange;
      } else if (p > enter && p < leave) {
        opacity = 0.9;
      } else if (p >= leave && p <= leave + fadeRange) {
        opacity = 0.9 * (1 - (p - leave) / fadeRange);
      }

      darkOverlay.style.opacity = opacity;
    }
  });
}

/* ---- Marquee ---- */

function initMarquee() {
  const textEl = marqueeWrap.querySelector(".marquee-text");

  gsap.to(textEl, {
    xPercent: -25,
    ease: "none",
    scrollTrigger: {
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5
    }
  });

  // Fade in/out around the middle sections
  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress;
      let opacity = 0;

      if (p >= 0.28 && p < 0.32) {
        opacity = (p - 0.28) / 0.04;
      } else if (p >= 0.32 && p <= 0.48) {
        opacity = 1;
      } else if (p > 0.48 && p <= 0.52) {
        opacity = 1 - (p - 0.48) / 0.04;
      }

      marqueeWrap.style.opacity = opacity;
    }
  });
}

/* ---- Counter Animations ---- */

function initCounters() {
  document.querySelectorAll(".stat-number").forEach((el) => {
    const target = parseFloat(el.dataset.value);
    const decimals = parseInt(el.dataset.decimals || "0");
    const section = el.closest(".scroll-section");
    const enter = parseFloat(section.dataset.enter) / 100;

    let animated = false;

    ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: false,
      onUpdate: (self) => {
        if (self.progress >= enter && !animated) {
          animated = true;
          gsap.fromTo(el,
            { textContent: 0 },
            {
              textContent: target,
              duration: 2.2,
              ease: "power1.out",
              snap: { textContent: decimals === 0 ? 1 : 0.01 },
              onUpdate: function () {
                const val = parseFloat(el.textContent);
                if (decimals === 0) {
                  el.textContent = Math.round(val).toLocaleString();
                } else {
                  el.textContent = val.toFixed(decimals);
                }
              }
            }
          );
        } else if (self.progress < enter && animated) {
          animated = false;
          el.textContent = "0";
        }
      }
    });
  });
}

/* ---- Hero Word Animation ---- */

function animateHero() {
  const words = document.querySelectorAll(".hero-heading .word");
  const label = document.querySelector(".hero-label");
  const tagline = document.querySelector(".hero-tagline");
  const indicator = document.querySelector(".scroll-indicator");

  const tl = gsap.timeline({ delay: 0.4 });

  tl.from(label, { y: 20, opacity: 0, duration: 0.9, ease: "power3.out" })
    .from(words, { y: 100, opacity: 0, stagger: 0.18, duration: 1.1, ease: "power3.out" }, "-=0.5")
    .from(tagline, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
    .from(indicator, { opacity: 0, y: 10, duration: 0.6, ease: "power2.out" }, "-=0.2");
}

/* ---- Resize Handler ---- */

function onResize() {
  sizeCanvas();
  if (currentFrame >= 0) {
    drawFrame(currentFrame);
  }
}

/* ---- Init ---- */

async function main() {
  sizeCanvas();
  window.addEventListener("resize", onResize);

  await preloadFrames();

  hideLoader();
  drawFrame(0);

  initLenis();
  initHeroTransition();
  initFrameScroll();
  initSections();
  initDarkOverlay(0.54, 0.70);
  initMarquee();
  initCounters();
  animateHero();
}

document.addEventListener("DOMContentLoaded", main);
