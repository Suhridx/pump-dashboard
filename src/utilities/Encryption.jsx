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


/**
 * Simple deterministic password generator from username + role.
 * Not cryptographically secure — good for convenience/middle-ground use.
 *
 * @param {string} username
 * @param {string} role
 * @param {number} length - desired password length (default 16)
 * @returns {string}
 */
export function getKeyFromUserNameAndRole(username, role, length = 16) {
  if (typeof username !== "string" || typeof role !== "string") {
    throw new TypeError("username and role must be strings");
  }
  // compact charset: lowercase + uppercase + digits + a few symbols
  const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
  const csLen = CHARSET.length;

  // simple 32-bit hash (FNV-1a variant)
  function hash32(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  // combine inputs into stable seed
  const seedBase = `${username.trim()}:${role.trim()}`;
  let seed = hash32(seedBase);

  // small LCG PRNG: seed -> next
  function next() {
    // constants from Numerical Recipes LCG
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed;
  }

  // Build password by mapping PRNG values to charset
  let out = "";
  for (let i = 0; i < length; i++) {
    const r = next();
    out += CHARSET[r % csLen];
  }

  return out;
}

