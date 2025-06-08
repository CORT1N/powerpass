import React, { useState } from "react";
import { createSharedLink } from "../api/sharedLinks";
import type { SharedPasswordLinkRead } from "../api/sharedLinks";

interface Props {
  password: string;
  name: string;
  onClose: () => void;
  onLinkCreated: (link: { url: string; token: string }) => void;
}

export default function SharePasswordModal({ password, name, onClose, onLinkCreated }: Props) {
  const [expiresIn, setExpiresIn] = useState<number | undefined>();
  const [maxViews, setMaxViews] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await createSharedLink(password, {
        expires: expiresIn,
        maxViews,
      });
      setSharedUrl(result.url);
      onLinkCreated(result);
    } catch (e: any) {
      setError(e.message || "Erreur lors de la création du lien");
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: "white", padding: 24, minWidth: 320, position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Partager le mot de passe: {name}</h3>

        {error && <div style={{ color: "red" }}>{error}</div>}

        {sharedUrl ? (
          <div>
            <p>Lien partagé créé :</p>
            <textarea
              readOnly
              style={{ width: "100%", height: 60 }}
              value={sharedUrl}
            />
            <button onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Expiration (minutes) (optionnel) :
                <input
                  type="number"
                  min={1}
                  value={expiresIn ?? ""}
                  onChange={(e) => setExpiresIn(e.target.value ? Number(e.target.value) : undefined)}
                  disabled={loading}
                />
              </label>
            </div>
            <div>
              <label>
                Nombre maximum de vues (optionnel) :
                <input
                  type="number"
                  min={1}
                  value={maxViews ?? ""}
                  onChange={(e) => setMaxViews(e.target.value ? Number(e.target.value) : undefined)}
                  disabled={loading}
                />
              </label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer le lien"}
            </button>{" "}
            <button type="button" onClick={onClose} disabled={loading}>
              Annuler
            </button>
          </form>
        )}
      </div>
    </div>
  );
}