import { Eye, EyeOff, Copy, CheckCircle2, Edit, History, Share2, Trash2 } from "lucide-react";

export default function ListItem({
  password,
  visiblePasswords,
  togglePasswordVisibility,
  copyToClipboard,
  copiedId,
  startEdit,
  setModalPasswordId,
  setModalPasswordName,
  setShareModalPassword,
  handleDelete,
}) {
    return (
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
    )
}