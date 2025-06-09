import React, { useState } from "react";
import { createSharedLink } from "../api/sharedLinks";
import { X, Share2, Clock, Eye, Link as LinkIcon, Copy } from "lucide-react";

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

  const copyToClipboard = async () => {
    if (sharedUrl) {
      try {
        await navigator.clipboard.writeText(sharedUrl);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background-secondary border border-gray-700 rounded-xl w-full max-w-md animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Share2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Partager le mot de passe</h3>
              <p className="text-text-secondary text-sm">{name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {sharedUrl ? (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="p-3 bg-green-500/20 rounded-full w-fit mx-auto mb-3">
                  <LinkIcon className="h-6 w-6 text-green-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-1">Lien créé avec succès !</h4>
                <p className="text-text-secondary text-sm">Partagez ce lien de manière sécurisée</p>
              </div>
              
              <div>
                <label className="block text-text-secondary text-sm mb-2">Lien de partage</label>
                <div className="flex space-x-2">
                  <textarea
                    readOnly
                    value={sharedUrl}
                    className="input-primary flex-1 min-h-[80px] resize-none font-mono text-xs"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="btn-secondary px-4 flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <button onClick={onClose} className="btn-primary w-full">
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-text-secondary text-sm mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Expiration (minutes)</span>
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="Optionnel - Lien permanent si vide"
                  value={expiresIn ?? ""}
                  onChange={(e) => setExpiresIn(e.target.value ? Number(e.target.value) : undefined)}
                  disabled={loading}
                  className="input-primary w-full"
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2 text-text-secondary text-sm mb-2">
                  <Eye className="h-4 w-4" />
                  <span>Nombre maximum de vues</span>
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="Optionnel - Vues illimitées si vide"
                  value={maxViews ?? ""}
                  onChange={(e) => setMaxViews(e.target.value ? Number(e.target.value) : undefined)}
                  disabled={loading}
                  className="input-primary w-full"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? "Création..." : "Créer le lien"}
                </button>
                <button 
                  type="button" 
                  onClick={onClose} 
                  disabled={loading}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
