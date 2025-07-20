let currentLanguage = "pt";

// Loading state management
function setLoadingState(element, isLoading, loadingText = "Carregando...") {
  if (isLoading) {
    element.innerHTML = `<span class="loading-spinner"></span> ${loadingText}`;
    element.classList.add("loading");
  } else {
    element.classList.remove("loading");
  }
}

// Error handling for fetch
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`Tentativa ${i + 1} falhou:`, error.message);

      if (i === retries - 1) {
        throw new Error(
          `Falha ao carregar dados após ${retries} tentativas: ${error.message}`
        );
      }

      // Aguarda antes de tentar novamente
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function fetchProfileData(language) {
  const url =
    language === "pt"
      ? "./src/data/profilePT.json"
      : "./src/data/profileEN.json";

  try {
    const profileData = await fetchWithRetry(url);
    return profileData;
  } catch (error) {
    console.error("Erro ao carregar dados do perfil:", error);

    // Fallback data
    return {
      name: "Gabriel Bolonhez",
      photo: "./src/images/Me.png",
      job:
        language === "pt"
          ? "Desenvolvedor Front-end | QA"
          : "Front-end Developer | QA",
      location:
        language === "pt"
          ? "São Bernardo do Campo, São Paulo, Brasil"
          : "São Bernardo do Campo, São Paulo, Brazil",
      phone: "+55 (11) 94367-8485",
      email: "gbbolonhez@gmail.com",
      skills: { hardSkills: [], softSkills: [] },
      education: [],
      languages: [],
      portfolio: [],
      professionalExperience: [],
      accordionTitles: {
        skills: language === "pt" ? "Habilidades" : "Skills",
        education: language === "pt" ? "Formação" : "Education",
        languages: language === "pt" ? "Idiomas" : "Languages",
        portfolio: language === "pt" ? "Projetos" : "Projects",
        professionalExperience:
          language === "pt" ? "Experiência" : "Experience",
        contact: language === "pt" ? "Contato" : "Contact",
      },
      contactLabels: {
        email: "Email",
        phone: language === "pt" ? "Telefone" : "Phone",
        location: language === "pt" ? "Localização" : "Location",
        connectText:
          language === "pt" ? "Conecte-se comigo:" : "Connect with me:",
      },
    };
  }
}

function updateAccordionTitles(profileData) {
  const titles = profileData.accordionTitles;
  document.getElementById("skills-title").textContent = titles.skills;
  document.getElementById("education-title").textContent = titles.education;
  document.getElementById("languages-title").textContent = titles.languages;
  document.getElementById("portfolio-title").textContent = titles.portfolio;
  document.getElementById("professionalExperience-title").textContent =
    titles.professionalExperience;

  // Update contact section title
  const contactTitle = document.getElementById("contact-title");
  if (contactTitle && titles.contact) {
    contactTitle.textContent = titles.contact;
  }
}

function updateContactSection(profileData) {
  // Update contact labels
  const contactLabels = profileData.contactLabels;

  if (contactLabels) {
    const emailLabel = document.getElementById("contact-email-label");
    const phoneLabel = document.getElementById("contact-phone-label");
    const locationLabel = document.getElementById("contact-location-label");
    const connectText = document.getElementById("contact-connect-text");

    if (emailLabel) emailLabel.textContent = contactLabels.email;
    if (phoneLabel) phoneLabel.textContent = contactLabels.phone;
    if (locationLabel) locationLabel.textContent = contactLabels.location;
    if (connectText) connectText.textContent = contactLabels.connectText;
  }

  // Update contact information
  const emailContact = document.getElementById("profile.email-contact");
  const phoneContact = document.getElementById("profile.phone-contact");
  const locationContact = document.getElementById("profile.location-contact");

  if (emailContact) {
    emailContact.textContent = profileData.email;
    emailContact.href = `mailto:${profileData.email}`;
  }

  if (phoneContact) {
    phoneContact.textContent = profileData.phone;
    phoneContact.href = `tel:${profileData.phone.replace(/\s/g, "")}`;
  }

  if (locationContact) {
    locationContact.textContent = profileData.location;
  }
}

function updateProfileInfo(profileData) {
  const photo = document.getElementById("profile.photo");
  photo.src = profileData.photo;
  photo.alt = profileData.name;

  const name = document.getElementById("profile.name");
  name.innerText = profileData.name;

  const job = document.getElementById("profile.job");
  job.innerText = profileData.job;

  const location = document.getElementById("profile.location");
  location.innerText = profileData.location;

  // Update phone link - element is already an <a> tag in HTML
  const phone = document.getElementById("profile.phone");
  if (phone) {
    phone.innerText = profileData.phone;
    // Remove all non-numeric characters except + for international format
    const phoneClean = profileData.phone.replace(/[^\d+]/g, "");
    phone.href = `tel:${phoneClean}`;

    // Add dynamic titles and accessibility
    const phoneTitle =
      currentLanguage === "pt"
        ? `Ligar para ${profileData.phone}`
        : `Call ${profileData.phone}`;
    phone.setAttribute("title", phoneTitle);
    phone.setAttribute("aria-label", phoneTitle);
  }

  // Update email link - element is already an <a> tag in HTML
  const email = document.getElementById("profile.email");
  if (email) {
    email.innerText = profileData.email;
    email.href = `mailto:${profileData.email}`;

    // Add dynamic titles and accessibility
    const emailTitle =
      currentLanguage === "pt"
        ? `Enviar email para ${profileData.email}`
        : `Send email to ${profileData.email}`;
    email.setAttribute("title", emailTitle);
    email.setAttribute("aria-label", emailTitle);
  }

  // Update Need Website section
  const websiteTitle = document.getElementById("website-title");
  if (websiteTitle) {
    websiteTitle.innerText = profileData.needWebsite.title;
  }

  const websiteDescription = document.getElementById("website-description");
  if (websiteDescription) {
    websiteDescription.innerText = profileData.needWebsite.description;
  }

  const websiteButton = document.getElementById("website-button");
  if (websiteButton) {
    websiteButton.innerText = profileData.needWebsite.buttonText;
  }
}

