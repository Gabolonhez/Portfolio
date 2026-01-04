const btnPortuguese = document.getElementById("btnPT");
const btnEnglish = document.getElementById("btnEN");

function changeLanguage(language) {
  if (currentLanguage !== language) {
    currentLanguage = language;
    loadAndDisplayData(currentLanguage);

    // Update button states
    updateButtonStates();

    // Save language preference
    localStorage.setItem("preferredLanguage", language);

    console.log(
      `🌍 Idioma alterado para: ${language === "pt" ? "Português" : "English"}`
    );
  }
}

function updateButtonStates() {
  if (btnPortuguese && btnEnglish) {
    btnPortuguese.setAttribute("aria-pressed", currentLanguage === "pt");
    btnEnglish.setAttribute("aria-pressed", currentLanguage === "en");

    // Add active class for styling
    btnPortuguese.classList.toggle("active", currentLanguage === "pt");
    btnEnglish.classList.toggle("active", currentLanguage === "en");
  }
}

// Load saved language preference and detect browser language
document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("preferredLanguage");
  let targetLanguage = currentLanguage;

  if (savedLanguage) {
    targetLanguage = savedLanguage;
  } else {
    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
      if (browserLang.startsWith("en")) {
        targetLanguage = "en";
      } else if (browserLang.startsWith("pt")) {
        targetLanguage = "pt";
      }
    }
  }

  if (targetLanguage !== currentLanguage) {
    changeLanguage(targetLanguage);
  }
  updateButtonStates();
});

btnPortuguese?.addEventListener("click", () => changeLanguage("pt"));
btnEnglish?.addEventListener("click", () => changeLanguage("en"));
