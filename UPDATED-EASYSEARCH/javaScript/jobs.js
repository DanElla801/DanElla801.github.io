const jobs = [
  {
    id: 1,
    title: "Junior Front-End Developer",
    company: "Shopify",
    location: "Toronto, ON",
    salary: "$24-$30/hr",
    type: "Hybrid",
    experience: "Entry level",
    description: "Support landing pages, update UI components, and work with HTML, CSS, and JavaScript in a team setting.",
    tags: ["Entry level", "Student friendly", "HTML/CSS/JS"],
    match: 96,
    url: "apply"
  },
  {
    id: 2,
    title: "Barista",
    company: "Metro Cafe",
    location: "Downtown Toronto, ON",
    salary: "$18.50/hr",
    type: "Part-time",
    experience: "No experience required",
    description: "Serve drinks, handle customers, and work flexible shifts that fit around school or another job.",
    tags: ["Student friendly", "Weekend shifts", "Customer service"],
    match: 88,
    url: "apply"
  },
  {
    id: 3,
    title: "Warehouse Associate",
    company: "Amazon",
    location: "Etobicoke, ON",
    salary: "$20-$23/hr",
    type: "Full-time",
    experience: "Entry level",
    description: "Pick, pack, and organize inventory in a busy warehouse environment with morning and afternoon shifts.",
    tags: ["Entry level", "With salary", "Morning shifts"],
    match: 91,
    url: "apply"
  },
  {
    id: 4,
    title: "IT Support Intern",
    company: "Microsoft",
    location: "Mississauga, ON",
    salary: "$22/hr",
    type: "Internship",
    experience: "1st-2nd year students",
    description: "Help with device setup, software troubleshooting, and basic user support while learning from the IT team.",
    tags: ["Student friendly", "Tech", "With salary"],
    match: 94,
    url: "apply"
  },
  {
    id: 5,
    title: "Customer Service Representative",
    company: "Belairdirect",
    location: "North York, ON",
    salary: "$21/hr",
    type: "Hybrid",
    experience: "Entry level",
    description: "Answer customer questions, update account details, and help clients through phone and chat support.",
    tags: ["Entry level", "Hybrid", "Training provided"],
    match: 89,
    url: "apply"
  },
  {
    id: 6,
    title: "Delivery Associate",
    company: "Local Logistics",
    location: "Scarborough, ON",
    salary: "$19-$22/hr",
    type: "Full-time",
    experience: "G license preferred",
    description: "Deliver packages safely, follow routes, and keep track of deliveries using a mobile app.",
    tags: ["With salary", "Driver role", "Independent work"],
    match: 84,
    url: "apply"
  },
  {
    id: 7,
    title: "Administrative Assistant",
    company: "City of Toronto",
    location: "Toronto, ON",
    salary: "$26/hr",
    type: "Contract",
    experience: "Office experience preferred",
    description: "Assist with scheduling, email follow-up, data entry, and front-desk support for a city office team.",
    tags: ["Office", "With salary", "Organized work"],
    match: 87,
    url: "apply"
  },
  {
    id: 8,
    title: "Retail Sales Associate",
    company: "Apple",
    location: "Yorkdale, ON",
    salary: "Competitive pay",
    type: "Part-time",
    experience: "Customer-facing role",
    description: "Guide customers, demonstrate products, and help create a strong in-store shopping experience.",
    tags: ["Retail", "Tech", "Evening shifts"],
    match: 86,
    url: "apply"
  },
  {
    id: 9,
    title: "Remote Data Entry Clerk",
    company: "EasySearch Partner",
    location: "Remote - Ontario",
    salary: "$19/hr",
    type: "Remote",
    experience: "Entry level",
    description: "Enter and update records, check for missing information, and work independently from home.",
    tags: ["Remote", "Entry level", "Computer-based"],
    match: 90,
    url: "apply"
  }
];

