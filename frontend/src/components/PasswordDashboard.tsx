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
import { 
  Plus, 
  Search, 
  Eye, 
  EyeOff, 
  Copy, 
  Edit, 
  Trash2, 
  History, 
  Share2,
  Key,
  User,
  Tag,
  AlertCircle,
  Shuffle,
  Grid,
  List,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

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
    <div className="min-h-screen bg-background-primary">
      {/* Enhanced Top Bar */}
      <div className="glass-effect border-b border-gray-700/30 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl">
                <Key className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Coffre-fort
                </h2>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-text-secondary text-sm">{passwords.length} mots de passe</span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span className="text-green-400 text-xs font-medium">Sécurisé</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="text"
                placeholder="Rechercher par nom, utilisateur ou catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-primary w-full pl-12 py-3 bg-background-tertiary/50 border-gray-700/50"
              />
              {searchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-text-muted">
                  {filteredPasswords.length} résultat{filteredPasswords.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Enhanced View Toggle */}
            <div className="flex items-center bg-background-tertiary/50 rounded-xl p-1 border border-gray-700/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-primary-500 text-white shadow-lg' 
                    : 'text-text-muted hover:text-white hover:bg-background-accent'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white shadow-lg' 
                    : 'text-text-muted hover:text-white hover:bg-background-accent'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Enhanced Add Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span>Nouveau</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <div className="w-64 bg-background-secondary/50 backdrop-blur-sm border-r border-gray-700/30 h-[calc(100vh-80px)] p-6">
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Tag className="h-4 w-4" />
                <span>Catégories</span>
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const count = category === 'all' 
                    ? passwords.length 
                    : passwords.filter(p => p.category === category).length;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 group ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                          : 'text-text-secondary hover:text-white hover:bg-background-accent/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="capitalize font-medium">
                          {category === 'all' ? 'Tous' : category || 'Sans catégorie'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedCategory === category
                            ? 'bg-white/20 text-white'
                            : 'bg-background-accent text-text-muted group-hover:text-text-secondary'
                        }`}>
                          {count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="glass-card p-4">
              <h4 className="text-sm font-medium text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary-500" />
                <span>Statistiques</span>
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Total</span>
                  <span className="text-white font-bold text-lg">{passwords.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Catégories</span>
                  <span className="text-primary-500 font-semibold">{categories.length - 1}</span>
                </div>
                <div className="h-px bg-gray-700/50 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Recherche</span>
                  <span className="text-green-400 font-semibold">{filteredPasswords.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1 p-6">
          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 animate-fade-in-up">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-400">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          )}

          {/* Password Grid/List */}
          {loading && !passwords.length ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="spinner mb-4"></div>
              <p className="text-text-secondary">Chargement de vos mots de passe...</p>
            </div>
          ) : (
            <>
              {filteredPasswords.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-background-tertiary/50 rounded-2xl mb-6 animate-pulse-orange">
                    <Key className="h-10 w-10 text-text-muted" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {searchTerm ? "Aucun résultat" : "Votre coffre-fort est vide"}
                  </h3>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto">
                    {searchTerm 
                      ? "Essayez de modifier votre recherche ou explorez une autre catégorie" 
                      : "Commencez par ajouter votre premier mot de passe pour sécuriser vos comptes"
                    }
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="btn-primary text-lg px-8 py-4"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Ajouter mon premier mot de passe
                    </button>
                  )}
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                  {filteredPasswords.map((password, index) => (
                    <div
                      key={password.id}
                      className={`password-card group ${
                        viewMode === 'list' ? 'flex items-center space-x-6 p-4' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          {/* Enhanced Grid View */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white text-lg truncate group-hover:text-primary-500 transition-colors">
                                {password.name}
                              </h3>
                              {password.username && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <User className="h-4 w-4 text-text-muted" />
                                  <span className="text-text-secondary text-sm truncate">{password.username}</span>
                                </div>
                              )}
                              {password.category && (
                                <div className="mt-2">
                                  <span className="category-badge">
                                    {password.category}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mb-6">
                            <label className="flex items-center space-x-2 text-text-muted text-sm mb-3">
                              <Key className="h-4 w-4" />
                              <span>Mot de passe</span>
                            </label>
                            <div className="flex items-center space-x-2">
                              <div className="relative flex-1">
                                <input
                                  type={visiblePasswords.has(password.id!) ? "text" : "password"}
                                  value={password.password || ""}
                                  readOnly
                                  className="input-primary w-full pr-10 font-mono bg-background-tertiary/50"
                                />
                                <button
                                  onClick={() => togglePasswordVisibility(password.id!)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 btn-icon"
                                >
                                  {visiblePasswords.has(password.id!) ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                              <button
                                onClick={() => copyToClipboard(password.password, password.id!)}
                                className="btn-icon tooltip"
                                data-tooltip="Copier"
                              >
                                {copiedId === password.id ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => startEdit(password)}
                                className="btn-icon tooltip"
                                data-tooltip="Éditer"
                                disabled={loading}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(password.id!)}
                                className="btn-icon hover:border-red-500/50 hover:text-red-400 tooltip"
                                data-tooltip="Supprimer"
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setModalPasswordId(password.id!);
                                  setModalPasswordName(password.name);
                                }}
                                className="btn-icon tooltip"
                                data-tooltip="Historique"
                              >
                                <History className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setShareModalPassword({
                                  password: password.password,
                                  name: password.name,
                                })}
                                className="btn-icon hover:border-green-500/50 hover:text-green-400 tooltip"
                                data-tooltip="Partager"
                                disabled={loading}
                              >
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Enhanced List View */
                        <>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-lg truncate group-hover:text-primary-500 transition-colors">
                              {password.name}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1">
                              {password.username && (
                                <span className="text-text-secondary text-sm truncate">{password.username}</span>
                              )}
                              {password.category && (
                                <span className="category-badge">
                                  {password.category}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="relative w-48">
                              <input
                                type={visiblePasswords.has(password.id!) ? "text" : "password"}
                                value={password.password || ""}
                                readOnly
                                className="input-primary w-full pr-10 font-mono text-sm bg-background-tertiary/50"
                              />
                              <button
                                onClick={() => togglePasswordVisibility(password.id!)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 btn-icon"
                              >
                                {visiblePasswords.has(password.id!) ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            
                            <button
                              onClick={() => copyToClipboard(password.password, password.id!)}
                              className="btn-icon tooltip"
                              data-tooltip="Copier"
                            >
                              {copiedId === password.id ? (
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                            
                            <button
                              onClick={() => startEdit(password)}
                              className="btn-icon tooltip"
                              data-tooltip="Éditer"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => {
                                setModalPasswordId(password.id!);
                                setModalPasswordName(password.name);
                              }}
                              className="btn-icon tooltip"
                              data-tooltip="Historique"
                            >
                              <History className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => setShareModalPassword({
                                password: password.password,
                                name: password.name,
                              })}
                              className="btn-icon hover:border-green-500/50 hover:text-green-400 tooltip"
                              data-tooltip="Partager"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDelete(password.id!)}
                              className="btn-icon hover:border-red-500/50 hover:text-red-400 tooltip"
                              data-tooltip="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Enhanced Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="glass-effect border border-gray-700/50 rounded-2xl p-8 w-full max-w-lg animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl">
                {editingId ? <Edit className="h-6 w-6 text-primary-500" /> : <Plus className="h-6 w-6 text-primary-500" />}
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {editingId ? "Modifier le mot de passe" : "Nouveau mot de passe"}
                </h3>
                <p className="text-text-secondary text-sm">
                  {editingId ? "Mettez à jour les informations" : "Ajoutez un nouveau mot de passe sécurisé"}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-text-secondary text-sm mb-2 font-medium">Nom du service *</label>
                <input
                  name="name"
                  placeholder="Ex: Gmail, Facebook, Netflix..."
                  value={form.name || ""}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="input-primary w-full"
                />
              </div>
              
              <div>
                <label className="block text-text-secondary text-sm mb-2 font-medium">Nom d'utilisateur</label>
                <input
                  name="username"
                  placeholder="Email ou nom d'utilisateur"
                  value={form.username || ""}
                  onChange={handleChange}
                  disabled={loading}
                  className="input-primary w-full"
                />
              </div>
              
              <div>
                <label className="block text-text-secondary text-sm mb-2 font-medium">Catégorie</label>
                <input
                  name="category"
                  placeholder="Ex: Réseaux sociaux, Email, Banque..."
                  value={form.category || ""}
                  onChange={handleChange}
                  disabled={loading}
                  className="input-primary w-full"
                />
              </div>
              
              <div>
                <label className="block text-text-secondary text-sm mb-2 font-medium">Mot de passe *</label>
                <div className="flex space-x-2">
                  <input
                    name="password"
                    type="password"
                    placeholder="Votre mot de passe sécurisé"
                    value={form.password || ""}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="input-primary flex-1 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, password: generateStrongPassword() }))}
                    disabled={loading}
                    className="btn-secondary px-4 flex items-center space-x-2 tooltip"
                    data-tooltip="Générer un mot de passe fort"
                  >
                    <Shuffle className="h-4 w-4" />
                    <span>Générer</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary flex-1 py-4"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="spinner w-4 h-4"></div>
                      <span>Enregistrement...</span>
                    </div>
                  ) : (
                    editingId ? "Mettre à jour" : "Ajouter"
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="btn-secondary px-8 py-4"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
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
