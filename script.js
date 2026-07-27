const rootElement = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const languageToggle = document.querySelector(".language-toggle");
const languageLabel = document.querySelector(".language-label");
const copyEmailButton = document.querySelector("[data-copy-email]");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const descriptionMeta = document.querySelector('meta[name="description"]');

const translations = {
  pt: {
    skip: "Pular para o conteúdo",
    navAbout: "Sobre",
    navProjects: "Projetos",
    navContact: "Contatos",
    role: "DESENVOLVEDOR FULL STACK",
    heroIntro:
      "Crio aplicações web que unem interfaces simples, código bem estruturado e soluções pensadas para problemas reais.",
    contactButton: "Contato",
    projectsButton: "Projetos",
    projectsTitle: "Projetos",
    p1Date: "Projeto mobile",
    p1Type: "Mobile / Visão computacional / Georreferenciamento",
    p1Title: "Mapa inteligente de resíduos",
    p1Description:
      "Aplicação mobile que detecta resíduos por visão computacional e registra cada ocorrência com sua localização geográfica, formando um mapa de calor da região.",
    p2Date: "Projeto Aranouá",
    p2Title: "Controle de acesso veicular inteligente",
    p2Description:
      "Sistema com Jetson Nano que detecta placas, extrai o texto por OCR e automatiza o cadastro e a abertura do acesso para veículos autorizados.",
    p3Type: "Liderança / NLP / Sistemas de recomendação",
    p3Description:
      "Assistente conversacional para recomendar smartphones Motorola. Atuei como líder da equipe Scrum durante o desenvolvimento da solução.",
    p4Date: "Atual",
    p4Type: "Hyperautomation / Agentes inteligentes",
    p4Description:
      "Formação prática em automação, agentes inteligentes, qualidade de software, modelos locais e aplicações de inteligência artificial.",
    contactTitle: "Contato",
    whatsapp: "WhatsApp",
    email: "E-mail",
    github: "GitHub",
    copy: "Copiar",
    copied: "Copiado ✓",
    select: "Selecione",
    backToTop: "Voltar ao topo",
  },
  en: {
    skip: "Skip to content",
    navAbout: "About",
    navProjects: "Projects",
    navContact: "Contact",
    role: "FULL STACK DEVELOPER",
    heroIntro:
      "I build web applications that combine simple interfaces, well-structured code, and solutions designed for real-world problems.",
    contactButton: "Contact",
    projectsButton: "Projects",
    projectsTitle: "Projects",
    p1Date: "Mobile project",
    p1Type: "Mobile / Computer vision / Georeferencing",
    p1Title: "Smart waste mapping",
    p1Description:
      "A mobile application that detects waste through computer vision and records each occurrence with its geographic location, creating a regional heat map.",
    p2Date: "Aranouá Project",
    p2Title: "Intelligent vehicle access control",
    p2Description:
      "A Jetson Nano system that detects license plates, extracts their text through OCR, and automates registration and access for authorized vehicles.",
    p3Type: "Leadership / NLP / Recommendation systems",
    p3Description:
      "A conversational assistant for recommending Motorola smartphones. I worked as the Scrum team lead during the development of the solution.",
    p4Date: "Current",
    p4Type: "Hyperautomation / Intelligent agents",
    p4Description:
      "Hands-on training in automation, intelligent agents, software quality, local models, and artificial intelligence applications.",
    contactTitle: "Contact",
    whatsapp: "WhatsApp",
    email: "Email",
    github: "GitHub",
    copy: "Copy",
    copied: "Copied ✓",
    select: "Select",
    backToTop: "Back to top",
  },
};

function getStoredPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredPreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The interface still works when storage is unavailable.
  }
}

function applyTheme(theme, persist = false) {
  rootElement.dataset.theme = theme;
  themeColorMeta.setAttribute("content", theme === "dark" ? "#151514" : "#f8f8f6");
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark"
      ? currentLanguage === "pt"
        ? "Mudar para tema claro"
        : "Switch to light theme"
      : currentLanguage === "pt"
        ? "Mudar para tema escuro"
        : "Switch to dark theme",
  );

  if (persist) setStoredPreference("portfolio-theme", theme);
}

const savedLanguage = getStoredPreference("portfolio-language");
let currentLanguage =
  savedLanguage === "pt" || savedLanguage === "en"
    ? savedLanguage
    : navigator.language.toLowerCase().startsWith("pt")
      ? "pt"
      : "en";

