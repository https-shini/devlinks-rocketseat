/**
 * DevLinks - Enhanced JavaScript
 * Features: Theme toggle, system preference detection, accessibility, animations
 */

// ==========================================
// CONSTANTS & UTILITIES
// ==========================================

const STORAGE_KEY = "devlinks-theme";
const THEME = {
    LIGHT: "light",
    DARK: "dark",
};

// Mouse tracking for interactive effects
let mouseX = 0;
let mouseY = 0;

/**
 * Detecta se o usuário prefere tema escuro no sistema
 */
const prefersDarkMode = () => {
    return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
};

/**
 * Detecta se o usuário prefere movimento reduzido
 */
const prefersReducedMotion = () => {
    return (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
};

/**
 * Salva o tema no localStorage
 */
const saveTheme = (theme) => {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
        console.warn("Failed to save theme preference:", error);
    }
};

/**
 * Recupera o tema do localStorage
 */
const loadTheme = () => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
        console.warn("Failed to load theme preference:", error);
        return null;
    }
};

// ==========================================
// THEME MANAGEMENT
// ==========================================

class ThemeManager {
    constructor() {
        this.button = document.getElementById("theme-toggle");
        this.currentTheme = this.getInitialTheme();
        this.init();
    }

    /**
     * Determina o tema inicial baseado em:
     * 1. Preferência salva
     * 2. Preferência do sistema
     * 3. Tema padrão (dark)
     */
    getInitialTheme() {
        const savedTheme = loadTheme();
        if (savedTheme) {
            return savedTheme;
        }
        return prefersDarkMode() ? THEME.DARK : THEME.LIGHT;
    }

    /**
     * Inicializa o gerenciador de temas
     */
    init() {
        if (!this.button) {
            console.error("Theme toggle button not found");
            return;
        }

        // Aplica tema inicial
        this.applyTheme(this.currentTheme, false);

        // Event listeners
        this.button.addEventListener("click", () => this.toggle());
        this.button.addEventListener("keydown", (e) => this.handleKeydown(e));

        // Detecta mudanças na preferência do sistema
        if (window.matchMedia) {
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .addEventListener("change", (e) =>
                    this.handleSystemThemeChange(e),
                );
        }
    }

    /**
     * Alterna entre temas
     */
    toggle() {
        const newTheme =
            this.currentTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
        this.applyTheme(newTheme, true);
    }

    /**
     * Aplica um tema específico
     */
    applyTheme(theme, animate = true) {
        this.currentTheme = theme;

        // Atualiza o body
        if (theme === THEME.LIGHT) {
            document.body.classList.add("light");
        } else {
            document.body.classList.remove("light");
        }

        // Atualiza ARIA
        this.button.setAttribute(
            "aria-pressed",
            theme === THEME.LIGHT ? "true" : "false",
        );

        // Salva preferência
        saveTheme(theme);

        // Atualiza meta theme-color
        this.updateMetaThemeColor(theme);

        // Log para debug
        console.log(`Theme changed to: ${theme}`);
    }

    /**
     * Atualiza a cor do tema do navegador
     */
    updateMetaThemeColor(theme) {
        let metaTheme = document.querySelector('meta[name="theme-color"]');

        if (!metaTheme) {
            metaTheme = document.createElement("meta");
            metaTheme.name = "theme-color";
            document.head.appendChild(metaTheme);
        }

        metaTheme.content = theme === THEME.LIGHT ? "#f8fafc" : "#070a13";
    }

    /**
     * Trata teclas de atalho
     */
    handleKeydown(event) {
        // Enter ou Space para alternar tema
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this.toggle();
        }
    }

    /**
     * Reage a mudanças na preferência do sistema
     */
    handleSystemThemeChange(event) {
        // Só aplica automaticamente se não houver preferência salva
        if (!loadTheme()) {
            const newTheme = event.matches ? THEME.DARK : THEME.LIGHT;
            this.applyTheme(newTheme, true);
        }
    }
}

// ==========================================
// PAGE LOADER
// ==========================================

class PageLoader {
    constructor() {
        this.loader = document.querySelector(".page-loader");
        this.init();
    }

    init() {
        if (!this.loader) return;

        // Remove loader após animação
        setTimeout(() => {
            this.loader.style.display = "none";
        }, 1500);
    }
}

// ==========================================
// INTERACTIVE MOUSE EFFECTS
// ==========================================

class MouseEffects {
    constructor() {
        this.init();
    }