function updateSoftSkills(profileData) {
  const skillsPersonal = document.getElementById("skills-personal");
  skillsPersonal.innerText = profileData.skillsTitles.skillsPersonal;

  const softSkills = document.getElementById("profile.skills.softSkills");
  softSkills.innerHTML = profileData.skills.softSkills
    .map((skill) => `<li>${skill}</li>`)
    .join("");
}

function updateHardSkills(profileData) {
  const skillsTech = document.getElementById("skills-tech");
  skillsTech.innerText = profileData.skillsTitles.skillsTech;

  const hardSkills = document.getElementById("profile.skills.hardSkills");
  hardSkills.innerHTML = profileData.skills.hardSkills
    .map((skill) => {
      const progressBar = skill.level
        ? `<div class="skill-progress">
          <div class="skill-progress-bar" data-level="${skill.level}" style="width: 0%"></div>
        </div>
        <span class="skill-level">${skill.level}%</span>`
        : "";

      return `
        <li class="skill-item">
          <div class="skill-content">
            <img src="${skill.logo}" alt="${skill.name}" title="${skill.name}">
            <span class="skill-name">${skill.name}</span>
          </div>
          ${progressBar}
        </li>`;
    })
    .join("");

  // Animate progress bars after a short delay
  setTimeout(() => {
    document.querySelectorAll(".skill-progress-bar").forEach((bar) => {
      const level = bar.dataset.level;
      bar.style.width = level + "%";
    });
  }, 500);
}

function updateEducation(profileData) {
  const education = document.getElementById("profile.education");
  education.innerHTML = profileData.education
    .map((education) => {
      return `
        <li>
          <h3 class="title">${education.name}</h3>
          <p class="period">${education.period}</p>
          <p>${education.description}</p>
        </li>
      `;
    })
    .join("");
}

function updateLanguages(profileData) {
  const languages = document.getElementById("profile.languages");
  languages.innerHTML = profileData.languages
    .map((language) => `<li>${language}</li>`)
    .join("");
}

function updatePortfolio(profileData) {
  const portfolio = document.getElementById("profile.portfolio");
  portfolio.innerHTML = profileData.portfolio
    .map((project) => {
      return `
        <li>
          <h3 ${project.github ? 'class="github"' : ""}>${project.name}</h3>
          <a href="${project.url}" target="_blank">${project.url}</a>
        </li>
      `;
    })
    .join("");
}

function updateProfessionalExperience(profileData) {
  const professionalExperience = document.getElementById(
    "profile.professionalExperience"
  );
  professionalExperience.innerHTML = profileData.professionalExperience
    .map((experience) => {
      return `
        <li>
          <h3 class="title">${experience.name}</h3>
          <p class="period">${experience.period}</p>
          <p> ${experience.description}</p>
        </li>
      `;
    })
    .join("");
}

async function loadAndDisplayData(language) {
  try {
    // Show loading states
    const loadingElements = [
      "profile.name",
      "profile.job",
      "profile.location",
      "profile.phone",
      "profile.email",
      "skills-title",
      "education-title",
      "languages-title",
      "portfolio-title",
      "professionalExperience-title",
      "contact-title",
      "contact-email-label",
      "contact-phone-label",
      "contact-location-label",
      "contact-connect-text",
    ];

    loadingElements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        setLoadingState(element, true);
      }
    });

    const profileData = await fetchProfileData(language);

    // Update all sections
    updateProfileInfo(profileData);
    updateSoftSkills(profileData);
    updateHardSkills(profileData);
    updateEducation(profileData);
    updateLanguages(profileData);
    updatePortfolio(profileData);
    updateProfessionalExperience(profileData);
    updateContactSection(profileData);
    updateAccordionTitles(profileData);

    console.log("✅ Dados carregados com sucesso");
  } catch (error) {
    console.error("❌ Erro ao carregar dados:", error);

    // Show error message to user
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-notification";
    errorMessage.innerHTML = `
      <p><strong>Erro ao carregar dados:</strong> ${error.message}</p>
      <button onclick="location.reload()">Tentar novamente</button>
    `;
    document.body.insertBefore(errorMessage, document.body.firstChild);
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Inicializando aplicação...");
  loadAndDisplayData(currentLanguage);
});
