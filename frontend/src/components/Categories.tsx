import { Tag } from 'lucide-react';

export default function Categories({
  categories,
  passwords,
  selectedCategory,
  setSelectedCategory,
}) {
    return (
        <div>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Tag className="h-4 w-4" />
                <span>Catégories</span>
            </h3>
            <div className="space-y-1">
                {categories.map((category) => {
                    const count = category === 'all' 
                    ? passwords.length 
                    : passwords.filter(p => p.category === category).length;
                    return (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 group ${
                            selectedCategory === category
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                : 'text-text-secondary hover:text-white hover:bg-background-accent/50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="capitalize font-medium">
                                    {category === 'all' ? 'Tous' : category || 'Sans catégorie'}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    selectedCategory === category
                                    ? 'bg-white/20 text-white'
                                    : 'bg-background-accent text-text-muted group-hover:text-text-secondary'
                                }`}>
                                    {count}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}