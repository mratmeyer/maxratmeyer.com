const currentTheme = localStorage.getItem("theme");
if (currentTheme === null) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDark();
    }
} else {
    document.body.classList.add(currentTheme);
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
    document.body.classList.remove("dark");
    document.body.classList.add("light");
};

function setDark() {
    localStorage.setItem("theme", "dark");
    document.body.classList.remove("light");
    document.body.classList.add("dark");
};