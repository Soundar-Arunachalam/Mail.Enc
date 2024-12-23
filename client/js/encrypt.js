document.addEventListener('DOMContentLoaded', function() {
    // Handle key generation
    document.getElementById('generateKeyForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const passphrase = document.getElementById('passphrase').value;

            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';

            // Generate key pair
            const { privateKey, publicKey } = await openpgp.generateKey({
                type: 'rsa',
                rsaBits: 4096,
                userIDs: [{ name, email }],
                passphrase
            });

            // Store keys
            await chrome.storage.local.set({
                privateKey: privateKey,
                publicKey: publicKey
            });

            // Show success message
            alert('Keys generated successfully! Your public key has been copied to clipboard.');
            navigator.clipboard.writeText(publicKey);

            // Reset form
            this.reset();
        } catch (error) {
            console.error('Key generation failed:', error);
            alert('Failed to generate keys: ' + error.message);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-key me-2"></i>Generate Keys';
        }
    });

    // Handle encryption
    document.getElementById('encryptForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        try {
            const recipientKey = document.getElementById('recipientKey').value;
            const message = document.getElementById('message').value;
            const files = document.getElementById('attachments').files;

            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Encrypting...';

            // Encrypt message
            const encrypted = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: message }),
                encryptionKeys: await openpgp.readKey({ armoredKey: recipientKey })
            });

            // Handle file encryption if files are present
            if (files.length > 0) {
                for (const file of files) {
                    const fileData = await file.arrayBuffer();
                    const encryptedFile = await openpgp.encrypt({
                        message: await openpgp.createMessage({ 
                            binary: new Uint8Array(fileData) 
                        }),
                        encryptionKeys: await openpgp.readKey({ 
                            armoredKey: recipientKey 
                        })
                    });

                    // Create download link for encrypted file
                    const blob = new Blob([encryptedFile], { 
                        type: 'application/pgp-encrypted' 
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${file.name}.pgp`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            }

            // Show result
            document.getElementById('result').value = encrypted;

        } catch (error) {
            console.error('Encryption failed:', error);
            alert('Failed to encrypt: ' + error.message);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-lock me-2"></i>Encrypt';
        }
    });

    // Handle copy result
    document.getElementById('copyResult').addEventListener('click', function() {
        const result = document.getElementById('result');
        navigator.clipboard.writeText(result.value);
        this.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-copy me-2"></i>Copy to Clipboard';
        }, 2000);
    });
}); 