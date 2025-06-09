import { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, Key, AlertTriangle } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useBackground } from "../context/BackgroundContext";


export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { bgUrl } = useBackground();

    const location = useLocation();
    const isLogin = location.pathname === "/login";
    const [confirmPassword, setConfirmPassword] = useState("");


    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!isLogin && password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setIsLoading(false);
            return;
        }
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <main className="min-h-screen flex justify-center items-center">
        {bgUrl && (
            <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-sm
                        after:content-[''] after:absolute after:inset-0 after:bg-black/30"
            style={{ backgroundImage: `url(${bgUrl})` }}
            />
        )}
        <div className="z-10 flex flex-row items-center justify-center gap-32 max-w-6xl mx-auto px-8">
            <div className="animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                <Logo size={450} />
            </div>
            <form
            onSubmit={handleSubmit}
            className="glass-effect p-10 rounded-3xl space-y-6 animate-slide-in-right w-full max-w-md"
            key={location.pathname}
            >
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-center pb-5">{isLogin ? "Connexion" : "Inscription"}</h2>
                    <div>
                        <label className="block text-text-secondary text-sm font-medium mb-2">
                            Adresse email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                            <input
                                type="email"
                                placeholder="you@xyz.com"
                                className="input-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-text-secondary text-sm font-medium mb-2">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                            <input
                                type="password"
                                placeholder="••••••••••••••••"
                                className="input-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    {!isLogin && (
                    <div>
                        <label className="block text-text-secondary text-sm font-medium mb-2">
                        Confirmez le mot de passe
                        </label>
                        <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                        <input
                            type="password"
                            placeholder="••••••••••••••••"
                            className="input-primary"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        </div>
                    </div>
                    )}
                </div>
                {error && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500 rounded-md px-4 py-3 text-sm mb-2 animate-fade-in">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-700" />
                    <span>{error}</span>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                    <div className="spinner w-5 h-5"></div>
                    ) : (
                    <>
                        <span>{isLogin ? "Se connecter" : "S'inscrire"}</span>
                        <ArrowRight className="h-5 w-5" />
                    </>
                    )}
                </button>
                <p className="text-sm text-text-secondary font-light text-center">
                    {isLogin ? "Pas de compte ?" : "Déjà un compte ?"}{" "}
                    <Link
                        to={isLogin ? "/register" : "/login"}
                        className="link-animated font-semibold"
                        onClick={() => {
                            setError("");
                            setEmail("");
                            setPassword("");
                            setConfirmPassword("");
                        }}
                    >
                        {isLogin ? "S’inscrire" : "Se connecter"}
                    </Link>
                </p>
            </form>
        </div>
        <div className="absolute bottom-10 flex items-center space-x-3">
            <Key className="h-4 w-4" />
            <span className="text-sm font-medium">Chiffrement AES-256</span>
            <div className="status-indicator status-success animate-pulse"></div>
        </div>
    </main>
  );
}