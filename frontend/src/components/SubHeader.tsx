import { Key } from 'lucide-react';

import SearchBar from './SearchBar';
import ViewToggle from './ViewToggle';
import AddButton from './AddButton';

export default function SubHeader({
    passwords,
    searchTerm,
    setSearchTerm,
    filteredPasswords,
    viewMode,
    setViewMode,
    setShowAddModal,
}) {
    return (
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
                            </div>
                        </div>
                    </div>
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filteredPasswords={filteredPasswords}
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <ViewToggle
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                    />
                    <AddButton
                        setShowAddModal={setShowAddModal}
                    />
                </div>
            </div>
        </div>
    )
}