const titleInput = document.getElementById("jobTitleSearch");
const locationInput = document.getElementById("jobLocationSearch");
const typeFilter = document.getElementById("jobTypeFilter");
const searchBtn = document.getElementById("searchJobsBtn");
const cardStack = document.getElementById("cardStack");
const jobGrid = document.getElementById("jobGrid");
const resultsCount = document.getElementById("resultsCount");
const dismissBtn = document.getElementById("dismissBtn");
const saveBtn = document.getElementById("saveBtn");
const savedJobsList = document.getElementById("savedJobsList");
const clearSavedBtn = document.getElementById("clearSavedBtn");
const filterChips = document.querySelectorAll(".filter-chip");
const swipeLeftStatus = document.querySelector(".swipe-status-left");
const swipeRightStatus = document.querySelector(".swipe-status-right");
const applyModal = document.getElementById("applyModal");
const applyForm = document.getElementById("applyForm");
const closeApplyModal = document.getElementById("closeApplyModal");
const applyJobTitle = document.getElementById("applyJobTitle");
const applyJobCompany = document.getElementById("applyJobCompany");
const applicantName = document.getElementById("applicantName");
const applicantEmail = document.getElementById("applicantEmail");

let activeQuickFilter = "";
let filteredJobs = [...jobs];
let currentIndex = 0;
let selectedJob = null;
let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("easySearchCurrentUser"));
}

function persistSavedJobs() {
  localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
}

function applyFilters() {
  const titleValue = titleInput.value.trim().toLowerCase();
  const locationValue = locationInput.value.trim().toLowerCase();
  const typeValue = typeFilter.value.trim().toLowerCase();

  filteredJobs = jobs.filter((job) => {
    const haystack = `${job.title} ${job.company} ${job.description} ${job.tags.join(" ")}`.toLowerCase();
    const locationText = job.location.toLowerCase();
    const matchesTitle = titleValue === "" || haystack.includes(titleValue);
    const matchesLocation = locationValue === "" || locationText.includes(locationValue);
    const matchesType = typeValue === "" || job.type.toLowerCase() === typeValue;

    let matchesQuickFilter = true;

    if (activeQuickFilter === "Entry level") {
      matchesQuickFilter =
        job.experience.toLowerCase().includes("entry") || job.tags.includes("Entry level");
    } else if (activeQuickFilter === "Student friendly") {
      matchesQuickFilter = job.tags.includes("Student friendly");
    } else if (activeQuickFilter === "Remote") {
      matchesQuickFilter = job.type === "Remote" || job.location.toLowerCase().includes("remote");
    } else if (activeQuickFilter === "$") {
      matchesQuickFilter = job.salary.includes("$");
    }

    return matchesTitle && matchesLocation && matchesType && matchesQuickFilter;
  });

  currentIndex = 0;
  updateResultsCount();
  renderCardStack();
  renderGrid();
}

function updateResultsCount() {
  resultsCount.textContent = `${filteredJobs.length} job${filteredJobs.length === 1 ? "" : "s"} found`;
}

function createCard(job, index) {
  const card = document.createElement("article");
  card.className = "swipe-card";
  card.dataset.id = job.id;
  card.style.zIndex = String(50 - index);
  card.style.transform = `scale(${1 - index * 0.04}) translateY(${index * 10}px)`;
  card.style.opacity = index > 2 ? "0" : "1";

  card.innerHTML = `
    <div class="swipe-card-inner">
      <div class="card-top">
        <div class="card-top-row">
          <span class="company-badge">${job.type}</span>
          <span class="match-badge">${job.match}% match</span>
        </div>
        <h3>${job.title}</h3>
        <div class="card-company">${job.company}</div>
      </div>
      <div class="card-body">
        <div class="job-meta">
          <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
          <span><i class="fa-solid fa-wallet"></i> ${job.salary}</span>
          <span><i class="fa-solid fa-briefcase"></i> ${job.experience}</span>
        </div>
        <p>${job.description}</p>
        <div class="tags">
          ${job.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <p class="swipe-card-help">Swipe right or tap the green heart to save this job.</p>
      </div>
    </div>
  `;

  addDragEvents(card, job);
  return card;
}

function renderCardStack() {
  cardStack.innerHTML = "";
  hideStatuses();

  const visibleJobs = filteredJobs.slice(currentIndex, currentIndex + 3);

  if (visibleJobs.length === 0) {
    cardStack.innerHTML = `<div class="empty-state">No more jobs in this filter. Try changing the search or quick filters.</div>`;
    return;
  }

  visibleJobs.reverse().forEach((job, reverseIndex) => {
    const originalIndex = visibleJobs.length - 1 - reverseIndex;
    const card = createCard(job, originalIndex);
    cardStack.appendChild(card);
  });
}

