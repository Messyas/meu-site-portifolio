const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const langToggle = document.querySelector(".lang-toggle");
const langLabel = document.querySelector(".lang-label");
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
  ctaTalk: "Contact",
  role: "FULLSTACK DEV · AI &amp; COMPUTER VISION",
  base: "BASE",
  localTime: "LOCAL TIME",
  bio: 'Fullstack dev in <strong>Manaus</strong>, working with web, AI and computer vision. I led the Scrum team behind <a href="#projetos"><strong>MotoMatch</strong></a> at <strong>Web Academy</strong> (UFAM × Motorola), presented a paper at <strong>CBIC 2025</strong> (UFMG) and I\'m now studying hyperautomation and agents at <strong>AX Academy</strong>. I build systems that solve real problems, from a gate that reads license plates to a phone recommender.',

  projectsTitle: "What I build",
  p1Badge: "WEB ACADEMY · UFAM",
  p1Desc:
    "A platform (QualCel AI) that analyzes real e-commerce reviews to extract sentiment and, from a priorities quiz, recommends the ideal Motorola smartphone. I led the Scrum team.",
  p2Badge: "ANDROID · GAME",
  p2Desc:
    "A 2D adventure RPG for Android, built in the Mobile 2D Game Prototyping course of Projeto Aranouá (IFAM). Cute, relaxing atmosphere: a duo of adventurers explores forests and fights monsters.",
  alsoBuilt: "ALSO BUILT",
  seeAll: "SEE ALL",
  m1Type: "VISION",
  m1Desc:
    "A gate system that detects plates with YOLO, reads the characters via OCR and registers the vehicle on its own. NestJS backend, Next.js frontend and a FastAPI pipeline.",
  m2Desc:
    "Weather alerts built on microservices: AWS Lambda functions send Telegram messages per user profile, with Cognito login and a Next.js dashboard.",
  m3Title: "Macroplastics detection",
  m3Type: "PAPER",
  m3Desc:
    "Paper presented at CBIC 2025 (UFMG): an ensemble of deep learning models with Weighted Boxes Fusion to detect plastic waste in Manaus streams.",
  m4Type: "AI",
  m4Desc:
    "A reusable Python module for retrieval, structured analysis and agent-driven investigation, in cleanly separated layers and with local models.",
  m5Desc:
    'A personal-organization desktop app, "a journal for the lazy", designed to plug in skills, MCPs and coding agents down the road.',
  m6Type: "AUDIO",
  m6Desc:
    "A real-time voice processor for Windows, written in C++20 and 100% local: pitch and formant shifting, voice layers and DSP with no allocation on the audio thread.",

  stackTitle: "Stack",
  stackLang: "LANGUAGES",
  stackWeb: "WEB &amp; CLOUD",
  stackAi: "AI &amp; VISION",
  stackAuto: "AUTOMATION &amp; QUALITY",

  pathTitle: "Path",
  colExp: "EXPERIENCE",
  colEdu: "EDUCATION &amp; RESEARCH",
  e1Title: "Full Stack · Scrum team lead",
  e1Type: "R&amp;D project",
  e2Title: "Intelligent vehicle access control",
  e2Type: "Project",
  e3Title: "2D mobile game · Amazon Mages",
  e3Type: "Prototyping course",
  e4Title: "Smart waste map",
  f1Title: "Hyperautomation and intelligent agents",
  f1Type: "Hands-on training",
  f1Date: "2026 · current",
  f2Title: "Macroplastics detection with a deep learning ensemble",
  f2Type: "Paper presented",

  contactTitle: "Let's talk?",
  contactLead:
    "Got a project, an opening, or just want to swap ideas about web, AI or computer vision? Just reach out.",
  email: "Email",
  copy: "Copy",
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
    toggleLabel: "Switch to English",
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
    toggleLabel: "Mudar para português",
    themeLight: "Switch to light theme",
    themeDark: "Switch to dark theme",
    nav: "Main navigation",
  },
};

// guarda o texto original (português) de cada elemento traduzível
const i18nNodes = [...document.querySelectorAll("[data-i18n]")];
const ptOriginal = Object.fromEntries(
  i18nNodes.map((el) => [el.dataset.i18n, el.innerHTML]),
);
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

  langLabel.textContent = lang.toUpperCase();
  langToggle.setAttribute("aria-label", meta.toggleLabel);
  document.querySelector(".main-nav").setAttribute("aria-label", meta.nav);
  applyTheme(root.dataset.theme || "dark");

  if (persist) store.set("portfolio-language", lang);
}

/* ---------- Tema ---------- */

function applyTheme(theme, persist = false) {
  root.dataset.theme = theme;
  themeColorMeta?.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#f6f4f0");
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
const nav = document.querySelector(".main-nav");
const navLinks = [...nav.querySelectorAll("a")];

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
}

menuButton.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});
navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 720) setMenu(false);
});

/* ---------- Animação de entrada + seção ativa ---------- */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const current = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", current);
          if (current) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));
}

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
