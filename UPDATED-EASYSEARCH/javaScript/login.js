const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const tabButtons = document.querySelectorAll(".tab-btn");

function getUsers() {
  return JSON.parse(localStorage.getItem("easySearchUsers")) || [];
}

function saveUsers(users) {
  localStorage.setItem("easySearchUsers", JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem("easySearchCurrentUser", JSON.stringify(user));
  localStorage.setItem("username", user.fullName);
}

function showForm(formName) {
  const isLogin = formName === "login";

  if (loginForm) {
    loginForm.classList.toggle("active-form", isLogin);
  }

  if (signupForm) {
    signupForm.classList.toggle("active-form", !isLogin);
  }

  tabButtons.forEach((button) => {
    const shouldBeActive =
      button.textContent.trim().toLowerCase() === formName;
    button.classList.toggle("active", shouldBeActive);
  });
}

window.showForm = showForm;

document.addEventListener("DOMContentLoaded", function () {
  showForm("login");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = loginForm
        .querySelector('input[type="email"]')
        .value.trim()
        .toLowerCase();

      const password = loginForm
        .querySelector('input[type="password"]')
        .value;

      const users = getUsers();

      const matchedUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (matchedUser) {
        setCurrentUser(matchedUser);
        alert(`Welcome back, ${matchedUser.fullName}!`);
        window.location.href = "index.html";
      } else {
        alert("No matching account found. Please sign up first or check your password.");
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const fullName = signupForm
        .querySelector('input[type="text"]')
        .value.trim();

      const email = signupForm
        .querySelector('input[type="email"]')
        .value.trim()
        .toLowerCase();

      const passwordInputs = signupForm.querySelectorAll('input[type="password"]');
      const password = passwordInputs[0].value;
      const confirmPassword = passwordInputs[1].value;

      const users = getUsers();
      const existingUser = users.find((user) => user.email === email);

      if (!fullName || !email || !password || !confirmPassword) {
        alert("Please fill in all signup fields.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      if (existingUser) {
        alert("An account with that email already exists. Please log in instead.");
        showForm("login");
        return;
      }

      const newUser = {
        fullName,
        email,
        password
      };

      users.push(newUser);
      saveUsers(users);
      setCurrentUser(newUser);

      alert("Account created successfully!");
      window.location.href = "index.html";
    });
  }
});