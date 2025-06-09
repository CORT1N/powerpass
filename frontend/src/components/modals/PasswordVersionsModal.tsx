
import { fetchPasswordVersions } from "../../api/passwordVersion";
import { useEffect, useState } from "react";
import type { PasswordVersion } from "../../api/passwordVersion";
import { X, History, Calendar, Key, Clock } from "lucide-react";

interface Props {
  passwordId: number | null;
  onClose: () => void;
  name: string;
}

export default function PasswordVersionsModal({ passwordId, onClose, name }: Props) {
  const [versions, setVersions] = useState<PasswordVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!passwordId) return;
    (async () => {
      try {
        const v = await fetchPasswordVersions(passwordId);
        setVersions(v);
      } catch (e: any) {
        setError(e.message || "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, [passwordId]);

  if (!passwordId) return null;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="glass-effect border border-gray-700/50 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl border border-primary-500/30">
              <History className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Historique des versions
              </h3>
              <p className="text-text-secondary text-sm font-medium">{name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-background-accent rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X className="h-6 w-6 text-text-muted hover:text-white transition-colors" />
          </button>
        </div>

        {/* Enhanced Content */}
        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="spinner mb-4"></div>
              <p className="text-text-secondary">Chargement des versions...</p>
            </div>
          )}
          
          {error && (
            <div className="p-6 text-center">
              <div className="inline-flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="status-indicator status-error"></div>
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}
          
          {!loading && !error && (
            <div className="overflow-auto">
              {versions.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-background-tertiary rounded-2xl mb-4">
                    <History className="h-8 w-8 text-text-muted" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Aucune version</h4>
                  <p className="text-text-secondary">Aucun historique trouvé pour ce mot de passe</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <Clock className="h-5 w-5 text-primary-500" />
                    <span className="text-sm font-medium text-text-secondary">
                      {versions.length} version{versions.length > 1 ? 's' : ''} trouvée{versions.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {versions.map((version, index) => (
                    <div
                      key={version.id}
                      className="card hover-lift"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-background-tertiary rounded-lg">
                            <Calendar className="h-4 w-4 text-primary-500" />
                          </div>
                          <div>
                            <span className="text-white font-medium">
                              Version {versions.length - index}
                            </span>
                            <p className="text-text-secondary text-sm">
                              {new Date(version.modified_at).toLocaleString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        {index === 0 && (
                          <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-medium rounded-full border border-primary-500/30">
                            Actuelle
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Key className="h-4 w-4 text-text-muted flex-shrink-0" />
                        <input
                          type="text"
                          value={version.password}
                          readOnly
                          className="input-primary flex-1 font-mono text-sm"
                          onClick={(e) => e.currentTarget.select()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
