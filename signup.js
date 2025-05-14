document.addEventListener("DOMContentLoaded", function () {
  // If user is already logged in, redirect to homepage
  if (sessionStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "homepage.html";
    return;
  }

  // Reset container height function (assumes there's a container2 element like in login.html)
  function resetContainerHeight() {
    const container = document.querySelector(".container2");
    if (!container) return;
    
    // Check if there are any errors
    const hasErrors = Array.from(document.querySelectorAll('.error'))
      .some(el => el.textContent !== '');
    
    // Set container height based on errors
    container.style.height = hasErrors ? "600px" : "500px";
  }

  document.getElementById("sign-up").addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("remember").checked;

    const emailRegex = /^[A-Za-z0-9]+(?:[.%_+][A-Za-z0-9]+)*@[A-Za-z0-9]+\.[A-Za-z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])(?=.*[\W_]).{8,}$/;

    // Clear previous errors
    document.querySelectorAll(".error").forEach((curElem) => {
      curElem.textContent = "";
    });

    let isValid = true;

    if (!emailRegex.test(email)) {
      document.getElementById("emailerror").textContent = "Email is not valid";
      isValid = false;
    }

    if (!passwordRegex.test(password)) {
      document.getElementById("passworderror").textContent =
        "Password must have 8+ characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
      isValid = false;
    }

    // Update container height if needed
    resetContainerHeight();

    if (isValid) {
      // Store user data
      localStorage.setItem("userData", JSON.stringify({ email, password }));
      localStorage.setItem("isSignedUp", "true");
      
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      // For direct login after signup, uncomment the next line:
      // sessionStorage.setItem("isLoggedIn", "true");

      alert("Sign up Successful! Redirecting to login...");
      window.location.href = "login.html";
    }
  });
  
  // Home link navigation if it exists on signup page
  const homeLink = document.querySelector(".home");
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (sessionStorage.getItem("isLoggedIn") === "true") {
        window.location.href = "homepage.html";
      } else {
        // Redirect to landing page if not logged in
        window.location.href = "index.html";
      }
    });
  }
});
// Add this to your existing signup.js file
// Make sure you've included google-auth.js in your signup.html

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Google Sign-In
  if (typeof initGoogleAuth === 'function') {
    initGoogleAuth();
  }
  
  // Create a custom handler for the signup page if needed
  window.handleGoogleSignUp = function(response) {
    // Parse the JWT token
    const payload = parseJwt(response.credential);
    
    if (payload) {
      // Store user info
      const userData = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        authMethod: 'google'
      };
      
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("isSignedUp", "true");
      
      // Either redirect to login or automatically log them in
      // Option 1: Auto-login
      sessionStorage.setItem("isLoggedIn", "true");
      window.location.href = "homepage.html";
      
      // Option 2: Redirect to login
      // alert("Sign up with Google Successful! Redirecting to login...");
      // window.location.href = "login.html";
    } else {
      console.error("Failed to parse Google sign-up response");
      alert("Google sign-up failed. Please try again.");
    }
  };
});
// document.addEventListener("DOMContentLoaded", function () {
//   initGoogleAuth();
// });