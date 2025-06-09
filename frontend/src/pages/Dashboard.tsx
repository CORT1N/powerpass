
import PasswordDashboard from "../components/PasswordDashboard";
import Logo from "../components/Logo";
import { Lock, Key } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-gray-950 to-background-secondary">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-background-secondary to-background-tertiary border-b border-gray-700/50 px-8 py-6 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg animate-pulse-orange">
              <Logo size={10}/>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                PowerPass
              </h1>
              <p className="text-text-secondary text-sm font-medium">
                Gestionnaire de mots de passe sécurisé
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 bg-background-tertiary/50 px-4 py-2 rounded-full border border-gray-700/50">
              <Lock className="h-4 w-4 text-primary-500" />
              <span className="text-sm font-medium text-text-secondary">Chiffrement AES-256</span>
              <div className="status-indicator status-success"></div>
            </div>

            <div className="flex items-center space-x-2 bg-background-tertiary/50 px-4 py-2 rounded-full border border-gray-700/50">
              <Key className="h-4 w-4 text-text-muted" />
              <span className="text-sm text-text-secondary">Sécurisé</span>
            </div>
          </div>
        </div>
      </header>
      <main className="animate-fade-in-down">
        <PasswordDashboard />
      </main>
    </div>
  );
}
