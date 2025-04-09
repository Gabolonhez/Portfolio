const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const darkModeImage = "./assets/images/dark-mode.png";
const lightModeImage = "./assets/images/light-mode.png";
const savedTheme = localStorage.getItem('theme');


document.addEventListener("DOMContentLoaded", () => {
    function setTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            themeToggle.src = lightModeImage;
            localStorage.setItem("theme", "dark");
        } else {
            body.classList.remove("dark-mode")
            body.classList.add("light-mode");
            themeToggle.src = darkModeImage;
            localStorage.setItem("theme", "light");
        }
    }

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme("dark");
    }

    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.contains('dark-mode');

        if (isDarkMode) {
            setTheme("light");
        } else {
            setTheme("dark");
        }
})
})