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

  // Update job-title
  const jobTitle = document.getElementById("profile.job-title");
  if (jobTitle && profileData["job-title"]) {
    jobTitle.innerText = profileData["job-title"];
    // Remove and re-add typing class to restart animation
    jobTitle.classList.remove('typing');
    void jobTitle.offsetWidth; // Trigger reflow
    jobTitle.classList.add('typing');
  }

  // Update tagline
  const tagline = document.getElementById("profile.tagline");
  if (tagline && profileData.tagline) {
    tagline.innerText = profileData.tagline;
    // Remove and re-add typing class to restart animation
    tagline.classList.remove('typing');
    void tagline.offsetWidth; // Trigger reflow
    tagline.classList.add('typing');
  }

  // Update hero stats
  if (profileData.hero && profileData.hero.stats) {
    const stats = profileData.hero.stats;
    const experienceNum = document.getElementById("hero.experience");
    const experienceLabel = document.getElementById("hero.experience-label");
    const projectsNum = document.getElementById("hero.projects");
    const projectsLabel = document.getElementById("hero.projects-label");
    const technologiesNum = document.getElementById("hero.technologies");
    const technologiesLabel = document.getElementById("hero.technologies-label");

    if (experienceNum) experienceNum.textContent = stats.experience;
    if (experienceLabel) experienceLabel.textContent = stats.experienceLabel;
    if (projectsNum) projectsNum.textContent = stats.projects;
    if (projectsLabel) projectsLabel.textContent = stats.projectsLabel;
    if (technologiesNum) technologiesNum.textContent = stats.technologies;
    if (technologiesLabel) technologiesLabel.textContent = stats.technologiesLabel;
  }

  // Update hero CTAs
  if (profileData.hero && profileData.hero.ctas) {
    const ctas = profileData.hero.ctas;
    const ctaProjectsText = document.getElementById("hero.cta-projects-text");
    const ctaCvText = document.getElementById("hero.cta-cv-text");
    const ctaContactText = document.getElementById("hero.cta-contact-text");

    if (ctaProjectsText) ctaProjectsText.textContent = ctas.projects;
    if (ctaCvText) ctaCvText.textContent = ctas.cv;
    if (ctaContactText) ctaContactText.textContent = ctas.contact;
  }

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
  
  // Mapeamento de níveis para textos traduzidos
  const levelLabels = {
    'basic': currentLanguage === 'pt' ? 'Básico' : 'Basic',
    'intermediate': currentLanguage === 'pt' ? 'Intermediário' : 'Intermediate',
    'advanced': currentLanguage === 'pt' ? 'Avançado' : 'Advanced'
  };
  
  hardSkills.innerHTML = profileData.skills.hardSkills
    .map((skill) => {
      const levelBadge = skill.level
        ? `<span class="skill-level ${skill.level}">${levelLabels[skill.level] || skill.level}</span>`
        : "";

      return `
        <li class="skill-item">
          <img src="${skill.logo}" alt="${skill.name}" title="${skill.name}">
          <span class="skill-name">${skill.name}</span>
          ${levelBadge}
        </li>`;
    })
    .join("");
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
  
  if (!profileData.portfolio || profileData.portfolio.length === 0) {
    portfolio.innerHTML = `
      <div class="portfolio-empty">
        <p>${currentLanguage === 'pt' ? 'Nenhum projeto disponível no momento.' : 'No projects available at the moment.'}</p>
      </div>
    `;
    return;
  }

  portfolio.innerHTML = profileData.portfolio
    .map((project) => {
      // Status badge
      const statusBadge = project.status ? 
        `<div class="status-badge ${project.status}">
          ${project.status === 'completed' 
            ? (currentLanguage === 'pt' ? 'Concluído' : 'Completed')
            : (currentLanguage === 'pt' ? 'Em Desenvolvimento' : 'In Progress')
          }
        </div>` : '';

      // Featured badge
      const featuredBadge = project.featured ? 
        `<div class="featured-badge">
          ${currentLanguage === 'pt' ? '⭐ Destaque' : '⭐ Featured'}
        </div>` : '';

      // Thumbnail
      const thumbnail = project.thumbnail ? 
        `<img src="${project.thumbnail}" alt="${project.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
         <div class="placeholder-icon" style="display:none;">💻</div>` :
        `<div class="placeholder-icon">💻</div>`;

      // Technologies tags
      const techTags = project.technologies 
        ? project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')
        : '';

      // Stats
      const stats = project.stats 
        ? Object.entries(project.stats).map(([key, value]) => 
            `<div class="stat-badge">${value} ${key}</div>`
          ).join('')
        : '';

      // Description
      const description = project.description || '';

      // GitHub link
      const githubLink = project.github 
        ? `<a href="${project.github}" class="project-link github secondary" target="_blank" rel="noopener noreferrer">
            <span>GitHub</span>
          </a>` 
        : '';

      // Demo link
      const demoLink = project.url 
        ? `<a href="${project.url}" class="project-link demo primary" target="_blank" rel="noopener noreferrer">
            <span>${currentLanguage === 'pt' ? 'Ver Demo' : 'View Demo'}</span>
          </a>` 
        : '';

      return `
        <li>
          ${featuredBadge}
          <div class="project-thumbnail">
            ${thumbnail}
          </div>
          <div class="project-content">
            ${statusBadge}
            <h3 ${project.github ? 'class="github"' : ''}>${project.name}</h3>
            ${description ? `<p class="project-description">${description}</p>` : ''}
            ${stats ? `<div class="project-stats">${stats}</div>` : ''}
            ${techTags ? `<div class="project-tags">${techTags}</div>` : ''}
            <div class="project-links">
              ${demoLink}
              ${githubLink}
            </div>
          </div>
        </li>
      `;
    })
    .join("");
}

