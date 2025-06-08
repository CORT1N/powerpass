import api from "./api";
import { encryptText, decryptText, getKeyFromStorage } from "../utils/crypto";

export interface PasswordData {
  id?: number;
  name: string;
  username?: string;
  category?: string;
  password: string;
  encrypted_password?: string;
  shared_link?: string | null;
}

export async function fetchPasswords(): Promise<PasswordData[]> {
  const key = await getKeyFromStorage();
  if (!key) throw new Error("Clé de chiffrement indisponible");

  const response = await api.get("/passwords/");
  const passwords = response.data as PasswordData[];

  const decryptedPasswords = await Promise.all(
    passwords.map(async (p) => {
      const decrypted = p.encrypted_password ? await decryptText(p.encrypted_password, key) : "";
      return { ...p, password: decrypted };
    })
  );
  return decryptedPasswords;
}

export async function createPassword(data: PasswordData): Promise<PasswordData> {
  const key = await getKeyFromStorage();
  if (!key) throw new Error("Clé de chiffrement indisponible");

  const encrypted_password = await encryptText(data.password, key);
  const payload = {
    name: data.name,
    username: data.username,
    category: data.category,
    encrypted_password,
  };

  const response = await api.post("/passwords/", payload);
  return { ...response.data, password: data.password };
}

export async function updatePassword(id: number, data: PasswordData): Promise<PasswordData> {
  const key = await getKeyFromStorage();
  if (!key) throw new Error("Clé de chiffrement indisponible");

  const encrypted_password = await encryptText(data.password, key);
  const payload = {
    name: data.name,
    username: data.username,
    category: data.category,
    encrypted_password,
  };

  const response = await api.put(`/passwords/${id}`, payload);
  return { ...response.data, password: data.password };
}

export async function deletePassword(id: number): Promise<void> {
  await api.delete(`/passwords/${id}`);
}