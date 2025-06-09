import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, setSearchTerm, filteredPasswords }) {
    return (
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
    );
}