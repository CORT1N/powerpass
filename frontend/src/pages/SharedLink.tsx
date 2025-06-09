import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedLink } from "../api/sharedLinks";
import { decryptFromShare } from "../utils/crypto";
import { Eye, EyeOff, Copy, CheckCircle2 } from "lucide-react";
import { useBackground } from "../context/BackgroundContext";

export default function SharedLinkPage() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string | null>(null);
  const [meta, setMeta] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const { bgUrl } = useBackground();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

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
    const keyB64url = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";

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
        const clear = await decryptFromShare(link.ciphertext, link.nonce, keyB64url);
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

  function copyToClipboard() {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  if (loading) return <p>Chargement…</p>;
  if (error) return <p className="max-w-xl mx-auto text-center text-red-400">{error}</p>;
  if (!meta || !password) return null;

  return (
    <>
      {bgUrl && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-sm
            after:content-[''] after:absolute after:inset-0 after:bg-black/40"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
      )}
      <div className="relative z-10 flex justify-center items-center h-screen p-4">
        <div className="bg-background-tertiary/90 backdrop-blur-md rounded-lg shadow-lg max-w-lg w-full p-6 flex flex-col space-y-4">
          <h2 className="text-white font-bold text-xl truncate">{meta.name || "Lien partagé"}</h2>

          <div className="flex items-center space-x-3">
            <input
              type={visible ? "text" : "password"}
              value={password}
              readOnly
              className="input-primary flex-grow pr-10 font-mono text-sm bg-background-tertiary/50 text-white"
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={() => setVisible(!visible)}
              className="btn-icon text-white hover:text-primary-500"
              aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              title={visible ? "Masquer" : "Afficher"}
            >
              {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            <button
              onClick={copyToClipboard}
              className="btn-icon text-white hover:text-green-400"
              aria-label="Copier le mot de passe"
              title="Copier"
            >
              {copied ? (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>

          <p className="text-sm text-text-secondary">
            Créé le : {new Date(meta.created_at).toLocaleString()}
          </p>
          <p className="text-sm text-text-secondary">
            Durée de vie : {meta.expires_at ? timeLeft ?? "Calcul..." : "Illimitée"}
          </p>
          <p className="text-sm text-text-secondary">
            Vues :{" "}
            {meta.max_views !== null && meta.max_views !== undefined
              ? `${meta.view_count} / ${meta.max_views}`
              : `illimité (${meta.view_count})`}
          </p>
        </div>
      </div>
    </>
  );
}