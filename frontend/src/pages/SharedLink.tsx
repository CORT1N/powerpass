import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedLink } from "../api/sharedLinks";
import { decryptFromShare } from "../utils/crypto";
import type { SharedPasswordLinkRead } from "../api/sharedLinks";

export default function SharedLinkPage() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string | null>(null);
  const [meta, setMeta] = useState<SharedPasswordLinkRead | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  function calculateTimeLeft(expireISO: string | null | undefined): string | null {
    if (!expireISO) return null;

    const expireDate = new Date(expireISO);
    const now = new Date();
    const diffMs = expireDate.getTime() - now.getTime();

    if (diffMs <= 0) return "Expiré";

    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    return `${minutes} min${seconds > 0 ? ` ${seconds} s` : ""}`;
  }

  useEffect(() => {
    const keyB64url = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : "";

    if (!token) {
      setError("Token invalide");
      setLoading(false);
      return;
    }
    if (!keyB64url) {
      setError("Clé absente dans l’URL (#...)");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const link = await getSharedLink(token);
        const clear = await decryptFromShare(
          link.ciphertext,
          link.nonce,
          keyB64url
        );
        setPassword(clear);
        setMeta(link);

        setTimeLeft(calculateTimeLeft(link.expires_at));
      } catch (err: any) {
        if (err?.status === 404) setError("Lien partagé non trouvé");
        else if (err?.status === 410) setError("Lien partagé expiré");
        else if (err?.status === 403) setError("Limite de vues atteinte");
        else setError("Erreur inconnue");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!meta?.expires_at) return;

    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft(meta.expires_at));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [meta]);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p style={{ maxWidth: 600, margin: "auto" }}>{error}</p>;

  if (!meta || !password) return null;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 16 }}>
      <h2>Mot de passe partagé</h2>
      <p>
        <strong>Mot de passe :</strong>{" "}
        <input
          type="text"
          readOnly
          value={password}
          style={{ width: "100%" }}
          onFocus={(e) => e.target.select()}
        />
      </p>
      <p>
        <small>
          Créé le : {new Date(meta.created_at).toLocaleString()}{" "}
          | Durée de vie :{" "}
          {meta.expires_at ? timeLeft ?? "Calcul..." : "Illimitée"}{" "}
          | Vues :{" "}
          {meta.max_views !== null && meta.max_views !== undefined
            ? `${meta.view_count} / ${meta.max_views}`
            : `illimité (${meta.view_count})`}
        </small>
      </p>
    </div>
  );
}