import { TrendingUp } from 'lucide-react';

export default function Stats({ passwords, categories, filteredPasswords }) {
    return (
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
    )
}