function updateProfessionalExperience(profileData) {
  const professionalExperience = document.getElementById(
    "profile.professionalExperience"
  );
  
  // Usar dados de about.timeline se disponível, senão usar professionalExperience
  const experienceData = profileData.about?.timeline || profileData.professionalExperience;
  
  if (!experienceData || experienceData.length === 0) {
    professionalExperience.innerHTML = '<p>Nenhuma experiência disponível.</p>';
    return;
  }
  
  // Renderizar com timeline moderna
  professionalExperience.innerHTML = experienceData.map((experience, index) => {
    // Suporte para ambos formatos: timeline (about) ou professionalExperience (antigo)
    const date = experience.date || experience.period;
    const role = experience.role || experience.name;
    const company = experience.company || '';
    const description = experience.description;
    const technologies = experience.technologies || [];
    const isCurrent = experience.current || false;
    
    const techTags = technologies.length > 0
      ? technologies.map(tech => 
          `<span class="timeline-tech-tag">${tech}</span>`
        ).join('')
      : '';
    
    return `
      <div class="timeline-item ${isCurrent ? 'current' : ''}" style="animation-delay: ${index * 0.2}s">
        <div class="timeline-date">${date}</div>
        <div class="timeline-role">${role}</div>
        ${company ? `<div class="timeline-company">${company}</div>` : ''}
        <div class="timeline-description">${description}</div>
        ${techTags ? `<div class="timeline-tech">${techTags}</div>` : ''}
      </div>
    `;
  }).join('');
  
  // Animar items após um delay
  setTimeout(() => {
    document.querySelectorAll('.timeline-item').forEach(item => {
      item.classList.add('animate-in');
    });
  }, 300);
}

async function loadAndDisplayData(language) {
  try {
    // Show loading states
    const loadingElements = [
      "profile.name",
      "profile.job",
      "profile.job-title",
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
      "website-title",
      "website-description",
      "website-button",
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
    
    // Update About section
    if (typeof updateAboutSection === 'function') {
      updateAboutSection(profileData);
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