function renderGrid() {
  jobGrid.innerHTML = "";

  if (filteredJobs.length === 0) {
    jobGrid.innerHTML = `<div class="empty-state no-jobs-card">No jobs matched your search. Try a different title, location, or filter.</div>`;
    return;
  }

  filteredJobs.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <h3>${job.title}</h3>
      <p class="company">${job.company}</p>
      <p>${job.location}</p>
      <div class="card-mini-meta">
        <span class="tag">${job.type}</span>
        <span class="tag">${job.salary}</span>
      </div>
      <p>${job.experience}</p>
      <p>${job.description}</p>
      <a href="${job.url}" class="apply-link" data-job-id="${job.id}">Apply Now</a>
    `;
    jobGrid.appendChild(card);
  });
}

function renderSavedJobs() {
  savedJobsList.innerHTML = "";

  if (savedJobs.length === 0) {
    savedJobsList.innerHTML = `<p class="saved-empty">Jobs you like will show up here.</p>`;
    return;
  }

  savedJobs.forEach((job) => {
    const item = document.createElement("div");
    item.className = "saved-item";
    item.innerHTML = `
      <h4>${job.title}</h4>
      <p class="saved-company">${job.company}</p>
      <p>${job.location}</p>
      <p>${job.type} • ${job.salary}</p>
      <div class="saved-actions">
        <button type="button" class="saved-action-btn view-job-btn" data-job-id="${job.id}">View</button>
        <button type="button" class="saved-action-btn apply-job-btn" data-job-id="${job.id}">Apply</button>
        <button type="button" class="saved-action-btn remove-job-btn" data-job-id="${job.id}">Remove</button>
      </div>
    `;
    savedJobsList.appendChild(item);
  });
}

function saveJob(job) {
  const alreadySaved = savedJobs.some((savedJob) => savedJob.id === job.id);

  if (!alreadySaved) {
    savedJobs.unshift(job);
    persistSavedJobs();
    renderSavedJobs();
  }
}

function removeSavedJob(jobId) {
  savedJobs = savedJobs.filter((job) => job.id !== Number(jobId));
  persistSavedJobs();
  renderSavedJobs();
}

function focusJob(jobId) {
  const foundIndex = filteredJobs.findIndex((job) => job.id === Number(jobId));

  if (foundIndex !== -1) {
    currentIndex = foundIndex;
    renderCardStack();
    document.querySelector(".swipe-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const originalJob = jobs.find((job) => job.id === Number(jobId));
  if (!originalJob) {
    return;
  }

  titleInput.value = originalJob.title;
  locationInput.value = "";
  typeFilter.value = "";
  activeQuickFilter = "";
  filterChips.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === "");
  });
  applyFilters();

  const newIndex = filteredJobs.findIndex((job) => job.id === Number(jobId));
  if (newIndex !== -1) {
    currentIndex = newIndex;
    renderCardStack();
    document.querySelector(".swipe-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function advanceCard(direction) {
  const currentJob = filteredJobs[currentIndex];

  if (!currentJob) {
    return;
  }

  if (direction === "right") {
    saveJob(currentJob);
    showStatus("right");
  } else {
    showStatus("left");
  }

  currentIndex += 1;

  setTimeout(() => {
    hideStatuses();
    renderCardStack();
  }, 180);
}

function showStatus(direction) {
  if (direction === "left") {
    swipeLeftStatus.style.opacity = "1";
    swipeRightStatus.style.opacity = "0";
  } else {
    swipeRightStatus.style.opacity = "1";
    swipeLeftStatus.style.opacity = "0";
  }
}

function hideStatuses() {
  swipeLeftStatus.style.opacity = "0";
  swipeRightStatus.style.opacity = "0";
}

function addDragEvents(card, job) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  card.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX;
    card.setPointerCapture(event.pointerId);
    card.style.transition = "none";
  });

  card.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }

    currentX = event.clientX - startX;
    const rotate = currentX * 0.05;
    card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;

    if (currentX < -40) {
      showStatus("left");
    } else if (currentX > 40) {
      showStatus("right");
    } else {
      hideStatuses();
    }
  });

  function releaseCard() {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    card.style.transition = "transform 0.25s ease";

    if (currentX > 110) {
      card.style.transform = "translateX(600px) rotate(22deg)";
      saveJob(job);
      showStatus("right");
      currentIndex += 1;

      setTimeout(() => {
        hideStatuses();
        renderCardStack();
      }, 180);
    } else if (currentX < -110) {
      card.style.transform = "translateX(-600px) rotate(-22deg)";
      showStatus("left");
      currentIndex += 1;

      setTimeout(() => {
        hideStatuses();
        renderCardStack();
      }, 180);
    } else {
      card.style.transform = "translateX(0) rotate(0)";
      hideStatuses();
    }

    currentX = 0;
  }

  card.addEventListener("pointerup", releaseCard);
  card.addEventListener("pointercancel", releaseCard);
}

function openApplyModal(jobId) {
  const job = jobs.find((item) => item.id === Number(jobId));
  if (!job) {
    return;
  }

  selectedJob = job;
  applyJobTitle.textContent = `Apply for ${job.title}`;
  applyJobCompany.textContent = `${job.company} • ${job.location}`;

  const currentUser = getCurrentUser();
  if (currentUser) {
    applicantName.value = currentUser.fullName || "";
    applicantEmail.value = currentUser.email || "";
    const applicantPhoneField = document.getElementById("applicantPhone");
    if (applicantPhoneField) {
      applicantPhoneField.value = currentUser.phone || "";
    }
  } else {
    applicantName.value = "";
    applicantEmail.value = "";
    const applicantPhoneField = document.getElementById("applicantPhone");
    if (applicantPhoneField) {
      applicantPhoneField.value = "";
    }
  }

  applyModal.classList.remove("hidden");
  applyModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  applyModal.classList.add("hidden");
  applyModal.setAttribute("aria-hidden", "true");
  applyForm.reset();
  selectedJob = null;
}

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((button) => button.classList.remove("active"));
    chip.classList.add("active");
    activeQuickFilter = chip.dataset.filter;
    applyFilters();
  });
});

searchBtn.addEventListener("click", applyFilters);
titleInput.addEventListener("input", applyFilters);
locationInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);

dismissBtn.addEventListener("click", () => advanceCard("left"));
saveBtn.addEventListener("click", () => advanceCard("right"));

clearSavedBtn.addEventListener("click", () => {
  savedJobs = [];
  localStorage.removeItem("savedJobs");
  renderSavedJobs();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    advanceCard("left");
  } else if (event.key === "ArrowRight") {
    advanceCard("right");
  } else if (event.key === "Escape" && !applyModal.classList.contains("hidden")) {
    closeModal();
  }
});

document.addEventListener("click", (event) => {
  const applyButton = event.target.closest(".apply-link");
  if (applyButton) {
    event.preventDefault();
    openApplyModal(applyButton.dataset.jobId);
    return;
  }

  const removeButton = event.target.closest(".remove-job-btn");
  if (removeButton) {
    removeSavedJob(removeButton.dataset.jobId);
    return;
  }

  const viewButton = event.target.closest(".view-job-btn");
  if (viewButton) {
    focusJob(viewButton.dataset.jobId);
    return;
  }

  const savedApplyButton = event.target.closest(".apply-job-btn");
  if (savedApplyButton) {
    openApplyModal(savedApplyButton.dataset.jobId);
  }
});

closeApplyModal.addEventListener("click", closeModal);

applyModal.addEventListener("click", (event) => {
  if (event.target === applyModal) {
    closeModal();
  }
});

applyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!selectedJob) {
    return;
  }

  const resumeInput = document.getElementById("applicantResume");
  const resumeFile = resumeInput.files[0];

  if (!resumeFile) {
    alert("Please upload your resume before submitting.");
    return;
  }

  const applications = JSON.parse(localStorage.getItem("easySearchApplications")) || [];
  applications.push({
    jobId: selectedJob.id,
    title: selectedJob.title,
    company: selectedJob.company,
    name: document.getElementById("applicantName").value.trim(),
    email: document.getElementById("applicantEmail").value.trim(),
    phone: document.getElementById("applicantPhone").value.trim(),
    resumeName: resumeFile.name,
    appliedAt: new Date().toISOString()
  });

  localStorage.setItem("easySearchApplications", JSON.stringify(applications));
  alert(`Application sent for ${selectedJob.title} at ${selectedJob.company}!\nResume uploaded: ${resumeFile.name}`);
  closeModal();
});

/* USERNAME + LOGOUT */
document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("easySearchCurrentUser"));
  const welcomeUser = document.getElementById("welcomeUser");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user && user.fullName) {
    if (welcomeUser) {
      welcomeUser.textContent = user.fullName;
    }

    if (loginBtn) {
      loginBtn.style.display = "none";
    }

    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("easySearchCurrentUser");
      localStorage.removeItem("username");
      window.location.href = "../HtmlFiles/login.html";
    });
  }
});

renderSavedJobs();
applyFilters();