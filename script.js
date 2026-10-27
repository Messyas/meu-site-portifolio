const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const langToggle = document.querySelector(".lang-toggle");
const langFlag = document.querySelector(".lang-flag");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const descriptionMeta = document.querySelector('meta[name="description"]');
const copyButton = document.querySelector("[data-copy-email]");
const copyLabel = copyButton?.querySelector("[data-i18n]");

/* ---------- Preferências (localStorage pode falhar) ---------- */

const store = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* o site continua funcionando sem storage */
    }
  },
};

/* ---------- Traduções (o HTML já vem em português) ---------- */

const en = {
  skip: "Skip to content",
  menu: "Open menu",
  navProjects: "Projects",
  navStack: "Stack",
  navPath: "Path",
  navContact: "Contact",
  treeHome: "Home",
  ctaTalk: "Contact",
  role: "Fullstack Dev · Intelligent Agents &amp; Automation",
  base: "Base",
  localTime: "Local time",
  bio: 'Fullstack dev in <a class="elo" href="#trajetoria">Manaus</a>, building intelligent agents and automation. I\'m currently on an LG project focused on automation and AI agents, and I study hyperautomation at <a class="elo" href="#trajetoria">AX Academy</a>. Before that, I was Scrum Master for <a class="elo" href="#projetos">MotoMatch</a> at <a class="elo" href="#trajetoria">Web Academy</a> (UFAM × Motorola) and presented a paper at <a class="elo" href="#trajetoria">CBIC 2025</a>.',

  projectsTitle: "What I build",
  p1Desc:
    "A platform (QualCel AI) that analyzes real e-commerce reviews to extract sentiment and, from a priorities quiz, recommends the ideal Motorola smartphone. I was the Scrum Master.",
  p2Desc:
    "A 2D adventure RPG for Android, built in the Mobile 2D Game Prototyping course of Projeto Aranouá (IFAM). Cute, relaxing atmosphere: a duo of adventurers explores forests and fights monsters.",
  alsoBuilt: "Also built",
  seeAll: "See all",
  m1Type: "Vision",
  m1Desc:
    "A gate that detects plates with YOLO, reads the characters via OCR and registers the vehicle on its own.",
  m2Desc:
    "Weather alerts over Telegram, built with AWS Lambda, Cognito login and a Next.js dashboard.",
  m3Title: "Macroplastics detection",
  m3Type: "Paper",
  m3Desc:
    "CBIC 2025 paper (UFMG): a model ensemble to find plastic waste in Manaus streams.",
  m4Type: "AI",
  m4Desc:
    "A Python module for retrieval and agent-driven investigation, with local models.",
  m5Desc:
    '"A journal for the lazy": an organization app with skills, MCPs and agents.',
  m6Type: "Audio",
  m6Desc:
    "A real-time voice processor for Windows, written in C++20 and 100% local.",

  pathTitle: "Path",
  colExp: "Experience",
  colEdu: "Education &amp; research",
  e1Title: "Full Stack · Scrum Master",
  e1Type: "R&amp;D project",
  e2Title: "Intelligent vehicle access control",
  e2Type: "Project",
  e3Title: "2D mobile game · Amazon Mages",
  e3Type: "Prototyping course",
  e4Title: "Smart waste map",
  f1Title: "Hyperautomation and intelligent agents",
  f1Type: "Hands-on training",
  f1Date: "2026 - current",
  f2Title: "Macroplastics detection with a deep learning ensemble",
  f2Type: "Paper presented",
  g1Title: "Systems Analysis and Development",
  g1Type: "Bachelor's degree",
  g1Date: "Graduated",

  contactLead: "Open to conversations about intelligent agents, automation and AI projects.",
  copy: "Copy email",
  backToTop: "Back to top",
};

