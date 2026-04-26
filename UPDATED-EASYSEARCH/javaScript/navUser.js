document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("easySearchCurrentUser"));
  const loginLinks = document.querySelectorAll("nav .login, #loginBtn");
  const registerLinks = document.querySelectorAll("nav .register");
  const welcomeUser = document.getElementById("welcomeUser");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!currentUser) {
    loginLinks.forEach((link) => {
      link.style.display = "inline-block";
      link.href = "../HtmlFiles/login.html";
      link.textContent = "Login / Sign up";
    });
    registerLinks.forEach((link) => {
      link.style.display = "inline-block";
      link.href = "../HtmlFiles/login.html";
      link.textContent = "Register";
    });
    if (welcomeUser) welcomeUser.textContent = "";
    if (logoutBtn) logoutBtn.style.display = "none";
    return;
  }

  loginLinks.forEach((link) => {
    link.style.display = "inline-block";
    link.innerHTML = `<i class="fa fa-user"></i> Profile`;
    link.href = "../HtmlFiles/profile.html";
    link.title = `Profile for ${currentUser.fullName || "EasySearch User"}`;
  });

  registerLinks.forEach((link) => {
    link.style.display = "inline-block";
    link.textContent = "Profile";
    link.href = "../HtmlFiles/profile.html";
  });

  if (welcomeUser) {
    welcomeUser.textContent = currentUser.fullName ? `Hi, ${currentUser.fullName}` : "";
  }

  if (logoutBtn) {
    logoutBtn.style.display = "inline-block";
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("easySearchCurrentUser");
      localStorage.removeItem("username");
      window.location.href = "../HtmlFiles/login.html";
    });
  }
});
