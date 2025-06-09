import { Grid, List } from 'lucide-react';

export default function ViewToggle({ viewMode, setViewMode }) {
    return (
        <div className="flex items-center bg-background-tertiary/50 rounded-xl p-1 border border-gray-700/30">
            <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                    ? 'bg-primary-500 text-white shadow-lg' 
                    : 'text-text-muted hover:text-white hover:bg-background-accent'
                }`}
            >
                <Grid className="h-4 w-4" />
            </button>
            <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                    ? 'bg-primary-500 text-white shadow-lg' 
                    : 'text-text-muted hover:text-white hover:bg-background-accent'
                }`}
            >
                <List className="h-4 w-4" />
            </button>
        </div>
    );
}