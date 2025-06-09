import { Eye, EyeOff, Key, User, Copy, CheckCircle2, Edit, Trash2, History, Share2 } from "lucide-react";

export default function GridItem({
  password,
  visiblePasswords,
  togglePasswordVisibility,
  copyToClipboard,
  copiedId,
  startEdit,
  handleDelete,
  loading,
  setModalPasswordId,
  setModalPasswordName,
  setShareModalPassword,
}) {
    return (
        <>
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
    );
}