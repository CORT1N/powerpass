import api from "./api";

import { encryptForShare } from "../utils/crypto";

export interface SharedPasswordLinkCreate {
  ciphertext: string;
  nonce: string;
  algo?: string;
  expires_in_minutes?: number;
  max_views?: number;
}

export interface SharedPasswordLinkRead {
  token: string;
  ciphertext: string;
  nonce: string;
  algo: string;
  created_by?: number | null;
  created_at: string;
  expires_at?: string | null;
  max_views?: number | null;
  view_count: number;
}

export async function createSharedLink(
  clearPassword: string,
  opts?: { expires?: number; maxViews?: number }
) {
  const { ciphertext, nonce, key } = await encryptForShare(clearPassword);

  const payload: SharedPasswordLinkCreate = {
    ciphertext,
    nonce,
    expires_in_minutes: opts?.expires,
    max_views: opts?.maxViews,
  };
  const res = await api.post<SharedPasswordLinkRead>("/shared-links/", payload);

  const url =
    `${window.location.origin}/shared-links/${res.data.token}` +
    `#${key}`;

  return { url, token: res.data.token };
}
export const getSharedLink = async (token: string) =>
  (await api.get<SharedPasswordLinkRead>(`/shared-links/${token}`)).data;