function applyLanguage(language, persist = false) {
  currentLanguage = language;
  rootElement.lang = language === "pt" ? "pt-BR" : "en";
  document.title =
    language === "pt"
      ? "Messyas Gois França — Desenvolvedor Full Stack"
      : "Messyas Gois França — Full Stack Developer";
  descriptionMeta.setAttribute(
    "content",
    language === "pt"
      ? "Portfólio de Messyas Gois França, desenvolvedor Full Stack."
      : "Portfolio of Messyas Gois França, Full Stack Developer.",
  );

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const translation = translations[language][element.dataset.i18n];
    if (translation) element.textContent = translation;
  });

  languageLabel.textContent = language === "pt" ? "PT" : "EN";
  languageToggle.setAttribute("aria-pressed", String(language === "en"));
  languageToggle.setAttribute(
    "aria-label",
    language === "pt" ? "Switch to English" : "Mudar para português",
  );
  document.querySelector(".site-nav").setAttribute(
    "aria-label",
    language === "pt" ? "Navegação principal" : "Main navigation",
  );
  document.querySelector(".nav-controls").setAttribute(
    "aria-label",
    language === "pt" ? "Preferências do site" : "Site preferences",
  );
  document.querySelector(".outline-button").setAttribute(
    "aria-label",
    language === "pt"
      ? "Conversar com Messyas pelo WhatsApp"
      : "Talk to Messyas on WhatsApp",
  );
  copyEmailButton?.setAttribute(
    "aria-label",
    language === "pt" ? "Copiar endereço de e-mail" : "Copy email address",
  );
  document.querySelectorAll(".timeline-content ul").forEach((list) => {
    list.setAttribute(
      "aria-label",
      language === "pt" ? "Tecnologias utilizadas" : "Technologies used",
    );
  });

  applyTheme(rootElement.dataset.theme || "light");
  if (persist) setStoredPreference("portfolio-language", language);
}

themeToggle.addEventListener("click", () => {
  applyTheme(rootElement.dataset.theme === "dark" ? "light" : "dark", true);
});

languageToggle.addEventListener("click", () => {
  applyLanguage(currentLanguage === "pt" ? "en" : "pt", true);
});

systemTheme.addEventListener("change", (event) => {
  if (!getStoredPreference("portfolio-theme")) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

applyLanguage(currentLanguage);

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") === "false";

  menuButton.setAttribute("aria-expanded", String(willOpen));
  navigation.classList.toggle("open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 640) closeMenu();
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealElements = document.querySelectorAll(".reveal");

if (reducedMotion.matches) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const pageSections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);

        if (isCurrent) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" },
);

pageSections.forEach((section) => sectionObserver.observe(section));

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temporaryField = document.createElement("textarea");
  temporaryField.value = text;
  temporaryField.setAttribute("readonly", "");
  temporaryField.style.position = "fixed";
  temporaryField.style.opacity = "0";
  document.body.appendChild(temporaryField);
  temporaryField.select();
  document.execCommand("copy");
  temporaryField.remove();
}

copyEmailButton.addEventListener("click", async () => {
  try {
    await copyText(copyEmailButton.dataset.copyEmail);
    copyEmailButton.textContent = translations[currentLanguage].copied;
    copyEmailButton.classList.add("copied");
  } catch {
    copyEmailButton.textContent = translations[currentLanguage].select;
  }

  window.setTimeout(() => {
    copyEmailButton.textContent = translations[currentLanguage].copy;
    copyEmailButton.classList.remove("copied");
  }, 1800);
});

const particleCanvas = document.querySelector("#particle-field");