const extra = {
  pt: {
    copied: "Copiado ✓",
    select: "Selecione",
    title: "Messyas Gois França — Dev Fullstack",
    description:
      "Portfólio de Messyas Gois França, dev fullstack em Manaus: agentes inteligentes, automação e IA.",
    htmlLang: "pt-BR",
    flag: "🇺🇸",
    flagTitle: "English",
    themeLight: "Mudar para tema claro",
    themeDark: "Mudar para tema escuro",
    nav: "Navegação principal",
  },
  en: {
    copied: "Copied ✓",
    select: "Select",
    title: "Messyas Gois França — Fullstack Dev",
    description:
      "Portfolio of Messyas Gois França, fullstack dev in Manaus: intelligent agents, automation and AI.",
    htmlLang: "en",
    flag: "🇧🇷",
    flagTitle: "Português",
    themeLight: "Switch to light theme",
    themeDark: "Switch to dark theme",
    nav: "Main navigation",
  },
};

// guarda o texto original (português) de cada elemento traduzível
const i18nNodes = [...document.querySelectorAll("[data-i18n]")];
const ptOriginal = {};
i18nNodes.forEach((el) => {
  ptOriginal[el.dataset.i18n] ??= el.innerHTML.trim().replace(/\s+/g, " ");
});
const ariaNodes = [...document.querySelectorAll("[data-i18n-aria]")];
const ptAria = Object.fromEntries(
  ariaNodes.map((el) => [el.dataset.i18nAria, el.getAttribute("aria-label")]),
);

let lang =
  store.get("portfolio-language") ||
  (navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en");
if (lang !== "pt" && lang !== "en") lang = "pt";

function applyLanguage(next, persist = false) {
  lang = next;
  const dict = lang === "en" ? en : ptOriginal;
  const meta = extra[lang];

  root.lang = meta.htmlLang;
  document.title = meta.title;
  descriptionMeta?.setAttribute("content", meta.description);

  i18nNodes.forEach((el) => {
    const value = dict[el.dataset.i18n];
    if (value !== undefined) el.innerHTML = value;
  });
  ariaNodes.forEach((el) => {
    const key = el.dataset.i18nAria;
    el.setAttribute("aria-label", lang === "en" ? en[key] : ptAria[key]);
  });

  langFlag.textContent = meta.flag;
  langToggle.title = meta.flagTitle;
  langToggle.setAttribute("aria-label", meta.flagTitle);
  document.querySelector(".nav").setAttribute("aria-label", meta.nav);
  applyTheme(root.dataset.theme || "dark");

  if (persist) store.set("portfolio-language", lang);
}

/* ---------- Tema ---------- */

function applyTheme(theme, persist = false) {
  root.dataset.theme = theme;
  themeColorMeta?.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#f5f4f0");
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? extra[lang].themeLight : extra[lang].themeDark,
  );
  if (persist) store.set("portfolio-theme", theme);
}

themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
});
langToggle.addEventListener("click", () => {
  applyLanguage(lang === "pt" ? "en" : "pt", true);
});

applyLanguage(lang);

/* ---------- Relógio de Manaus ---------- */

const clock = document.querySelector("#clock");

function tickClock() {
  if (!clock) return;
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Manaus",
  }).format(new Date());
  clock.textContent = `${time} AMT`;
}
tickClock();
setInterval(tickClock, 15000);

/* ---------- Menu mobile ---------- */

const menuButton = document.querySelector(".menu-btn");
const menuLayer = document.querySelector("#menu-layer");

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuLayer.hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
}

menuButton.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});
menuLayer.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-menu], .menu-item")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) setMenu(false);
});

/* ---------- Revelar ao rolar ---------- */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = document.querySelectorAll(".reveal");

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );
  revealEls.forEach((el) => {
    el.classList.add("armed");
    revealObserver.observe(el);
  });
}

/* ---------- Seção ativa (nav + menu em árvore) ---------- */

const sectionIds = ["topo", "projetos", "stack", "trajetoria", "contato"];
const sectionEls = sectionIds.map((id) => document.getElementById(id));
const navLinks = [...document.querySelectorAll(".nav-link")];
const treeItems = [...document.querySelectorAll(".arv-item")];
let ticking = false;

