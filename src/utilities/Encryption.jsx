// utils/storage-aes.js
import CryptoJS from "crypto-js";

export function encryptForStorage(string, secret) {
  // const json = JSON.stringify(obj);
  return CryptoJS.AES.encrypt(string, secret).toString();
}

export function decryptFromStorage(ciphertext, secret) {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    const string = bytes.toString(CryptoJS.enc.Utf8);
    return string;
  } catch (e) {
    console.warn("Failed to decrypt:", e);
    return null;
  }
}
