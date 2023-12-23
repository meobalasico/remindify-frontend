import {
  backendURL,
  successNotification,
  errorNotification,
  getLoggedUser,
} from "../utils/utils.js";

async function displayUserProfile() {
  try {
    const response = await fetch(backendURL + "/api/profile/show", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const userData = await response.json();
    if (userData.firstname) {
      document.getElementById("first_name").textContent = userData.firstname;
    }
    if (userData.lastname) {
      document.getElementById("last_name").textContent = userData.lastname;
    }
    if (userData.email) {
      document.getElementById("email").value = userData.email;
    }
    if (userData.image) {
      // Set the user's image URL to the img src attribute
      document.getElementById("profile_image").src =
        backendURL + "/storage/" + userData.image;
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    // Handle error notification here
  }
}

// Add an event listener when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  displayUserProfile();
});

//

// Function to update user image
function getUserId() {
  return localStorage.getItem("userId");
}

// Function to update user image
async function updateUserImage(userId, imageData) {
  try {
    const response = await fetch(`${backendURL}/api/user/image/${userId}`, {
      method: "POST", // Use POST method
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
        "X-HTTP-Method-Override": "PUT", // Simulate PUT method using header
      },
      body: imageData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user image");
    }

    successNotification("User image updated successfully");
    // Refresh user profile after updating the image
    displayUserProfile();
  } catch (error) {
    console.error("Error updating user image:", error);
    errorNotification(error.message || "Failed to update user image");
  }
}

// Add event listener for the upload button
document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.addEventListener("change", handleFileInputChange);
  }

  const uploadButton = document.getElementById("button");
  if (uploadButton) {
    uploadButton.addEventListener("click", async () => {
      const userId = getUserId(); // Retrieve user ID from localStorage
      const imageFile = fileInput.files[0];

      if (!imageFile) {
        errorNotification("Please select an image");
        return;
      }

      const formData = new FormData();
      formData.append("image", imageFile);

      updateUserImage(userId, formData);
    });
  }
});

// Define the handleFileInputChange function
// Function to handle file input change
function handleFileInputChange(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  // Your logic for handling the selected file here
  // For example, you can preview the selected image before uploading it
}

// Add an event listener for file input change
document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.addEventListener("change", handleFileInputChange);
  }
});

//
//PASSWORD/EMAIL UPDATE

async function updateEmail(userId, email) {
  try {
    console.log("Updating email:", email);
    const requestBody = new URLSearchParams();
    requestBody.append("email", email);
    requestBody.append("_method", "PUT");

    const response = await fetch(`${backendURL}/api/user/email/${userId}`, {
      method: "POST", // Using POST method
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update email");
    }

    successNotification("Email updated successfully");
  } catch (error) {
    console.error("Error updating email:", error);
    errorNotification(error.message || "Failed to update email");
  }
}

async function updatePassword(userId, password, password_confirmation) {
  try {
    // Check if the password meets the minimum length requirement
    if (password.length < 8) {
      throw new Error("Password should be at least 8 characters long");
    }

    console.log("Updating password:", password);
    const requestBody = new URLSearchParams();
    requestBody.append("password", password);
    requestBody.append("password_confirmation", password_confirmation);
    requestBody.append("_method", "PUT");

    const response = await fetch(`${backendURL}/api/user/password/${userId}`, {
      method: "POST", // Using POST method
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update password");
    }

    successNotification("Password updated successfully");
    alert("Password updated successfully"); // Alert for successful password change
    resetUI(); // Reset the UI after successful password change
  } catch (error) {
    console.error("Error updating password:", error);
    errorNotification(error.message || "Failed to update password");
  }
}

function resetUI() {
  // Reset the form or update UI elements here
  document.getElementById("password").value = "";
  document.getElementById("password_confirmation").value = "";
}

function updateEmailAndPassword(event) {
  event.preventDefault();
  const userId = getUserId();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const password_confirmation = document
    .getElementById("password_confirmation")
    .value.trim();

  if (email) {
    updateEmail(userId, email);
  }

  if (password && password_confirmation && password === password_confirmation) {
    // Check if the password meets the minimum length requirement
    if (password.length >= 8) {
      updatePassword(userId, password, password_confirmation);
    } else {
      // Display a popup notification for the password length requirement
      alert("Password should be at least 8 characters long");
    }
  } else {
    errorNotification("The password field confirmation does not match.");
    alert("Passwords do not match");
  }
}

// Add event listener for form submit
document.addEventListener("DOMContentLoaded", function () {
  const updateForm = document.getElementById("updateform");
  if (updateForm) {
    updateForm.addEventListener("submit", updateEmailAndPassword);
  }
});