function updateActive() {
  ticking = false;
  const line = window.innerHeight * 0.4;
  let current = "topo";
  sectionEls.forEach((el, index) => {
    if (index === 0 || !el) return;
    if (el.getBoundingClientRect().top <= line) current = el.id;
  });
  // chegou ao fim da página: último item
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    current = "contato";
  }

  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${current}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
  treeItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.target === current);
  });
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateActive);
    }
  },
  { passive: true },
);
updateActive();

/* ---------- Copiar e-mail ---------- */

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.cssText = "position:fixed;opacity:0";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

copyButton?.addEventListener("click", async () => {
  try {
    await copyText(copyButton.dataset.copyEmail);
    copyLabel.textContent = extra[lang].copied;
    copyButton.classList.add("copied");
  } catch {
    copyLabel.textContent = extra[lang].select;
  }
  setTimeout(() => {
    copyLabel.textContent = lang === "en" ? en.copy : ptOriginal.copy;
    copyButton.classList.remove("copied");
  }, 1800);
});

/* ==========================================================================
   Cursor jabuti em dither (quadradinhos, como o cursor do kc1t.com).
   Um jabuti vetorial é desenhado num canvas pequeno e depois "pontilhado"
   com uma matriz de Bayer 4x4. Anda atrás do mouse com atraso, vira para
   onde você move, mexe as patas, cresce sobre links e recolhe a cabeça ao
   clicar. Um ponto dither marca a posição exata do mouse.
   ========================================================================== */

