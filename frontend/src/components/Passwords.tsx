import {
  Key,
  Plus,
} from 'lucide-react';

import ErrorDisplay from './ErrorDisplay';
import GridItem from './GridItem';
import ListItem from './ListItem';

export default function Passwords({
  error,
  setError,
  loading,
  passwords,
  filteredPasswords,
  searchTerm,
  viewMode,
  visiblePasswords,
  togglePasswordVisibility,
  copiedId,
  copyToClipboard,
  startEdit,
  handleDelete,
  setShowAddModal,
  setModalPasswordId,
  setModalPasswordName,
  setShareModalPassword,
}) {
    return (
        <div className="flex-1 p-6">
            <ErrorDisplay error={error} setError={setError} />
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
                                    : "Commencez par ajouter votre premier mot de passe"
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
                                  <GridItem
                                    password={password}
                                    visiblePasswords={visiblePasswords}
                                    togglePasswordVisibility={togglePasswordVisibility}
                                    copyToClipboard={copyToClipboard}
                                    copiedId={copiedId}
                                    startEdit={startEdit}
                                    handleDelete={handleDelete}
                                    loading={loading}
                                    setModalPasswordId={setModalPasswordId}
                                    setModalPasswordName={setModalPasswordName}
                                    setShareModalPassword={setShareModalPassword}
                                  />
                                ) : (
                                    <ListItem
                                        password={password}
                                        visiblePasswords={visiblePasswords}
                                        togglePasswordVisibility={togglePasswordVisibility}
                                        copyToClipboard={copyToClipboard}
                                        copiedId={copiedId}
                                        startEdit={startEdit}
                                        setModalPasswordId={setModalPasswordId}
                                        setModalPasswordName={setModalPasswordName}
                                        setShareModalPassword={setShareModalPassword}
                                        handleDelete={handleDelete}
                                    />
                                )}
                            </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}