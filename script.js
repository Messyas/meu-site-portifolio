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
  role: "Fullstack Dev · AI &amp; Computer Vision",
  base: "Base",
  localTime: "Local time",
  bio: 'Fullstack dev in <a class="elo" href="#trajetoria">Manaus</a>, working with web, AI and computer vision. I led the Scrum team behind <a class="elo" href="#projetos">MotoMatch</a> at <a class="elo" href="#trajetoria">Web Academy</a> (UFAM × Motorola), presented a paper at <a class="elo" href="#trajetoria">CBIC 2025</a> and I\'m now studying hyperautomation and agents at <a class="elo" href="#trajetoria">AX Academy</a>. I build systems that solve real problems, from a gate that reads license plates to a phone recommender.',

  projectsTitle: "What I build",
  p1Desc:
    "A platform (QualCel AI) that analyzes real e-commerce reviews to extract sentiment and, from a priorities quiz, recommends the ideal Motorola smartphone. I led the Scrum team.",
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
  e1Title: "Full Stack · Scrum team lead",
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

  contactLead: "Open to conversations about projects, AI and computer vision.",
  copy: "Copy email",
  backToTop: "Back to top",
};

const extra = {
  pt: {
    copied: "Copiado ✓",
    select: "Selecione",
    title: "Messyas Gois França — Dev Fullstack",
    description:
      "Portfólio de Messyas Gois França, dev fullstack em Manaus: web, IA e visão computacional.",
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
      "Portfolio of Messyas Gois França, fullstack dev in Manaus: web, AI and computer vision.",
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
   Cursor em canvas com dither ordenado (matriz de Bayer 4×4).
   Um anel de 40px segue o mouse com atraso e um ponto de 10px o acompanha na
   hora; ambos usam mix-blend-mode: difference e crescem sobre links/botões.
   Só liga em telas largas com mouse (nada de touch).
   ========================================================================== */

(function ditherCursor() {
  const finePointer =
    !("ontouchstart" in window) &&
    !(navigator.maxTouchPoints > 0) &&
    !window.matchMedia("(pointer: coarse)").matches;
  if (!finePointer || window.innerWidth < 768) return;

  const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];

  function makeCanvas(size) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: `${size}px`,
      height: `${size}px`,
      pointerEvents: "none",
      zIndex: "999999",
      mixBlendMode: "difference",
      willChange: "transform",
      transform: "translate3d(-999px, -999px, 0)",
    });
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    ctx.scale(ratio, ratio);
    ctx.fillStyle = "#f0ece8";
    document.body.appendChild(canvas);
    return { canvas, ctx };
  }

  // pinta uma grade de células, ligando só as que passam no limiar de Bayer
  function paint(ctx, size, cell, shade) {
    ctx.clearRect(0, 0, size, size);
    const half = size / 2;
    for (let y = 0; y < size; y += cell) {
      for (let x = 0; x < size; x += cell) {
        const dx = x + cell / 2 - half;
        const dy = y + cell / 2 - half;
        const value = shade(Math.hypot(dx, dy), Math.atan2(dy, dx));
        if (value <= 0) continue;
        if (value <= BAYER[(y / cell) % 4][(x / cell) % 4] / 16) continue;
        ctx.globalAlpha = Math.min(1, value);
        ctx.fillRect(x, y, cell - 1, cell - 1);
      }
    }
    ctx.globalAlpha = 1;
  }

  const ring = makeCanvas(40);
  const dot = makeCanvas(10);
  if (!ring || !dot) return;
  root.classList.add("has-cursor");

  const state = { mx: -999, my: -999, x: -999, y: -999, t: 0, over: 0, target: 0 };

  document.addEventListener("mousemove", (event) => {
    state.mx = event.clientX;
    state.my = event.clientY;
    state.target = event.target.closest?.("a, button, [role='button']") ? 1 : 0;
  });

  function frame() {
    state.t += 0.045;
    state.x += (state.mx - state.x) * 0.16;
    state.y += (state.my - state.y) * 0.16;
    state.over += (state.target - state.over) * 0.12;

    ring.canvas.style.transform = `translate3d(${state.x - 20}px, ${state.y - 20}px, 0)`;
    dot.canvas.style.transform = `translate3d(${state.mx - 5}px, ${state.my - 5}px, 0)`;

    const radius = 15 * (1 + 0.4 * state.over);
    const thickness = 0.34 - 0.16 * state.over;
    paint(ring.ctx, 40, 3, (dist, angle) => {
      const r = dist / radius;
      if (r > 1.05) return 0;
      const wobble =
        0.78 + 0.09 * Math.sin(3 * angle - 2.2 * state.t) + 0.05 * Math.sin(1.4 * state.t);
      return 1 - Math.abs(r - wobble) / thickness;
    });

    const dotRadius = 4 * (1 - 0.45 * state.over);
    paint(dot.ctx, 10, 2, (dist) => {
      const r = dist / dotRadius;
      if (r > 1) return 0;
      return 1.05 - 0.55 * r + 0.16 * Math.sin(3.1 * state.t - 4 * r);
    });

    requestAnimationFrame(frame);
  }

  // esconde o cursor quando o mouse sai da janela
  root.addEventListener("mouseleave", () => {
    state.mx = state.x = -999;
    state.my = state.y = -999;
  });

  requestAnimationFrame(frame);
})();
