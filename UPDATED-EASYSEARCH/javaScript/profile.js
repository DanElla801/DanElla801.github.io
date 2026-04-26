const loggedOutProfile = document.getElementById("loggedOutProfile");
const loggedInProfile = document.getElementById("loggedInProfile");
const profileForm = document.getElementById("profileForm");
const logoutBtn = document.getElementById("logoutBtn");

const profileDisplayName = document.getElementById("profileDisplayName");
const profileDisplayEmail = document.getElementById("profileDisplayEmail");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const profileLocation = document.getElementById("profileLocation");
const profileJobType = document.getElementById("profileJobType");
const profileSkills = document.getElementById("profileSkills");

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("easySearchCurrentUser"));
}

function getUsers() {
  return JSON.parse(localStorage.getItem("easySearchUsers")) || [];
}

function saveCurrentUser(user) {
  localStorage.setItem("easySearchCurrentUser", JSON.stringify(user));
  localStorage.setItem("username", user.fullName);
}

function loadProfile() {
  const user = getCurrentUser();

  if (!user) {
    loggedOutProfile.classList.remove("hidden");
    loggedInProfile.classList.add("hidden");
    return;
  }

  loggedOutProfile.classList.add("hidden");
  loggedInProfile.classList.remove("hidden");

  profileDisplayName.textContent = user.fullName || "EasySearch User";
  profileDisplayEmail.textContent = user.email || "No email saved";
  profileName.value = user.fullName || "";
  profileEmail.value = user.email || "";
  profilePhone.value = user.phone || "";
  profileLocation.value = user.location || "";
  profileJobType.value = user.preferredJobType || "";
  profileSkills.value = user.skills || "";
}

profileForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert("Please log in first.");
    return;
  }

  const updatedUser = {
    ...currentUser,
    fullName: profileName.value.trim(),
    email: profileEmail.value.trim().toLowerCase(),
    phone: profilePhone.value.trim(),
    location: profileLocation.value.trim(),
    preferredJobType: profileJobType.value,
    skills: profileSkills.value.trim()
  };

  const users = getUsers().map((user) => {
    if (user.email === currentUser.email) {
      return updatedUser;
    }
    return user;
  });

  localStorage.setItem("easySearchUsers", JSON.stringify(users));
  saveCurrentUser(updatedUser);
  loadProfile();
  alert("Profile updated successfully.");
});

logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("easySearchCurrentUser");
  localStorage.removeItem("username");
  alert("You have been logged out.");
  window.location.href = "index.html";
});

loadProfile();