(function jabutiCursor() {
  const finePointer =
    !("ontouchstart" in window) &&
    !(navigator.maxTouchPoints > 0) &&
    !window.matchMedia("(pointer: coarse)").matches;
  if (!finePointer || window.innerWidth < 768) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const COLOR = "#f0ece8";

  function makeCanvas(size) {
    const c = document.createElement("canvas");
    c.width = c.height = size * dpr;
    c.style.cssText =
      `position:fixed;top:0;left:0;width:${size}px;height:${size}px;pointer-events:none;` +
      "z-index:999999;mix-blend-mode:difference;will-change:transform;opacity:0;transition:opacity .25s";
    c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    return { c, ctx, size };
  }

  // ---- jabuti (canvas de alta resolução -> grade de 20x20 células) ----
  const CELLS = 30, CELL = 2, SIZE = CELLS * CELL; // 60px
  const HI = 240;
  const hi = document.createElement("canvas");
  hi.width = hi.height = HI;
  const hctx = hi.getContext("2d", { willReadFrequently: true });
  const lo = document.createElement("canvas");
  lo.width = lo.height = CELLS;
  const lctx = lo.getContext("2d", { willReadFrequently: true });

  function ell(ctx, cx, cy, rx, ry, rot) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rot || 0, 0, Math.PI * 2);
  }

  // desenha no espaço 48x48 (cabeça para cima, centro em 24,24)
  function drawTurtle(angle, scale, walk, head) {
    hctx.setTransform(1, 0, 0, 1, 0, 0);
    hctx.clearRect(0, 0, HI, HI);
    hctx.globalCompositeOperation = "source-over";
    hctx.translate(HI / 2, HI / 2);
    hctx.rotate(angle);
    hctx.scale((HI / 48) * scale, (HI / 48) * scale);
    hctx.translate(-24, -24);

    // patas (alternando em diagonal)
    const sw = Math.sin(walk) * 0.45;
    const legs = [
      [16, 17, 9.5, 14.5, 0.63, sw],   // frente esq
      [32, 17, 38.5, 14.5, -0.63, -sw], // frente dir
      [16, 33, 10, 35.5, -0.56, -sw],  // trás esq
      [32, 33, 38, 35.5, 0.56, sw],    // trás dir
    ];
    hctx.fillStyle = "rgba(255,255,255,.8)";
    for (const [px, py, cx, cy, rot, a] of legs) {
      hctx.save();
      // ao clicar, a pata recolhe para dentro do casco (encolhe em torno do quadril)
      const k = 1 - 0.95 * head;
      hctx.translate(px, py);
      hctx.rotate(a * (1 - head));
      hctx.scale(k, k);
      hctx.translate(-px, -py);
      ell(hctx, cx, cy, 5.6, 3.3, rot);
      hctx.fill();
      hctx.restore();
    }
    // rabinho (também recolhe)
    hctx.save();
    hctx.translate(24, 38);
    hctx.scale(1 - 0.95 * head, 1 - 0.95 * head);
    hctx.translate(-24, -38);
    hctx.beginPath();
    hctx.moveTo(24, 39);
    hctx.lineTo(21, 46.5);
    hctx.lineTo(27, 46.5);
    hctx.closePath();
    hctx.fill();
    hctx.restore();
    // cabeça (recolhe ao clicar)
    hctx.fillStyle = "rgba(255,255,255,.95)";
    ell(hctx, 24, 8.2 + head * 9, 4.4, 5.6 - head * 2.4);
    hctx.fill();
    // vão entre o casco e as patas/cabeça
    hctx.globalCompositeOperation = "destination-out";
    hctx.fillStyle = "#000";
    ell(hctx, 24, 26, 15.2, 17.2);
    hctx.fill();
    hctx.globalCompositeOperation = "source-over";
    // casco
    hctx.fillStyle = "#fff";
    ell(hctx, 24, 26, 13.4, 15.4);
    hctx.fill();
    // escudos: linhas "apagam" parte da trama para desenhar o hexágono
    hctx.globalCompositeOperation = "destination-out";
    hctx.strokeStyle = "rgba(0,0,0,.9)";
    hctx.lineWidth = 1.5;
    hctx.lineJoin = hctx.lineCap = "round";
    hctx.beginPath();
    hctx.moveTo(24, 19.6); hctx.lineTo(29.3, 22.7); hctx.lineTo(29.3, 28.9);
    hctx.lineTo(24, 32); hctx.lineTo(18.7, 28.9); hctx.lineTo(18.7, 22.7); hctx.closePath();
    hctx.moveTo(24, 19.6); hctx.lineTo(24, 13.4);
    hctx.moveTo(29.3, 22.7); hctx.lineTo(34.8, 19.6);
    hctx.moveTo(29.3, 28.9); hctx.lineTo(34.8, 32.2);
    hctx.moveTo(24, 32); hctx.lineTo(24, 38.6);
    hctx.moveTo(18.7, 28.9); hctx.lineTo(13.2, 32.2);
    hctx.moveTo(18.7, 22.7); hctx.lineTo(13.2, 19.6);
    hctx.stroke();
    hctx.setTransform(1, 0, 0, 1, 0, 0);
    hctx.globalCompositeOperation = "source-over";

    // reduz para a grade de células e lê a densidade
    lctx.clearRect(0, 0, CELLS, CELLS);
    lctx.imageSmoothingEnabled = true;
    lctx.imageSmoothingQuality = "high";
    lctx.drawImage(hi, 0, 0, CELLS, CELLS);
    return lctx.getImageData(0, 0, CELLS, CELLS).data;
  }

  const WAVE_SPEED = 0.4; // 1 = velocidade do original; menor = oscilação mais lenta

  // Como no cursor original: o valor de cada célula varia com o tempo, então
  // os quadradinhos mudam de brilho (alpha) e surgem/somem ao cruzar o limiar
  // da matriz de Bayer. Uma onda gira em volta do jabuti, outra sai do centro
  // e cada célula tem um cintilar próprio.
  function paintTurtle(ctx, data, time) {
    const t = time * WAVE_SPEED;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = COLOR;
    const mid = (CELLS - 1) / 2;
    for (let y = 0; y < CELLS; y++) {
      for (let x = 0; x < CELLS; x++) {
        const base = data[(y * CELLS + x) * 4 + 3] / 255;
        if (base < 0.05) continue;
        const dx = x - mid, dy = y - mid;
        const r = Math.hypot(dx, dy);
        const ang = Math.atan2(dy, dx);
        const wave =
          0.13 * Math.sin(3 * ang - 2.2 * t) +
          0.1 * Math.sin(3.1 * t - 0.55 * r) +
          0.07 * Math.sin(2.3 * t + ((x * 12.9898 + y * 78.233) % 6.283));
        const v = base * (0.86 + wave) + 0.04 * wave;
        if (v > 0 && v > BAYER[y % 4][x % 4] / 16) {
          ctx.globalAlpha = Math.min(1, v);
          ctx.fillRect(x * CELL, y * CELL, CELL - 0.5, CELL - 0.5);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // ---- ponto exato do mouse ----
  function paintDot(ctx, size, cell, radius, t) {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = COLOR;
    const c = size / 2;
    for (let y = 0; y < size; y += cell) {
      for (let x = 0; x < size; x += cell) {
        const r = Math.hypot(x + cell / 2 - c, y + cell / 2 - c) / radius;
        const v = 1.05 - 0.55 * r + 0.16 * Math.sin(3.1 * t - 4 * r);
        if (v > 0 && v > BAYER[(y / cell) % 4][(x / cell) % 4] / 16) {
          ctx.globalAlpha = Math.min(1, v);
          ctx.fillRect(x, y, cell - 1, cell - 1);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  const body = makeCanvas(SIZE);
  const dot = makeCanvas(10);
  root.classList.add("has-cursor");

  const state = {
    mx: -999, my: -999, x: -999, y: -999,
    angle: -Math.PI / 4, shown: false,
    over: 0, target: 0, press: 0, pressT: 0, walk: 0, walkAmp: 0, t: 0,
  };

  document.addEventListener("mousemove", (e) => {
    if (!state.shown) {
      state.x = state.mx = e.clientX;
      state.y = state.my = e.clientY;
      state.shown = true;
      body.c.style.opacity = dot.c.style.opacity = "1";
    }
    state.mx = e.clientX;
    state.my = e.clientY;
    state.target = e.target.closest?.("a, button, [role='button']") ? 1 : 0;
  });
  document.addEventListener("mousedown", () => (state.pressT = 1));
  document.addEventListener("mouseup", () => (state.pressT = 0));
  root.addEventListener("mouseleave", () => {
    state.shown = false;
    body.c.style.opacity = dot.c.style.opacity = "0";
  });

  const TAU = Math.PI * 2;
  let lastDot = -1;
  function frame() {
    state.t += 0.045;
    const dx = (state.mx - state.x) * 0.16;
    const dy = (state.my - state.y) * 0.16;
    state.x += dx;
    state.y += dy;
    const speed = Math.hypot(dx, dy);

    if (speed > 0.6) {
      const target = Math.atan2(dy, dx) + Math.PI / 2;
      let diff = (target - state.angle) % TAU;
      if (diff > Math.PI) diff -= TAU;
      if (diff < -Math.PI) diff += TAU;
      state.angle += diff * 0.18;
    }
    state.over += (state.target - state.over) * 0.12;
    state.press += (state.pressT - state.press) * 0.25;
    state.walkAmp += ((speed > 0.5 && !reduce ? 1 : 0) - state.walkAmp) * 0.2;
    state.walk += 0.28 * state.walkAmp;

    const scale = 0.85 * (1 + 0.25 * state.over) * (1 - 0.1 * state.press);
    const data = drawTurtle(state.angle, scale, state.walk, state.press);
    paintTurtle(body.ctx, data, reduce ? 0 : state.t);
    body.c.style.transform = `translate3d(${state.x - SIZE / 2}px, ${state.y - SIZE / 2}px, 0)`;

    const dotR = 4 * (1 - 0.45 * state.over);
    if (!reduce || dotR !== lastDot) {
      paintDot(dot.ctx, 10, 2, dotR, reduce ? 0 : state.t);
      lastDot = dotR;
    }
    dot.c.style.transform = `translate3d(${state.mx - 5}px, ${state.my - 5}px, 0)`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
