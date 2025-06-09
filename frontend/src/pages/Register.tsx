
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { FormEvent } from "react";
import { Shield, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import Logo from "../components/Logo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await register(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-gray-950 to-background-secondary flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Logo section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 animate-pulse-orange">
            <Logo size={80} />
          </div>
        </div>

        {/* Register form */}
        <form
          onSubmit={handleSubmit}
          className="glass-effect p-8 rounded-2xl space-y-6 animate-slide-in-right"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <UserPlus className="h-6 w-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-white">Inscription</h2>
          </div>
          
          {error && (
            <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in-up">
              <div className="status-indicator status-error"></div>
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="input-primary w-full pl-12"
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
                  placeholder="••••••••"
                  className="input-primary w-full pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-text-muted mt-2">
                Utilisez un mot de passe fort avec au moins 8 caractères
              </p>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="spinner w-5 h-5"></div>
            ) : (
              <>
                <span>S'inscrire</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
          
          <p className="text-center text-sm text-text-secondary pt-4">
            Déjà un compte ?{" "}
            <Link 
              className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
              to="/login"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
