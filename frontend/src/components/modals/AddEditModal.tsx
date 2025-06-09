import { Plus, Edit, Shuffle } from "lucide-react";
export default function AddEditModal({
  showAddModal,
  editingId,
  form,
  handleSubmit,
  handleChange,
  loading,
  setForm,
  generateStrongPassword,
  resetForm,
}) {
    return (
        <>
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
        </>
    );
}