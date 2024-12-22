let openpgp;
const dbName = "KeyStore";
const storeName = "Keys";
// Initialize OpenPGP
async function initializeOpenPGP() {
  try {
    // For Chrome extension, we need to wait for the script to load
    if (typeof window.openpgp === 'undefined') {
      // Wait for a short time to ensure the script is loaded
      await new Promise(resolve => setTimeout(resolve, 500));
      if (typeof window.openpgp === 'undefined') {
        throw new Error('OpenPGP.js is not loaded');
      }
    }
    openpgp = window.openpgp;
    console.log('OpenPGP.js initialized successfully');
  } catch (error) {
    console.error('Failed to initialize OpenPGP:', error);
    alert('Failed to initialize encryption system. Please check if the extension is properly installed.');
  }
}
function initDB() {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = (event) => {
          const db = event.target.result;

          // Create an object store
          if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: "id" });
          }
      };

      request.onsuccess = (event) => {
          resolve(event.target.result);
      };

      request.onerror = (event) => {
          reject(event.target.error);
      };
  });
}
async function saveKeys(name,email,publicKey, privateKey) {
  const db = await initDB();

  return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const d=new Date();
      console.log(d.getDate() +"/"+ d.getMonth()+"/" +d.getFullYear());

      const keyData = {
          id: "user-key",
          publicKey: publicKey,
          privateKey: privateKey,
          name:name,
          email:email,
          date: d.getDate() +"/"+ d.getMonth()+"/" +d.getFullYear(),
      };

      const request = store.put(keyData);

      request.onsuccess = () => {
          console.log("Keys saved successfully!");
          resolve();
      };

      request.onerror = (event) => {
          console.error("Error saving keys:", event.target.error);
          reject(event.target.error);
      };
  });
}

async function getKeys() {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        const request = store.get("user-key");

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (event) => {
            console.error("Error retrieving keys:", event.target.error);
            reject(event.target.error);
        };
    });
}











// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', initializeOpenPGP);

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // If OpenPGP isn't initialized yet, try initializing it again
  if (!openpgp) {
    await initializeOpenPGP();
    if (!openpgp) {
      alert('Encryption system is not initialized. Please reload the page.');
      return;
    }
  }

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  
  // Validate password match
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    // Show loading indicator
    const submitButton = form.querySelector('input[type=submit]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Generating Keys...';
    

    const keys = await genKeyPair(name, email, password);
    
    // Store the keys or handle them as needed
    console.log('Public Key:', keys.publicKey);
    console.log('Private Key:', keys.privateKey);
    console.log('Revocation Certificate:', keys.revocationCertificate);
    console.log(keys.publicKey);
    await saveKeys(name,email,keys.publicKey, keys.privateKey);

    const key = await getKeys();
    console.log("Retrieved Keys:", key);
    alert('Keys generated successfully!');
  } catch (error) {
    console.error('Error generating keys:', error);
    alert('Error generating keys: ' + error.message);
  } 
    
});

async function genKeyPair(name, email, password) {
  try {
    return await openpgp.generateKey({
      type: 'rsa',
      rsaBits: 2048,
      userIDs: [{ name, email }],
      passphrase: password
    });
  } catch (error) {
    throw new Error('Key generation failed: ' + error.message);
  }
}

document.getElementById("movetokeymanagement").addEventListener("click",(e)=>{
window.open("managekeys.html","_blanc");
})
const toggleButton = document.getElementById("toggleButton");
  const slider = document.getElementById("Slider");

  // Toggle functionality
  toggleButton.addEventListener("click", () => {
    if (slider.classList.contains("slide-up")) {
      slider.classList.remove("slide-up");
      slider.classList.add("slide-down");
      toggleButton.innerText=">>Advanced"
    } else {
    toggleButton.innerText="<<Advanced"
      slider.classList.remove("slide-down");
      slider.classList.add("slide-up");
    }
    
  });
  document.addEventListener("DOMContentLoaded", () => {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
  
    // Add onchange event listeners for both password and confirm password fields
    password.addEventListener("change", validatePasswordMatch);
    confirmPassword.addEventListener("change", validatePasswordMatch);
  
    // Function to validate the password match
    function validatePasswordMatch() {
      if (confirmPassword.value === password.value && confirmPassword.value !== "") {
        confirmPassword.classList.add("is-valid");
        confirmPassword.classList.remove("is-invalid");
        password.classList.add("is-valid");
        password.classList.remove("is-invalid");
      } else {
        confirmPassword.classList.add("is-invalid");
        confirmPassword.classList.remove("is-valid");
        password.classList.add("is-invalid");
        password.classList.remove("is-valid");
      }
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
  
    // Add onchange event listeners for both password and confirm password fields
    password.addEventListener("change", validatePasswordMatch);
    confirmPassword.addEventListener("change", validatePasswordMatch);
  
    // Function to validate the password match
    function validatePasswordMatch() {
      if (confirmPassword.value === password.value && confirmPassword.value !== "") {
        confirmPassword.classList.add("is-valid");
        confirmPassword.classList.remove("is-invalid");
        password.classList.add("is-valid");
        password.classList.remove("is-invalid");
      } else {
        confirmPassword.classList.add("is-invalid");
        confirmPassword.classList.remove("is-valid");
        password.classList.add("is-invalid");
        password.classList.remove("is-valid");
      }
    }
    
  });
