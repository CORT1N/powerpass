const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function getKeyFromStorage() {
  const base64Key = sessionStorage.getItem("aesKey");
  if (!base64Key) return null;
  const raw = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    "raw",
    raw,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptText(plainText, key) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plainText)
  );
  const buffer = new Uint8Array(encrypted);
  const combined = new Uint8Array(iv.length + buffer.length);
  combined.set(iv);
  combined.set(buffer, iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptText(encryptedTextBase64, key) {
  const combined = Uint8Array.from(atob(encryptedTextBase64), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  return decoder.decode(decrypted);
}

const b64url = (arr: Uint8Array) =>
  btoa(String.fromCharCode(...arr))
    .replace(/\+/g, "-").replace(/\//g, "_");

const fromB64url = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));

export async function encryptForShare(plain: string) {
  const keyRaw = crypto.getRandomValues(new Uint8Array(32));
  const key = await crypto.subtle.importKey("raw", keyRaw, "AES-GCM", false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ctBuf = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(plain))
  );

  return {
    ciphertext: b64url(ctBuf),
    nonce: b64url(iv),
    key: b64url(keyRaw),
  };
}

export async function decryptFromShare(
  ciphertext64: string,
  nonce64: string,
  key64: string
) {
  const keyRaw = fromB64url(key64);
  const key = await crypto.subtle.importKey("raw", keyRaw, "AES-GCM", false, ["decrypt"]);
  const ct = fromB64url(ciphertext64);
  const iv = fromB64url(nonce64);

  const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return decoder.decode(plainBuf);
}