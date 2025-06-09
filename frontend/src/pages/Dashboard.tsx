import React, { useState, useEffect } from "react";
import { useBackground } from "../context/BackgroundContext";
import Header from "../components/Header";
import SubHeader from "../components/SubHeader";
import Sidebar from "../components/Sidebar";
import Passwords from "../components/Passwords";
import AddEditModal from "../components/modals/AddEditModal";
import PasswordVersionsModal from "../components/modals/PasswordVersionsModal";
import SharePasswordModal from "../components/modals/SharePasswordModal";
import {
  fetchPasswords,
  createPassword,
  updatePassword,
  deletePassword,
} from "../api/password";
import type { PasswordData } from "../api/password";

export default function Dashboard() {
  const { bgUrl } = useBackground();

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

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

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
    setShowAddModal(false);
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
    setShowAddModal(true);
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

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const categories = ['all', ...Array.from(new Set(
    passwords
      .map(p => p.category)
      .filter((c): c is string => typeof c === 'string' && c.length > 0)
  ))];

  const filteredPasswords = passwords.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.username && p.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {bgUrl && (
            <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-sm
                        after:content-[''] after:absolute after:inset-0 after:bg-black/30"
            style={{ backgroundImage: `url(${bgUrl})` }}
            />
      )}
      <Header />
      <main className="animate-fade-in-down">
        <SubHeader
          passwords={passwords}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredPasswords={filteredPasswords}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setShowAddModal={setShowAddModal}
        />
        <div className="flex">
          <Sidebar
            categories={categories}
            passwords={passwords}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filteredPasswords={filteredPasswords}
          />
          <Passwords
            error={error}
            setError={setError}
            loading={loading}
            passwords={passwords}
            filteredPasswords={filteredPasswords}
            searchTerm={searchTerm}
            viewMode={viewMode}
            visiblePasswords={visiblePasswords}
            togglePasswordVisibility={togglePasswordVisibility}
            copiedId={copiedId}
            copyToClipboard={copyToClipboard}
            startEdit={startEdit}
            handleDelete={handleDelete}
            setShowAddModal={setShowAddModal}
            setModalPasswordId={setModalPasswordId}
            setModalPasswordName={setModalPasswordName}
            setShareModalPassword={setShareModalPassword}
          />
        </div>
        <AddEditModal
          showAddModal={showAddModal}
          editingId={editingId}
          form={form}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          loading={loading}
          setForm={setForm}
          generateStrongPassword={generateStrongPassword}
          resetForm={resetForm}
        />
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
      </main>
    </div>
  );
}
