import React, { useEffect, useState } from "react";
import {
  fetchPasswords,
  createPassword,
  updatePassword,
  deletePassword,
} from "../api/password";
import type { PasswordData } from "../api/password";
import PasswordVersionsModal from "./PasswordVersionsModal";
import SharePasswordModal from "./SharePasswordModal";

import { getKeyFromStorage, decryptText } from "../utils/crypto";

export default function PasswordDashboard() {
  const [passwords, setPasswords] = useState<PasswordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<PasswordData>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const [modalPasswordId, setModalPasswordId] = useState<number | null>(null);
  const [modalPasswordName, setModalPasswordName] = useState<string>("");

  const [shareModalPassword, setShareModalPassword] = useState<{
    password: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    loadPasswords();
  }, []);

  async function loadPasswords() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPasswords();
      setPasswords(data);
    } catch (e: any) {
      setError(e.message || "Erreur lors du chargement");
    }
    setLoading(false);
  }

  function resetForm() {
    setForm({});
    setEditingId(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.password) {
      setError("Nom et mot de passe sont requis");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (editingId) {
        const updated = await updatePassword(editingId, form as PasswordData);
        setPasswords((prev) =>
          prev.map((p) => (p.id === editingId ? updated : p))
        );
      } else {
        const created = await createPassword(form as PasswordData);
        setPasswords((prev) => [...prev, created]);
      }
      resetForm();
    } catch (e: any) {
      setError(e.message || "Erreur lors de l'enregistrement");
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Supprimer ce mot de passe ?")) return;
    setLoading(true);
    try {
      await deletePassword(id);
      setPasswords((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      setError(e.message || "Erreur lors de la suppression");
    }
    setLoading(false);
  }

  function startEdit(p: PasswordData) {
    setEditingId(p.id ?? null);
    setForm({
      name: p.name,
      username: p.username ?? "",
      category: p.category ?? "",
      password: p.password ?? "",
    });
  }

  function generateStrongPassword(length = 16) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 16 }}>
      <h2>Gestionnaire de mots de passe</h2>

      {error && (
        <div style={{ background: "#fcc", padding: 8, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div>
          <input
            name="name"
            placeholder="Nom"
            value={form.name || ""}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        <div>
          <input
            name="username"
            placeholder="Nom d'utilisateur (optionnel)"
            value={form.username || ""}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div>
          <input
            name="category"
            placeholder="Catégorie (optionnel)"
            value={form.category || ""}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={form.password || ""}
            onChange={handleChange}
            disabled={loading}
            required
            style={{ flexGrow: 1 }}
          />
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, password: generateStrongPassword() }))}
            disabled={loading}
            style={{ marginLeft: 8 }}
          >
            Générer
          </button>
        </div>
        <button type="submit" disabled={loading}>
          {editingId ? "Mettre à jour" : "Ajouter"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            style={{ marginLeft: 8 }}
          >
            Annuler
          </button>
        )}
      </form>

      {loading && !form.name && <p>Chargement...</p>}

      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Utilisateur</th>
            <th>Catégorie</th>
            <th>Mot de passe</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {passwords.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.username || "-"}</td>
              <td>{p.category || "-"}</td>
              <td>
                <input
                  type="text"
                  readOnly
                  value={p.password || ""}
                  style={{ width: "100%" }}
                />
              </td>
              <td>
                <button onClick={() => startEdit(p)} disabled={loading}>
                  Éditer
                </button>{" "}
                <button onClick={() => handleDelete(p.id!)} disabled={loading}>
                  Supprimer
                </button>
                <button
                  className="text-blue-600 underline"
                  onClick={() => {
                    setModalPasswordId(p.id!);
                    setModalPasswordName(p.name);
                  }}
                >
                  Versions
                </button>
                <button
                  className="text-green-600 underline"
                  onClick={() => setShareModalPassword({
                    password: p.password,
                    name: p.name,
                  })}
                  disabled={loading}
                >
                  Partager
                </button>
              </td>
            </tr>
          ))}

          {passwords.length === 0 && !loading && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Aucun mot de passe trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalPasswordId && (
        <PasswordVersionsModal
          passwordId={modalPasswordId}
          name={modalPasswordName}
          onClose={() => setModalPasswordId(null)}
        />
      )}

      {shareModalPassword && (
        <SharePasswordModal
          password={shareModalPassword.password}
          name={shareModalPassword.name}
          onClose={() => setShareModalPassword(null)}
          onLinkCreated={({ url }) => {
            alert(`Lien créé : ${url}`);
            setShareModalPassword(null);
          }}
        />
      )}
    </div>
  );
}