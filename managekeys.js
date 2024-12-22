document.getElementById("generate-btn").addEventListener("click",(e)=>{
window.open("generatekey.html","_blank");
});
document.getElementById("export-btn").addEventListener("click",(e)=>{
    downloadPublicKey();
});
const keyList=[];
document.getElementById("import-btn").addEventListener("click",(e)=>{
console.log("called");
    document.getElementById("file-input").click();
})
const dbName="KeyStore"
const storeName="Keys"
// slideup/slidedown
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
document.addEventListener("DOMContentLoaded",async ()=>{
    const key=await getKeys();
    console.log(key);
    const table=document.getElementById("tableBody");
    table.innerHTML=`<tr><td><i class="fa-solid fa-key"></i></td><td>${key.name}</td><td>${key.email}</td><td>${key.id}</td><td>${key.date}</td></tr>`
    
})
async function downloadPublicKey() {
    // Simulate a public key content
    const key=await getKeys();
    const publicKey = key.publicKey;

    // Create a Blob object with the public key
    const blob = new Blob([publicKey], { type: 'text/plain' });

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${key.name.replace(/\s+/g, '_')}_public_key.asc`; // Specify the file name

    // Append the link to the document, click it, then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  function importPublicKey(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.asc')) {
      alert("Please upload a valid .asc file.");
      return;
    }

    // Read file content
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;

      // Parse key details (simplified parsing)
      const publicKey = extractPublicKey(content);
      const name = extractName(file.name);
      const email = extractEmail(content);
      const importedDate = new Date().toLocaleString();

      // Append details to the list
      appendKeyDetails(publicKey, name, email, importedDate);
    };

    reader.onerror = function () {
      alert("Error reading file. Please try again.");
    };

    reader.readAsText(file);
  }

  // Function to extract public key
  function extractPublicKey(content) {
    const keyMatch = content.match(/-----BEGIN PGP PUBLIC KEY BLOCK-----(.*)-----END PGP PUBLIC KEY BLOCK-----/s);
    return keyMatch ? keyMatch[0] : "Public key not found";
  }

  // Function to extract name
  function extractName(content) {
    const nameMatch = content.substring(0,content.indexOf('_'))
;    return nameMatch ? nameMatch : "Name not found";
  }

  // Function to extract email
  function extractEmail(content) {
    const emailMatch = content.match(/<([^>]+)>/);
    return emailMatch ? emailMatch[1] : "Email not found";
  }

  // Function to append details to the list
  function appendKeyDetails(publicKey, name, email, importedDate) {
    const list = document.getElementById('key-list');

    const listItem = document.createElement('li');
    const listObj ={
        name:name,
        publicKey:publicKey,
        importedDate:importedDate,
    };
    console.log(listObj);
    keyList.push(listObj);
    
        const obj=listObj;
    const table=document.querySelector("table");
        table.innerHTML+=`<tr><td><i class="fa-solid fa-key"></i></td><td>${obj.name}</td><td></td><td></td><td>${obj.importedDate}</td></tr>`
    
  }
  document.getElementById('file-input').addEventListener("change",(e)=>{
importPublicKey(e);
  })