    init() {
        if (prefersReducedMotion()) return;

        // Track mouse position for gradient effect
        document.addEventListener("mousemove", (e) => {
            mouseX = (e.clientX / window.innerWidth) * 100;
            mouseY = (e.clientY / window.innerHeight) * 100;

            document.documentElement.style.setProperty(
                "--mouse-x",
                `${mouseX}%`,
            );
            document.documentElement.style.setProperty(
                "--mouse-y",
                `${mouseY}%`,
            );

            document.body.classList.add("mouse-active");
        });

        // Add magnetic effect to social links
        this.addMagneticEffect();

        // Add ripple effect to link cards
        this.addRippleEffect();

        // Add parallax effect on scroll
        this.addParallaxEffect();
    }

    addMagneticEffect() {
        const socialLinks = document.querySelectorAll(".social-link");

        socialLinks.forEach((link) => {
            link.addEventListener("mousemove", (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                link.style.transform = `translateY(-6px) scale(1.1) translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            link.addEventListener("mouseleave", () => {
                link.style.transform = "";
            });
        });
    }

    addRippleEffect() {
        const linkCards = document.querySelectorAll(".link-card");

        linkCards.forEach((card) => {
            card.addEventListener("click", (e) => {
                card.classList.add("ripple");

                setTimeout(() => {
                    card.classList.remove("ripple");
                }, 600);
            });
        });
    }

    addParallaxEffect() {
        window.addEventListener("scroll", () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll(
                ".profile, .links-item",
            );

            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + index * 0.1;
                const yPos = -((scrolled * speed) / 10);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// ==========================================
// CURSOR TRAIL EFFECT
// ==========================================

class CursorTrail {
    constructor() {
        this.dots = [];
        this.maxDots = 12;
        this.init();
    }

    init() {
        if (prefersReducedMotion() || window.innerWidth < 768) return;

        // Create cursor dots
        for (let i = 0; i < this.maxDots; i++) {
            const dot = document.createElement("div");
            dot.className = "cursor-dot";
            dot.style.cssText = `
                position: fixed;
                width: ${8 - i * 0.5}px;
                height: ${8 - i * 0.5}px;
                background: linear-gradient(135deg, var(--clr-primary), var(--clr-secondary));
                border-radius: 50%;
                pointer-events: none;
                opacity: ${1 - i * 0.08};
                z-index: 9999;
                transition: transform 0.1s ease;
                mix-blend-mode: screen;
            `;
            document.body.appendChild(dot);
            this.dots.push({
                element: dot,
                x: 0,
                y: 0,
            });
        }

        // Animate dots
        document.addEventListener("mousemove", (e) => {
            this.dots[0].x = e.clientX;
            this.dots[0].y = e.clientY;
        });

        this.animate();
    }

    animate() {
        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];

            if (i > 0) {
                const prevDot = this.dots[i - 1];
                dot.x += (prevDot.x - dot.x) * 0.3;
                dot.y += (prevDot.y - dot.y) * 0.3;
            }

            dot.element.style.transform = `translate(${dot.x - 4}px, ${dot.y - 4}px)`;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// ANALYTICS & TRACKING
// ==========================================

class Analytics {
    constructor() {
        this.init();
    }

    init() {
        // Track clicks nos links principais
        document.querySelectorAll(".link-card").forEach((link) => {
            link.addEventListener("click", (e) => {
                const linkText = link.querySelector(".link-text")?.textContent;
                this.trackLinkClick(linkText);
            });
        });

        // Track clicks nas redes sociais
        document.querySelectorAll(".social-link").forEach((link) => {
            link.addEventListener("click", (e) => {
                const label = link.getAttribute("aria-label");
                this.trackSocialClick(label);
            });
        });
    }

    trackLinkClick(linkName) {
        console.log(`Link clicked: ${linkName}`);

        // Aqui você pode integrar com Google Analytics, Plausible, etc.
        // Exemplo: gtag('event', 'click', { 'event_category': 'link', 'event_label': linkName });
    }

    trackSocialClick(socialNetwork) {
        console.log(`Social link clicked: ${socialNetwork}`);

        // Exemplo: gtag('event', 'click', { 'event_category': 'social', 'event_label': socialNetwork });
    }
}

// ==========================================
// PARTICLES ANIMATION
// ==========================================

class ParticlesEffect {
    constructor() {
        this.container = document.querySelector(".particles");
        this.particleCount = 30;
        this.init();
    }

    init() {
        if (!this.container || prefersReducedMotion()) return;

        // Cria partículas dinâmicas
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }

        // Adiciona orbes extras flutuantes
        this.createFloatingOrbs();
    }

    createParticle() {
        const particle = document.createElement("div");
        particle.className = "particle";

        // Posição aleatória
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // Tamanho aleatório
        const size = Math.random() * 4 + 2;

        // Delay aleatório
        const delay = Math.random() * 25;

        // Duração aleatória
        const duration = Math.random() * 15 + 20;

        // Cor aleatória entre primary e secondary
        const isPrimary = Math.random() > 0.5;
        const color = isPrimary ? "var(--clr-primary)" : "var(--clr-secondary)";

        particle.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, ${color}, transparent);
            border-radius: 50%;
            opacity: 0;
            animation: particleFloat ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
            filter: blur(${Math.random() * 2}px);
        `;

        this.container.appendChild(particle);
    }

    createFloatingOrbs() {
        const orb = document.createElement("div");
        orb.className = "particles-extra";
        document.body.appendChild(orb);
    }
}

// Adiciona animações CSS dinamicamente com variações
const particleAnimation = document.createElement("style");
particleAnimation.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0;
        }
        10% {
            opacity: 0.4;
        }
        25% {
            transform: translate(30px, -80px) rotate(90deg) scale(1.2);
            opacity: 0.7;
        }
        50% {
            transform: translate(-40px, -150px) rotate(180deg) scale(0.9);
            opacity: 0.8;
        }
        75% {
            transform: translate(60px, -100px) rotate(270deg) scale(1.1);
            opacity: 0.5;
        }
        90% {
            opacity: 0.3;
        }
    }
`;
document.head.appendChild(particleAnimation);

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================

class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Adiciona skip link para navegação por teclado
        this.addSkipLink();

        // Melhora navegação por teclado
        this.enhanceKeyboardNavigation();

        // Anuncia mudanças dinâmicas para screen readers
        this.setupLiveRegion();
    }

    addSkipLink() {
        const skipLink = document.createElement("a");
        skipLink.href = "#main-content";
        skipLink.className = "skip-link";
        skipLink.textContent = "Pular para o conteúdo principal";

        const skipLinkStyle = document.createElement("style");
        skipLinkStyle.textContent = `
            .skip-link {
                position: absolute;
                top: -100px;
                left: 0;
                background: var(--clr-primary);
                color: white;
                padding: 0.5rem 1rem;
                text-decoration: none;
                z-index: 10000;
            }
            .skip-link:focus {
                top: 0;
            }
        `;

        document.head.appendChild(skipLinkStyle);
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Adiciona ID ao container principal
        const main = document.querySelector("main");
        if (main) {
            main.id = "main-content";
        }
    }

    enhanceKeyboardNavigation() {
        // Adiciona indicação visual para elementos focados
        document.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                document.body.classList.add("keyboard-navigation");
            }
        });

        document.addEventListener("mousedown", () => {
            document.body.classList.remove("keyboard-navigation");
        });
    }

    setupLiveRegion() {
        const liveRegion = document.createElement("div");
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("aria-atomic", "true");
        liveRegion.className = "sr-only";

        const style = document.createElement("style");
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(liveRegion);

        // Armazena referência global
        window.liveRegion = liveRegion;
    }
}

// ==========================================
// PERFORMANCE MONITORING
// ==========================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if ("PerformanceObserver" in window) {
            // Monitora First Contentful Paint
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`${entry.name}: ${entry.startTime}ms`);
                }
            });

            observer.observe({
                entryTypes: ["paint", "largest-contentful-paint"],
            });
        }

        // Log de tempo de carregamento
        window.addEventListener("load", () => {
            const loadTime =
                performance.timing.loadEventEnd -
                performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

// Aguarda DOM estar pronto
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log("🚀 DevLinks Enhanced - Initializing...");

    // Inicializa módulos
    new PageLoader();
    new ThemeManager();
    new Analytics();
    new AccessibilityEnhancer();

    // Só adiciona partículas e efeitos se movimento não for reduzido
    if (!prefersReducedMotion()) {
        new ParticlesEffect();
        new MouseEffects();
        new CursorTrail();
    }

    // Monitor de performance (apenas em desenvolvimento)
    if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
    ) {
        new PerformanceMonitor();
    }

    console.log("✅ DevLinks Enhanced - Ready!");
}

// ==========================================
// SERVICE WORKER (PWA)
// ==========================================

// Registra service worker se disponível
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        // Descomente para ativar PWA
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// ==========================================
// EXPORT FOR TESTING
// ==========================================

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        ThemeManager,
        Analytics,
        AccessibilityEnhancer,
    };
}
