const btnPortuguese = document.getElementById("btnPT");
const btnEnglish = document.getElementById("btnEN");

btnPortuguese.addEventListener("click", () => {
    if (currentLanguage !== 'pt') {
      currentLanguage = 'pt';
      loadAndDisplayData(currentLanguage);
    }
  });
  
  btnEnglish.addEventListener("click", () => {
    if (currentLanguage !== 'en') {
      currentLanguage = 'en';
      loadAndDisplayData(currentLanguage);
    }
    
  });
