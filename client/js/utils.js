const KeyUtils = {
    async getCurrentUserInfo() {
        const { userInfo } = await chrome.storage.local.get('userInfo');
        return userInfo || null;
    },

    async getPublicKey() {
        const { publicKey } = await chrome.storage.local.get('publicKey');
        return publicKey || null;
    },

    async getPrivateKey() {
        const { privateKey } = await chrome.storage.local.get('privateKey');
        return privateKey || null;
    },

    async hasKeys() {
        const { publicKey, privateKey } = await chrome.storage.local.get(['publicKey', 'privateKey']);
        return !!(publicKey && privateKey);
    }
}; 