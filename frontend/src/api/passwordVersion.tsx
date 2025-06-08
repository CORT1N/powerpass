import api from "./api";
import { decryptText, getKeyFromStorage } from "../utils/crypto";

export interface PasswordVersion {
  id: number;
  password_id: number;
  encrypted_password: string;
  modified_at: string;
  modified_by?: number | null;
  password?: string;
}

export async function fetchPasswordVersions(passwordId: number): Promise<PasswordVersion[]> {
  const key = await getKeyFromStorage();
  if (!key) throw new Error("Clé de chiffrement indisponible");
  const { data } = await api.get(`/password_versions/password/${passwordId}`);
  const versions: PasswordVersion[] = await Promise.all(
    data.map(async (v: PasswordVersion) => ({
      ...v,
      password: await decryptText(v.encrypted_password, key),
    }))
  );
  return versions;
}
