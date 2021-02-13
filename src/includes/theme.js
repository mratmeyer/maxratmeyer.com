const currentTheme = localStorage.getItem("theme");
if (currentTheme === null) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDark();
    }
} else {
    document.body.classList.remove("light-theme");
    document.body.classList.add(currentTheme + "-theme");
}

function toggleDarkMode() {
    const theme = localStorage.getItem("theme");

    if (theme == "light") {
        setDark();
    } else if (theme == "dark") {
        setLight();
    } else {
        setDark();
    }
};

function setLight() {
    localStorage.setItem("theme", "light");
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
};

function setDark() {
    localStorage.setItem("theme", "dark");
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
};