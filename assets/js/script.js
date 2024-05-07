handleSwitchThemeEvents();
function handleSwitchThemeEvents() {
    /**
     * @type {HTMLInputElement | null}
     */
    const switchTheme = document.getElementById("switch-toggle-theme");

    if (!switchTheme) return;

    switchTheme.addEventListener("change", (event) => toggleTheme(event));
    switchTheme.addEventListener("keydown", (event) => {
        event.stopPropagation();
        const { key, target } = event;
        if (key === "Enter") {
            target.checked = !target.checked;
            toggleTheme(target);
        }
    });
}

/**
 * @param {Event} event
 */
function toggleTheme(event) {
    event.stopPropagation();
    const { target } = event;

    if (target.checked) {
        document.body.classList.remove("dark");
        return;
    }

    document.body.classList.add("dark");
}

const isSystemThemeDark = () => {
    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return true;
    }

    return false;
};

handleDefaultTheme();
function handleDefaultTheme() {
    const switchTheme = document.getElementById("switch-toggle-theme");

    if (!switchTheme) return;

    // Verificar se o tema do sistema é escuro
    if (isSystemThemeDark()) {
        document.body.classList.add("dark");
        switchTheme.checked = false;
    } else {
        document.body.classList.remove("dark");
        switchTheme.checked = true;
    }

    // Função para verificar o tema do sistema
    function isSystemThemeDark() {
        return (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        );
    }
}
