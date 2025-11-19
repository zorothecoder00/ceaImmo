// lib/crypto.ts
import crypto from "crypto";    

const keyBase64 = process.env.ENCRYPTION_KEY_BASE64;
if (!keyBase64) throw new Error("ENCRYPTION_KEY_BASE64 not set");
const KEY = Buffer.from(keyBase64, "base64"); // 32 bytes expected

// ✅ Type générique pour les objets JSON
type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

export function encryptJSON(obj: JSONValue) {
  const iv = crypto.randomBytes(12); // AES-GCM 12 bytes IV
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const plaintext = Buffer.from(JSON.stringify(obj), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64"); // iv(12)|tag(16)|ciphertext
}

export function decryptJSON(b64: string): JSONValue {
  const buf = Buffer.from(b64, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ciphertext = buf.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(out.toString("utf8"));
}

// HMAC helper (for webhook signature)
export function computeHMAC(secret: string, payload: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}
