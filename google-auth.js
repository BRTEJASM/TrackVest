// Create a new file called google-auth.js
// This will be included in both login.html and signup.html

// Google OAuth Client ID - You'll need to create this in Google Cloud Console
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your actual client ID

// Function to initialize Google Sign-In
function initGoogleAuth() {
  // Load the Google Sign-In API script
  const script = document.createElement('script');
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    // Initialize Google Sign-In button
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn,
      auto_select: false
    });

    // Render the button
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'), 
      { 
        theme: "outline", 
        size: "large",
        type: "standard",
        shape: "rectangular",
        text: "continue_with",
        logo_alignment: "center"
      }
    );
  };
}

// Function to handle Google Sign-In response
function handleGoogleSignIn(response) {
  // Parse the JWT token from Google
  const payload = parseJwt(response.credential);
  
  if (payload) {
    const userData = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      authMethod: 'google'
    };

    // Store user data in LocalStorage
    localStorage.setItem("userData", JSON.stringify(userData));
    
    // Set login state
    sessionStorage.setItem("isLoggedIn", "true");
    
    // Redirect to homepage
    window.location.href = "homepage.html";
  } else {
    console.error("Failed to parse Google sign-in response");
    alert("Google sign-in failed. Please try again.");
  }
}

// Helper function to parse JWT token
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT token:", error);
    return null;
  }
}

// Export functions
window.initGoogleAuth = initGoogleAuth;
window.handleGoogleSignIn = handleGoogleSignIn;