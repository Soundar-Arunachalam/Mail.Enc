async function initializePage() {
    const hasKeys = await KeyUtils.hasKeys();
    if (!hasKeys) {
        alert('No keys found. Please generate or import keys in Key Management.');
        document.getElementById('encryptBtn').disabled = true;
        document.getElementById('decryptBtn').disabled = true;
    }

    const userInfo = await KeyUtils.getCurrentUserInfo();
    if (userInfo) {
        document.getElementById('userInfo').textContent = 
            `Current User: ${userInfo.name} (${userInfo.email})`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    const messageInput = document.getElementById('message');
    const recipientKeyInput = document.getElementById('recipientKey');
    const resultOutput = document.getElementById('result');
    
    // Encrypt Message
    document.getElementById('encryptBtn').addEventListener('click', async function() {
        try {
            const message = messageInput.value;
            const recipientKeyArmored = recipientKeyInput.value;

            if (!message || !recipientKeyArmored) {
                alert('Please provide both message and recipient\'s public key');
                return;
            }

            // Read recipient's public key
            const recipientPublicKey = await openpgp.readKey({ armoredKey: recipientKeyArmored });

            // Get sender's private key from storage
            const { privateKey: senderPrivateKeyArmored } = await chrome.storage.local.get('privateKey');
            if (!senderPrivateKeyArmored) {
                alert('No private key found. Please generate or import your key pair first.');
                return;
            }

            const senderPrivateKey = await openpgp.readPrivateKey({ armoredKey: senderPrivateKeyArmored });

            // Encrypt and sign the message
            const encrypted = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: message }),
                encryptionKeys: recipientPublicKey,
                signingKeys: senderPrivateKey
            });

            resultOutput.value = encrypted;
        } catch (error) {
            console.error('Encryption failed:', error);
            alert('Failed to encrypt message. Please check the public key format.');
        }
    });

    // Decrypt Message
    document.getElementById('decryptBtn').addEventListener('click', async function() {
        try {
            const encryptedMessage = messageInput.value;

            if (!encryptedMessage) {
                alert('Please provide an encrypted message to decrypt');
                return;
            }

            // Get private key from storage
            const { privateKey: privateKeyArmored } = await chrome.storage.local.get('privateKey');
            if (!privateKeyArmored) {
                alert('No private key found. Please import your private key first.');
                return;
            }

            const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });

            // Decrypt the message
            const message = await openpgp.readMessage({
                armoredMessage: encryptedMessage
            });

            const { data: decrypted } = await openpgp.decrypt({
                message,
                decryptionKeys: privateKey
            });

            resultOutput.value = decrypted;
        } catch (error) {
            console.error('Decryption failed:', error);
            alert('Failed to decrypt message. Make sure you have the correct private key.');
        }
    });

    // Copy to Clipboard
    document.getElementById('copyBtn').addEventListener('click', function() {
        resultOutput.select();
        document.execCommand('copy');
        alert('Copied to clipboard!');
    });
}); 