if (particleCanvas && !reducedMotion.matches) {
  const context = particleCanvas.getContext("2d", { alpha: true });
  const particles = [];
  const pointer = { x: 0, y: 0, active: false };
  const maximumPixelRatio = 1.5;
  const particleMargin = 70;
  let viewportWidth = 0;
  let viewportHeight = 0;
  let targetParticleCount = 0;
  let animationFrame;
  let previousTime = performance.now();

  function createParticle(extraDelay = false) {
    const radius = 0.65 + Math.random() * 1.15;
    const speed = 0.38 + Math.random() * 0.58;
    const initialDistance = extraDelay
      ? Math.min(240, viewportWidth * 0.2)
      : 90;

    return {
      x: -particleMargin - Math.random() * initialDistance,
      y: -particleMargin + Math.random() * (viewportHeight + particleMargin * 2),
      vx: speed,
      vy: -0.06 + Math.random() * 0.12,
      radius,
      opacity: 0.06 + Math.random() * 0.13,
      phase: Math.random() * Math.PI * 2,
      shape: Math.random() < 0.24 ? "square" : "trail",
    };
  }

  function resetParticle(particle, extraDelay = false) {
    Object.assign(particle, createParticle(extraDelay));
  }

  function resizeParticleField() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, maximumPixelRatio);
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    particleCanvas.width = Math.round(viewportWidth * pixelRatio);
    particleCanvas.height = Math.round(viewportHeight * pixelRatio);
    particleCanvas.style.width = `${viewportWidth}px`;
    particleCanvas.style.height = `${viewportHeight}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const baseParticleCount = Math.min(
      82,
      Math.max(34, Math.round((viewportWidth * viewportHeight) / 19000)),
    );
    targetParticleCount = Math.round(baseParticleCount * 1.2);

    while (particles.length < targetParticleCount) {
      particles.push(createParticle(true));
    }

    if (particles.length > targetParticleCount) {
      particles.length = targetParticleCount;
    }
  }

  function updatePointer(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }

  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("pointerdown", updatePointer, { passive: true });
  window.addEventListener(
    "pointerup",
    () => {
      if (matchMedia("(hover: none)").matches) pointer.active = false;
    },
    { passive: true },
  );
  document.documentElement.addEventListener("mouseleave", () => {
    pointer.active = false;
  });

  function drawParticleField(currentTime) {
    const elapsed = Math.min((currentTime - previousTime) / 16.667, 2);
    previousTime = currentTime;
    context.clearRect(0, 0, viewportWidth, viewportHeight);

    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index];

      if (pointer.active) {
        const distanceX = pointer.x - particle.x;
        const distanceY = pointer.y - particle.y;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;
        const influenceRadius = 380;

        if (distanceSquared < influenceRadius * influenceRadius && distanceSquared > 1) {
          const distance = Math.sqrt(distanceSquared);
          const gravity = Math.min(0.052, 820 / (distanceSquared + 10000));
          particle.vx += (distanceX / distance) * gravity * elapsed;
          particle.vy += (distanceY / distance) * gravity * elapsed;
        }
      }

      particle.vx += (0.62 - particle.vx) * 0.0025 * elapsed;
      particle.vy += Math.sin(currentTime * 0.00045 + particle.phase) * 0.0008 * elapsed;

      const currentSpeed = Math.hypot(particle.vx, particle.vy);
      if (currentSpeed > 2.1) {
        particle.vx = (particle.vx / currentSpeed) * 2.1;
        particle.vy = (particle.vy / currentSpeed) * 2.1;
      }

      particle.x += particle.vx * elapsed;
      particle.y += particle.vy * elapsed;

      if (
        particle.x > viewportWidth + particleMargin ||
        particle.y < -particleMargin * 1.5 ||
        particle.y > viewportHeight + particleMargin * 1.5
      ) {
        resetParticle(particle);
        continue;
      }

      const horizontalFade = Math.min(
        1,
        Math.max(0, (particle.x + particleMargin) / 90),
        Math.max(0, (viewportWidth + particleMargin - particle.x) / 90),
      );

      const trailLength = 3 + Math.min(8, currentSpeed * 5);
      const directionX = particle.vx / Math.max(currentSpeed, 0.01);
      const directionY = particle.vy / Math.max(currentSpeed, 0.01);

      const particleRgb =
        rootElement.dataset.theme === "dark" ? "205, 205, 198" : "60, 60, 57";
      const particleColor = `rgba(${particleRgb}, ${particle.opacity * horizontalFade})`;

      if (particle.shape === "square") {
        const squareSize = particle.radius * 1.8;
        context.fillStyle = particleColor;
        context.fillRect(
          particle.x - squareSize / 2,
          particle.y - squareSize / 2,
          squareSize,
          squareSize,
        );
      } else {
        context.beginPath();
        context.moveTo(
          particle.x - directionX * trailLength,
          particle.y - directionY * trailLength,
        );
        context.lineTo(particle.x, particle.y);
        context.lineWidth = particle.radius;
        context.lineCap = "round";
        context.strokeStyle = particleColor;
        context.stroke();
      }
    }

    animationFrame = requestAnimationFrame(drawParticleField);
  }

  let resizeFrame;
  window.addEventListener(
    "resize",
    () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resizeParticleField);
    },
    { passive: true },
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
    } else {
      previousTime = performance.now();
      animationFrame = requestAnimationFrame(drawParticleField);
    }
  });

  resizeParticleField();
  animationFrame = requestAnimationFrame(drawParticleField);
}
