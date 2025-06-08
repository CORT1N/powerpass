import { fetchPasswordVersions } from "../api/passwordVersion";

import { useEffect, useState } from "react";

import type { PasswordVersion } from "../api/passwordVersion";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
        <h3 className="text-xl font-semibold mb-4">Versions – {name}</h3>
        <button className="absolute top-2 right-2" onClick={onClose}>✕</button>
        {loading && <p>Chargement…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Mot de passe</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.id} className="border-t">
                  <td className="p-2">{new Date(v.modified_at).toLocaleString()}</td>
                  <td className="p-2 font-mono break-all">{v.password}</td>
                </tr>
              ))}
              {versions.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center p-4">Aucune version</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}